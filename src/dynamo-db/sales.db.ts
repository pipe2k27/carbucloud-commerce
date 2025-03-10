import { errorObject } from "@/constants/api-constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Car } from "./cars.db";

// 🔹 Extend Car with Sales-specific properties
export type Sale = Car & {
  soldPrice: number;
  saleCost: number;
  seller: string;
  saleDate: string;
  profit: number;
};

// ✅ Initialize DynamoDB Client
export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = "sales-tier1"; // 🔹 Updated table name

// ✅ Create a new sale (PUT)
export async function createSale(sale: Sale) {
  try {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: sale,
    });

    await dynamoDbClient.send(putCommand);

    return { status: 200, message: "Sale recorded successfully", data: sale };
  } catch (error) {
    console.error("[createSale] Error:", error);
    return {
      status: 500,
      message: "An error occurred while recording the sale",
    };
  }
}

// ✅ Update an existing sale
export async function updateSale(
  productId: string,
  companyId: string,
  updates: Partial<Sale>
) {
  try {
    // Step 1: Fetch the existing sale
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { productId, companyId },
    });

    const { Item } = await dynamoDbClient.send(getCommand);

    if (!Item) {
      return { status: 404, message: "Sale not found" };
    }

    // Step 2: Merge the existing data with updates
    const updatedSale = { ...Item, ...updates };

    // Step 3: Put the updated sale back into DynamoDB
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedSale,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Sale updated successfully",
      data: updatedSale,
    };
  } catch (error) {
    console.error("[updateSale] Error:", error);
    return {
      status: 500,
      message: "An error occurred while updating the sale",
    };
  }
}

// ✅ Delete a sale (DELETE)
export async function deleteSale(productId: string, companyId: string) {
  try {
    const deleteCommand = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { productId, companyId },
    });

    await dynamoDbClient.send(deleteCommand);

    return { status: 200, message: "Sale deleted successfully" };
  } catch (error) {
    console.error("[deleteSale] Error:", error);
    return {
      status: 500,
      message: "An error occurred while deleting the sale",
    };
  }
}

// ✅ Get all sales for a given companyId (QUERY)
export async function getSalesByCompanyId(companyId: string): Promise<any> {
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
    console.error("[getSalesByCompanyId] Error:", error);
    return { status: 500, message: "An error occurred while retrieving sales" };
  }
}

// ✅ Get a single sale
export async function getSale(
  companyId: string,
  productId: string
): Promise<any> {
  try {
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        companyId, // Partition Key
        productId, // Sort Key
      },
    });

    const response = await dynamoDbClient.send(getCommand);

    if (!response.Item) {
      return { status: 404, message: "Sale not found" };
    }

    return { status: 200, data: response.Item };
  } catch (error) {
    console.error("[getSale] Error:", error);
    return errorObject;
  }
}
