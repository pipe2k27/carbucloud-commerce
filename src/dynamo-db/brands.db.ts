// brands.db.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

export type Brand = {
  vehicleType: string; // Partition key: "car" | "motorbike"
  brandName: string; // Sort key
  logoPath?: string; // S3 path to logo PNG file
};

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = "brands";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
);

/**
 * Get all brands (scans the whole table, with pagination).
 */
export async function getAllBrands(): Promise<{
  status: number;
  data: Brand[];
  message?: string;
}> {
  try {
    const items: Brand[] = [];
    let ExclusiveStartKey: Record<string, any> | undefined;

    do {
      const res = await ddb.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          ExclusiveStartKey,
        })
      );
      if (res.Items?.length) items.push(...(res.Items as Brand[]));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return { status: 200, data: items };
  } catch (err) {
    console.error("[getAllBrands] Error:", err);
    return { status: 500, data: [], message: "Failed to retrieve brands" };
  }
}

/**
 * Get brands by vehicle type (query by partition key).
 */
export async function getBrandsByVehicleType(vehicleType: string): Promise<{
  status: number;
  data: Brand[];
  message?: string;
}> {
  try {
    if (!vehicleType) {
      return { status: 400, data: [], message: "vehicleType is required" };
    }

    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "vehicleType = :vt",
        ExpressionAttributeValues: {
          ":vt": vehicleType,
        },
      })
    );

    return { status: 200, data: (res.Items || []) as Brand[] };
  } catch (err) {
    console.error("[getBrandsByVehicleType] Error:", err);
    return {
      status: 500,
      data: [],
      message: "Failed to retrieve brands by vehicle type",
    };
  }
}

/**
 * Get a single brand by vehicleType and brandName.
 */
export async function getBrand(
  vehicleType: string,
  brandName: string
): Promise<{ status: number; data?: Brand; message?: string }> {
  try {
    if (!vehicleType || !brandName) {
      return {
        status: 400,
        message: "vehicleType and brandName are required",
      };
    }

    const res = await ddb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          vehicleType: vehicleType,
          brandName: brandName,
        },
      })
    );

    if (!res.Item) {
      return { status: 404, message: "Brand not found" };
    }

    return {
      status: 200,
      data: res.Item as Brand,
    };
  } catch (err) {
    console.error("[getBrand] Error:", err);
    return { status: 500, message: "Failed to retrieve brand" };
  }
}
