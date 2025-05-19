"use server";
import { z } from "zod";
import { errorObject, ServerResponse } from "@/constants/api-constants";
import {
  createPurchase,
  Purchase,
  updatePurchase,
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
  transmission: z
    .string()
    .trim()
    .max(50, "La transmisión no puede superar 50 caracteres")
    .optional()
    .nullable(),
  currency: z
    .string()
    .trim()
    .max(3, "La moneda debe ser un código de 3 letras")
    .optional()
    .nullable(),
  km: z
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .optional()
    .nullable(),
  buyingPrice: z
    .number()
    .min(0, "El precio no puede ser negativo")
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
  formCar: Partial<Purchase>
): Promise<ServerResponse> {
  try {
    const validatedBody = carSchema.safeParse(formCar);
    if (!validatedBody.success) {
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };
    }

    const now = String(Date.now());

    const companyId = process.env.COMPANY_ID;

    // ✅ Generate new car object with productId and userId
    const newPurchase: Partial<Purchase> = {
      ...formCar,
      productId: now,
      companyId,
      createdAt: now,
      updatedAt: now,
      createdBy: "Potencial Cliente",
      status: "new",
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

export async function updatePurchaseImageAction(
  productId: string,
  imageUrl: string
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth

    const companyId = process.env.COMPANY_ID;

    const imageSchema = z.object({
      mainImageUrl: z.string().url("La URL de la imagen no es válida"),
    });

    const validatedBody = imageSchema.safeParse({ mainImageUrl: imageUrl });
    if (!validatedBody.success || !companyId) {
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
