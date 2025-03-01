import { errorObject } from "@/constants/api-constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Car } from "./cars.db";

export type FormPotentialCarPurchase = Pick<
  Car,
  | "brand"
  | "model"
  | "year"
  | "km"
  | "buyingPrice"
  | "ownerName"
  | "ownerPhone"
  | "currency"
  | "description"
>;

export type PotentialCarPurchase = Pick<
  Car,
  | "productId"
  | "companyId"
  | "brand"
  | "model"
  | "year"
  | "km"
  | "buyingPrice"
  | "ownerName"
  | "ownerPhone"
  | "currency"
  | "createdAt"
  | "userId"
  | "createdBy"
  | "updatedAt"
  | "description"
  | "mainImageUrl"
>;

const TABLE_NAME = "potential-car-purchases-tier1";

// ✅ Initialize DynamoDB Client
export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ✅ Create a new potential car purchase (PUT)
export async function createPotentialCarPurchase(
  potentialCar: PotentialCarPurchase
) {
  try {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: potentialCar,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Potential car purchase added successfully",
      data: potentialCar,
    };
  } catch (error) {
    console.error("[createPotentialCarPurchase] Error:", error);
    return {
      status: 500,
      message: "An error occurred while creating the potential car purchase",
    };
  }
}

// ✅ Update an existing potential car purchase
export async function updatePotentialCarPurchase(
  productId: string,
  companyId: string,
  updates: Partial<PotentialCarPurchase>
) {
  try {
    // Step 1: Fetch the existing potential car purchase
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { productId, companyId },
    });

    const { Item } = await dynamoDbClient.send(getCommand);

    if (!Item) {
      return { status: 404, message: "Potential car purchase not found" };
    }

    // Step 2: Merge the existing data with updates
    const updatedCar = { ...Item, ...updates };

    // Step 3: Put the updated potential car purchase back into DynamoDB
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedCar,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Potential car purchase updated successfully",
      data: updatedCar,
    };
  } catch (error) {
    console.error("[updatePotentialCarPurchase] Error:", error);
    return {
      status: 500,
      message: "An error occurred while updating the potential car purchase",
    };
  }
}

// ✅ Delete a potential car purchase (DELETE)
export async function deletePotentialCarPurchase(
  productId: string,
  companyId: string
) {
  try {
    const deleteCommand = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { productId, companyId },
    });

    await dynamoDbClient.send(deleteCommand);

    return {
      status: 200,
      message: "Potential car purchase deleted successfully",
    };
  } catch (error) {
    console.error("[deletePotentialCarPurchase] Error:", error);
    return {
      status: 500,
      message: "An error occurred while deleting the potential car purchase",
    };
  }
}

// ✅ Get all potential car purchases for a given companyId (QUERY)
export async function getPotentialCarPurchasesByCompanyId(
  companyId: string
): Promise<any> {
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
    console.error("[getPotentialCarPurchasesByCompanyId] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving potential car purchases",
    };
  }
}

// ✅ Get a specific potential car purchase by productId and companyId
export async function getPotentialCarPurchase(
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
      return { status: 404, message: "Potential car purchase not found" };
    }

    return { status: 200, data: response.Item };
  } catch (error) {
    console.error("[getPotentialCarPurchase] Error:", error);
    return errorObject;
  }
}
