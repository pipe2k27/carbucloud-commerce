"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "../../../next-auth.config";
import { getUser } from "@/dynamo-db/user.db";
import { z } from "zod";
import { errorObject, ServerResponse } from "@/constants/api-constants";
import {
  createPurchase,
  FormPurchase,
  Purchase,
  updatePurchase,
  getPurchase,
  deletePurchase,
} from "@/dynamo-db/purchases.db";

const carSchema = z.object({
  brand: z
    .string()
    .trim()
    .max(50, "La marca no puede superar 50 caracteres")
    .optional()
    .nullable(),
  model: z
    .string()
    .trim()
    .max(100, "El modelo no puede superar 100 caracteres")
    .optional()
    .nullable(),
  year: z
    .string()
    .length(4, "El año debe tener 4 dígitos")
    .regex(/^\d{4}$/, "El año debe ser numérico")
    .optional()
    .nullable(),
  carType: z
    .string()
    .trim()
    .max(50, "El tipo de auto no puede superar 50 caracteres")
    .optional()
    .nullable(),
  transmission: z
    .string()
    .trim()
    .max(50, "La transmisión no puede superar 50 caracteres")
    .optional()
    .nullable(),
  engine: z
    .string()
    .trim()
    .max(100, "El motor no puede superar 100 caracteres")
    .optional()
    .nullable(),
  currency: z
    .string()
    .trim()
    .max(3, "La moneda debe ser un código de 3 letras")
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar 500 caracteres")
    .optional()
    .nullable(),
  internalNotes: z
    .string()
    .trim()
    .max(500, "Las notas internas no pueden superar 500 caracteres")
    .optional()
    .nullable(),
  km: z
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .optional()
    .nullable(),
  status: z
    .enum(["pending", "revision", "rejected", "buying"])
    .optional()
    .nullable(),
  mainImageUrl: z
    .string()
    .url("La URL de la imagen no es válida")
    .optional()
    .nullable(),
  productId: z
    .string()
    .trim()
    .max(50, "El modelo no puede superar 50 caracteres")
    .optional()
    .nullable(),
  ownerName: z
    .string()
    .trim()
    .max(50, "El modelo no puede superar 50 caracteres")
    .optional()
    .nullable(),
  ownerPhone: z
    .string()
    .trim()
    .max(50, "El modelo no puede superar 50 caracteres")
    .optional()
    .nullable(),
});

export async function createPurchaseAction(
  formCar: FormPurchase
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const userId = session.user.id; // Get userId from JWT

    const user = await getUser({ userId });

    if (!user || user.status !== 200 || !user.data || !user.data.companyId) {
      return { status: 404, message: "User not found" };
    }

    const validatedBody = carSchema.safeParse(formCar);
    if (!validatedBody.success) {
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };
    }

    const now = String(Date.now());

    // ✅ Generate new car object with productId and userId
    const newPurchase: Purchase = {
      ...formCar,
      productId: now,
      companyId: user.data.companyId,
      createdAt: now,
      updatedAt: now,
      userId,
      createdBy: user.data.name || "Desconocido",
    };

    const sanitizedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(newPurchase).filter(([_, value]) => value !== null)
    ) as Purchase;

    // ✅ Call createCar function to save to DynamoDB
    return await createPurchase(sanitizedData);
  } catch {
    return errorObject;
  }
}

export async function updatePurchaseAction(
  productId: string,
  body: Partial<Purchase>
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const userId = session.user.id;
    const user = await getUser({ userId });

    if (!user || user.status !== 200 || !user.data || !user.data.companyId) {
      return { status: 404, message: "User not found" };
    }

    const companyId = user.data.companyId;

    // ✅ Validate & sanitize input data (with optional fields)
    const validatedBody = carSchema.safeParse(body);
    if (!validatedBody.success) {
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };
    }

    const sanitizedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(validatedBody.data).filter(([_, value]) => value !== null)
    );

    // ✅ Call updateCar function to update the image URL
    const updateResponse = await updatePurchase(
      productId,
      companyId,
      sanitizedData
    );

    return updateResponse;
  } catch (error) {
    console.error("[updateCarImageAction] Error:", error);
    return errorObject;
  }
}

export async function updatePotentiaCarPurchaseImageAction(
  productId: string,
  imageUrl: string
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const userId = session.user.id;
    const user = await getUser({ userId });

    if (!user || user.status !== 200 || !user.data || !user.data.companyId) {
      return { status: 404, message: "User not found" };
    }

    const companyId = user.data.companyId;

    const imageSchema = z.object({
      mainImageUrl: z.string().url("La URL de la imagen no es válida"),
    });

    const validatedBody = imageSchema.safeParse({ mainImageUrl: imageUrl });
    if (!validatedBody.success) {
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };
    }
    // ✅ Call updateCar function to update the image URL
    const updateResponse = await updatePurchase(productId, companyId, {
      mainImageUrl: imageUrl,
    });

    return updateResponse;
  } catch (error) {
    console.error("[updateCarImageAction] Error:", error);
    return errorObject;
  }
}

export async function getPurchaseAction(
  productId: string
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const userId = session.user.id; // Get userId from JWT
    const user = await getUser({ userId });

    if (!user || user.status !== 200 || !user.data || !user.data.companyId) {
      return { status: 404, message: "User or company not found" };
    }

    const companyId = user.data.companyId;

    // ✅ Fetch car from DynamoDB by companyId + productId (Composite Key)
    const response = await getPurchase(companyId, productId);

    if (!response) {
      return { status: 404, message: "Car not found" };
    }

    return { status: 200, data: response.data };
  } catch (error) {
    console.error("[getCarAction] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving the car",
    };
  }
}

export async function deletePurchaseAction(
  productId: string
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const userId = session.user.id;
    const user = await getUser({ userId });

    if (!user || user.status !== 200 || !user.data || !user.data.companyId) {
      return { status: 404, message: "User not found" };
    }

    const companyId = user.data.companyId;

    // ✅ Call deleteCar function to remove the car
    const deleteResponse = await deletePurchase(productId, companyId);

    return deleteResponse;
  } catch (error) {
    console.error("[deletePurchase] Error:", error);
    return errorObject;
  }
}
