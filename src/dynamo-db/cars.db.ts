import { errorObject } from "@/constants/api-constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

export type CarStatusType = "available" | "reserved" | "sold" | "paused";

export type FormCar = {
  brand: string;
  model: string;
  year: string;
  carType: string;
  transmission: string;
  engine: string;
  currency: string;
  price: number;
  description: string;
  internalNotes: string;
  km: number;
  status: CarStatusType;
  mainImageUrl?: string;
};

export type Car = FormCar & {
  productId: string;
  companyId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  userId: string;
};

// ✅ Initialize DynamoDB Client
export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = "stock-cars-tier1"; // Change table name if needed

// ✅ Create a new car (PUT)
export async function createCar(car: Car) {
  try {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: car,
    });

    await dynamoDbClient.send(putCommand);

    return { status: 200, message: "Car added successfully", data: car };
  } catch (error) {
    console.error("[createCar] Error:", error);
    return { status: 500, message: "An error occurred while creating the car" };
  }
}

// ✅ Update an existing car
export async function updateCar(
  productId: string,
  companyId: string,
  updates: Partial<FormCar>
) {
  try {
    // Step 1: Fetch the existing car
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { productId, companyId },
    });

    const { Item } = await dynamoDbClient.send(getCommand);

    if (!Item) {
      return { status: 404, message: "Car not found" };
    }

    // Step 2: Merge the existing data with updates
    const updatedCar = { ...Item, ...updates };

    // Step 3: Put the updated car back into DynamoDB
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedCar,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Car updated successfully",
      data: updatedCar,
    };
  } catch (error) {
    console.error("[updateCar] Error:", error);
    return { status: 500, message: "An error occurred while updating the car" };
  }
}

// ✅ Delete a car (DELETE)
export async function deleteCar(productId: string, companyId: string) {
  try {
    const deleteCommand = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { productId, companyId },
    });

    await dynamoDbClient.send(deleteCommand);

    return { status: 200, message: "Car deleted successfully" };
  } catch (error) {
    console.error("[deleteCar] Error:", error);
    return { status: 500, message: "An error occurred while deleting the car" };
  }
}

// ✅ Get all cars for a given companyId (QUERY)
export async function getCarsByCompanyId(companyId: string): Promise<any> {
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
    console.error("[getCarsByCompanyId] Error:", error);
    return { status: 500, message: "An error occurred while retrieving cars" };
  }
}

export async function getCar(
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
      return { status: 404, message: "Car not found" };
    }

    return { status: 200, data: response.Item };
  } catch (error) {
    console.error("[getCarByProductIdAndCompanyId] Error:", error);
    return errorObject;
  }
}
