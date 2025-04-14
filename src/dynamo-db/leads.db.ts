import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export type LeadStatusType =
  | "new"
  | "contacted"
  | "interested"
  | "not-interested"
  | "converted"
  | "lost";

// 🔹 Define Lead type
export type Lead = {
  companyId: string;
  productId: string;
  leadId: string;
  leadName: string;
  email?: string;
  phone: string;
  createdAt: string;
  status: LeadStatusType;
  brand: string;
  model: string;
  year: string;
  mainImageUrl?: string;
};

// ✅ Initialize DynamoDB Client
export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = "leads-tier1";

// ✅ Create a new lead (PUT)
export async function createLead(lead: Lead) {
  try {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: lead,
    });

    await dynamoDbClient.send(putCommand);

    return { status: 200, message: "Lead recorded successfully", data: lead };
  } catch (error) {
    console.error("[createLead] Error:", error);
    return {
      status: 500,
      message: "An error occurred while recording the lead",
    };
  }
}
