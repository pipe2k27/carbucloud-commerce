import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export type User = {
  userId: string;
  name: string;
  email: string;
  companyId: string;
};

export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export async function getOrCreateUser(data: {
  userId: string;
  name: string;
  email: string;
}) {
  const tableName = "users";

  console.log(process.env.AWS_SECRET_ACCESS_KEY);

  try {
    // Step 1: Check if the object exists
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { userId: data.userId }, // Use the unique key to search
    });

    const { Item } = await dynamoDbClient.send(getCommand);

    // Step 2: If object exists, return it
    if (Item) {
      return { status: 200, data: Item };
    }

    // Step 3: If object does not exist, create it
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: { ...data, companyId: "0000" },
    });

    await dynamoDbClient.send(putCommand);

    return { status: 200, data };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return { status: 500, message: "an error ocurred please try again" };
  }
}
