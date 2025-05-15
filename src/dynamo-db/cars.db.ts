import { CarSearchSchema } from "@/components/CarSearch/CarSearch.client";
import { errorObject } from "@/constants/api-constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export type CarStatusType = "available" | "reserved" | "sold" | "paused";

export const tractionOptions = ["4x2", "4x4", "AWD", "4wd"];

export type TractionType = "4x2" | "4x4" | "AWD" | "4WD";

export type OwnershipType = "own" | "other";

export const ownershipOptions = [
  { value: "own", label: "Producto Propio" },
  { value: "other", label: "Producto de un Tercero" },
];

export type FormCar = {
  brand: string;
  model: string;
  year: string;
  carType: string;
  transmission: string;
  engine: string;
  currency: string;
  price: number | string;
  buyingPrice: number | string;
  traction: TractionType;
  description: string;
  internalNotes: string;
  km: number | string;
  status: CarStatusType;
  mainImageUrl?: string;
  ownershipType: string;
  ownerName: string;
  ownerPhone: string;
};

export type Car = FormCar & {
  productId: string;
  companyId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  userId: string;
  priceUsd?: number | string;
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

// ✅ Delete a car (DELETE)

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

    if (!response.Items) {
      return { status: 400, message: "No cars found" };
    }

    return {
      status: 200,
      data:
        (response.Items as Car[] | undefined)?.filter(
          (car: Car) => car.status !== "paused" && car.mainImageUrl
        ) || [],
    };
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

export async function searchCarsInDb(
  companyId: string,
  filters: CarSearchSchema
): Promise<any> {
  const { brand, model, minYear } = filters;

  try {
    const query = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "brand-productId-index", // GSI on brand
      KeyConditionExpression: "brand = :brand",
      ExpressionAttributeValues: {
        ":brand": brand,
      },
    });

    const result = await dynamoDbClient.send(query);

    const items = result.Items as Car[] | undefined;
    if (!items) {
      return { status: 404, message: "No cars found" };
    }
    console.log("Items:", items);

    const data = items.filter((car) => {
      const yearMatch = !minYear || parseInt(car.year) >= parseInt(minYear);
      const modelMatch =
        !model || car.model.toLowerCase().includes(model.toLowerCase());
      return (
        yearMatch &&
        modelMatch &&
        car.status !== "paused" &&
        car.mainImageUrl &&
        car.companyId === companyId
      );
    });

    return { status: 200, data };
  } catch (error) {
    console.error("[searchCarsInDb] Error:", error);
    return [];
  }
}
