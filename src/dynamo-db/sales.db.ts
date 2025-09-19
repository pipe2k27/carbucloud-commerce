import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Car } from "./cars.db";
import { CarSearchSchema } from "@/components/CarSearch/CarSearch.client";
import { errorObject } from "@/constants/api-constants";

// 🔹 Extend Car with Sales-specific properties
export type Sale = Car & {
  soldPrice: number;
  saleCost: number;
  seller: string;

  profit: number;
  buyer: string;
  buyerPhone: string;
  potentialPurchaseDate?: string;
  stockEntryDate?: string;
  saleDate: string;
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

// ✅ Update an existing sale
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
export async function searchSalesInDb(
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
