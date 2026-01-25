import { errorObject } from "@/constants/api-constants";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

// 🔹 Define Appointment status type
export type AppointmentStatusType =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show";

// 🔹 Define Appointment type
export type Appointment = {
  companyId: string; // Partition Key (PK)
  appointmentId: string; // Sort Key (SK)
  clientName: string;
  phone: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  date: string; // Just the date without hours (YYYY-MM-DD)
  createdAt: string;
  status?: AppointmentStatusType;
  internalNotes?: string;
  clientMessage?: string;
  productId?: string; // Optional reference to a car/product
  productBrand?: string; // Denormalized product brand for display
  productModel?: string; // Denormalized product model for display
};

// ✅ Initialize DynamoDB Client
export const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = "appointments-tier1";

// ✅ Create a new appointment (PUT)
export async function createAppointment(appointment: Appointment) {
  try {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: appointment,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Appointment created successfully",
      data: appointment,
    };
  } catch (error) {
    console.error("[createAppointment] Error:", error);
    return {
      status: 500,
      message: "An error occurred while creating the appointment",
    };
  }
}

// ✅ Update an existing appointment
export async function updateAppointment(
  companyId: string,
  appointmentId: string,
  updates: Partial<Appointment>,
) {
  try {
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { companyId, appointmentId },
    });

    const { Item } = await dynamoDbClient.send(getCommand);

    if (!Item) {
      return { status: 404, message: "Appointment not found" };
    }

    const filteredUpdates = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    );
    const updatedAppointment = {
      ...Item,
      ...filteredUpdates,
    };

    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedAppointment,
    });

    await dynamoDbClient.send(putCommand);

    return {
      status: 200,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    };
  } catch (error) {
    console.error("[updateAppointment] Error:", error);
    return {
      status: 500,
      message: "An error occurred while updating the appointment",
    };
  }
}

// ✅ Delete an appointment (DELETE)
export async function deleteAppointment(
  companyId: string,
  appointmentId: string,
) {
  try {
    const deleteCommand = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { companyId, appointmentId },
    });

    await dynamoDbClient.send(deleteCommand);

    return { status: 200, message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("[deleteAppointment] Error:", error);
    return {
      status: 500,
      message: "An error occurred while deleting the appointment",
    };
  }
}

// ✅ Get all appointments for a given companyId (QUERY)
export async function getAppointmentsByCompanyId(
  companyId: string,
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
    console.error("[getAppointmentsByCompanyId] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving appointments",
    };
  }
}

// ✅ Get a single appointment
export async function getAppointment(
  companyId: string,
  appointmentId: string,
): Promise<any> {
  try {
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        companyId,
        appointmentId,
      },
    });

    const response = await dynamoDbClient.send(getCommand);

    if (!response.Item) {
      return { status: 404, message: "Appointment not found" };
    }

    return { status: 200, data: response.Item };
  } catch (error) {
    console.error("[getAppointment] Error:", error);
    return errorObject;
  }
}
