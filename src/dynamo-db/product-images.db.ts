import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

// ✅ Initialize DynamoDB Client
const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export type StockCarImage = {
  productId: string;
  imageId: string;
  imageUrl: string;
};

const TABLE_NAME = "stock-car-images-tier1"; // Change table name if needed

// ✅ Create a new car (PUT)

const docClient = DynamoDBDocumentClient.from(dynamoDbClient, {
  marshallOptions: {
    convertClassInstanceToMap: true, // Ensures nested objects are converted properly
    removeUndefinedValues: true, // Removes undefined values
  },
  unmarshallOptions: {
    wrapNumbers: false, // Ensures numbers remain as numbers (not wrapped in strings)
  },
});

export async function getStockCarImagesByProductId(productId: string) {
  try {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "productId = :productId",
      ExpressionAttributeValues: {
        ":productId": { S: productId }, // ✅ Use { S: value } for string type
      },
    });

    const response = await docClient.send(queryCommand);

    const formattedData = response.Items?.map((item) => unmarshall(item)) || [];

    return {
      status: 200,
      message: "Images retrieved successfully",
      data: formattedData || [], // ✅ Clean, normal JSON output
    };
  } catch (error) {
    console.error("[getStockCarImagesByProductId] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving images",
    };
  }
}
