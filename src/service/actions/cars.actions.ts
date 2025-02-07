"use server";

import { FormCar, Car, createCar } from "@/dynamo-db/cars";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../next-auth.config";
import { getUser } from "@/dynamo-db/user";
import { errorObject, ServerResponse } from "@/constants/api-constants";

export async function createCarAction(
  formCar: FormCar
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);

    console.log(session);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const userId = session.user.id; // Get userId from JWT

    const user = await getUser({ userId });

    if (!user || user.status !== 200 || !user.data || !user.data.companyId) {
      return { status: 404, message: "User not found" };
    }

    const now = String(Date.now());

    // ✅ Generate new car object with productId and userId
    const newCar: Car = {
      ...formCar,
      productId: now,
      companyId: user.data.companyId,
      status: "available",
      createdAt: now,
      updatedAt: now,
      userId,
      createdBy: user.data.name || "Desconocido",
    };

    // ✅ Call createCar function to save to DynamoDB
    return await createCar(newCar);
  } catch (error) {
    console.log("[createCarAction] Error:", error);
    return errorObject;
  }
}
