import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { Car } from "./cars.db";
import { Sale } from "./sales.db";

export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const PURCHASES_TABLE = "potential-car-purchases-tier1";
const STOCK_TABLE = "stock-cars-tier1";
const SALES_TABLE = "sales-tier1";

export async function convertPurchaseToStock(car: Car) {
  try {
    const transactionCommand = new TransactWriteCommand({
      TransactItems: [
        {
          Delete: {
            TableName: PURCHASES_TABLE,
            Key: { productId: car.productId, companyId: car.companyId },
          },
        },
        {
          Put: {
            TableName: STOCK_TABLE,
            Item: car,
          },
        },
      ],
    });

    await dynamoDbClient.send(transactionCommand);

    return {
      status: 200,
      message: "Car successfully moved to stock",
      data: car,
    };
  } catch (error) {
    console.error("[moveCarToStock] Error:", error);
    return {
      status: 500,
      message: "An error occurred while moving the car to stock",
    };
  }
}

export async function convertCarToSale(sale: Sale) {
  try {
    const transactionCommand = new TransactWriteCommand({
      TransactItems: [
        {
          Delete: {
            TableName: STOCK_TABLE,
            Key: { productId: sale.productId, companyId: sale.companyId },
          },
        },
        {
          Put: {
            TableName: SALES_TABLE,
            Item: sale,
          },
        },
      ],
    });

    await dynamoDbClient.send(transactionCommand);

    return {
      status: 200,
      message: "Car successfully converted to sale",
      data: sale,
    };
  } catch (error) {
    console.error("[convertCarToSale] Error:", error);
    return {
      status: 500,
      message: "An error occurred while converting the car to a sale",
    };
  }
}
