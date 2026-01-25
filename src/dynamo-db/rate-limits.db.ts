import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// Rate limit entry type
export type RateLimitEntry = {
  pk: string; // identifier#action (e.g., "+5491123456789#appointment")
  sk: string; // timestamp
  createdAt: string;
  expiresAt: number; // TTL for auto-cleanup (24 hours from creation)
};

// Initialize DynamoDB Client
const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = "rate-limits-tier1";

// Record a new rate limit entry
export async function recordRateLimitEntry(
  identifier: string,
  action: string
): Promise<void> {
  try {
    const now = Date.now();
    const expiresAt = Math.floor(now / 1000) + 86400; // 24 hours TTL

    const entry: RateLimitEntry = {
      pk: `${identifier}#${action}`,
      sk: String(now),
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    await dynamoDbClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: entry,
      })
    );
  } catch (error) {
    console.error("[recordRateLimitEntry] Error:", error);
    // Don't throw - rate limiting shouldn't break the main flow
  }
}

// Count entries for an identifier+action within a time window
export async function countRateLimitEntries(
  identifier: string,
  action: string,
  windowMs: number = 86400000 // 24 hours default
): Promise<number> {
  try {
    const now = Date.now();
    const windowStart = String(now - windowMs);

    const response = await dynamoDbClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND sk > :windowStart",
        ExpressionAttributeValues: {
          ":pk": `${identifier}#${action}`,
          ":windowStart": windowStart,
        },
        Select: "COUNT",
      })
    );

    return response.Count || 0;
  } catch (error) {
    console.error("[countRateLimitEntries] Error:", error);
    return 0; // On error, allow the request (fail open)
  }
}

// Check if a duplicate exists (same identifier + action + extra key like date)
export async function checkDuplicateEntry(
  identifier: string,
  action: string,
  uniqueKey: string,
  windowMs: number = 86400000
): Promise<boolean> {
  try {
    const now = Date.now();
    const windowStart = String(now - windowMs);

    const response = await dynamoDbClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND sk > :windowStart",
        FilterExpression: "contains(sk, :uniqueKey)",
        ExpressionAttributeValues: {
          ":pk": `${identifier}#${action}`,
          ":windowStart": windowStart,
          ":uniqueKey": uniqueKey,
        },
      })
    );

    return (response.Count || 0) > 0;
  } catch (error) {
    console.error("[checkDuplicateEntry] Error:", error);
    return false; // On error, allow the request
  }
}

// Clean up old entries (optional manual cleanup)
export async function cleanupExpiredEntries(pk: string): Promise<void> {
  try {
    const now = Date.now();
    const oneDayAgo = String(now - 86400000);

    const response = await dynamoDbClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "pk = :pk AND sk < :cutoff",
        ExpressionAttributeValues: {
          ":pk": pk,
          ":cutoff": oneDayAgo,
        },
      })
    );

    if (response.Items) {
      for (const item of response.Items) {
        await dynamoDbClient.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { pk: item.pk, sk: item.sk },
          })
        );
      }
    }
  } catch (error) {
    console.error("[cleanupExpiredEntries] Error:", error);
  }
}
