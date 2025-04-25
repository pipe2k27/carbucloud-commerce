import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// 🔹 Define Web Element type
export type WebElementTier1 = {
  companyId: string; // Partition Key (PK)
  elementId: string; // Sort Key (SK)

  title?: string;
  subtitle?: string;
  aboutTitle?: string;
  aboutText?: string;
  updatedAt?: string;
  bannerImageUrl?: string;
  carrouselElement1?: string;
  carrouselElement2?: string;
  carrouselElement3?: string;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactHours?: string;
  theme?: string;
};

// ✅ Initialize DynamoDB Client
export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = "web-elements-tier1";

// ✅ Get a single Web Element
export async function getWebElement(companyId: string, elementId: string) {
  try {
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        companyId,
        elementId,
      },
    });

    const response = await dynamoDbClient.send(getCommand);

    if (!response.Item) {
      return { status: 404, message: "Element not found" };
    }

    return { status: 200, data: response.Item as WebElementTier1 };
  } catch (error) {
    console.error("[getWebElement] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving the element",
    };
  }
}

// ✅ Get all Web Elements by Company ID (QUERY)
export async function getWebElementsByCompanyId(companyId: string) {
  try {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "companyId = :companyId",
      ExpressionAttributeValues: {
        ":companyId": companyId,
      },
    });

    const response = await dynamoDbClient.send(queryCommand);

    return { status: 200, data: response.Items || [] };
  } catch (error) {
    console.error("[getWebElementsByCompanyId] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving elements",
    };
  }
}
