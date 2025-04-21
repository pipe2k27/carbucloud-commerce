import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

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

// ✅ Create or Update a Web Element (PUT)
export async function createOrUpdateWebElement(element: WebElementTier1) {
  try {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: element,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Element saved successfully",
      data: element,
    };
  } catch (error) {
    console.error("[createOrUpdateWebElement] Error:", error);
    return {
      status: 500,
      message: "An error occurred while saving the element",
    };
  }
}

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

// ✅ Delete a Web Element
export async function deleteWebElement(companyId: string, elementId: string) {
  try {
    const deleteCommand = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        companyId,
        elementId,
      },
    });

    await dynamoDbClient.send(deleteCommand);

    return { status: 200, message: "Element deleted successfully" };
  } catch (error) {
    console.error("[deleteWebElement] Error:", error);
    return {
      status: 500,
      message: "An error occurred while deleting the element",
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
