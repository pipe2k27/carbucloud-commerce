import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Car, FormCar } from "./cars.db";

export type PurchaseStatusType =
  | "pending"
  | "revision"
  | "rejected"
  | "buying"
  | "bought";

export type FormPurchase = Omit<
  FormCar,
  | "status"
  | "ownershipType"
  | "price"
  | "carType"
  | "transmission"
  | "traction"
  | "description"
  | "internalNotes"
  | "ownershipType"
> & {
  status: PurchaseStatusType;
};

export type Purchase = Omit<Car, "status" | "ownershipType" | "price"> & {
  status: PurchaseStatusType;
};

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
export async function createPurchase(purchase: Purchase) {
  try {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: purchase,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Potential car purchase added successfully",
      data: purchase,
    };
  } catch (error) {
    console.error("[createPurchase] Error:", error);
    return {
      status: 500,
      message: "An error occurred while creating the potential car purchase",
    };
  }
}

export async function updatePurchase(
  productId: string,
  companyId: string,
  updates: Partial<Purchase>
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
      message: " car purchase updated successfully",
      data: updatedCar,
    };
  } catch (error) {
    console.error("[updatePurchase] Error:", error);
    return {
      status: 500,
      message: "An error occurred while updating the  car purchase",
    };
  }
}
