"use server";

import { Sale, updateSale, getSale, deleteSale } from "@/dynamo-db/sales.db"; // ✅ Updated import
import { getServerSession } from "next-auth";
import { authConfig } from "../../../next-auth.config";
import { getUser } from "@/dynamo-db/user.db";
import { z } from "zod";
import { errorObject, ServerResponse } from "@/constants/api-constants";

// ✅ Define schema for validating sales data
const saleSchema = z.object({
  brand: z.string().trim().max(50).optional().nullable(),
  model: z.string().trim().max(100).optional().nullable(),
  year: z
    .string()
    .length(4)
    .regex(/^\d{4}$/, "El año debe ser numérico")
    .optional()
    .nullable(),
  carType: z.string().trim().max(50).optional().nullable(),
  transmission: z.string().trim().max(50).optional().nullable(),
  engine: z.string().trim().max(100).optional().nullable(),
  currency: z.string().trim().max(3).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),
  internalNotes: z.string().trim().max(500).optional().nullable(),
  km: z.number().min(0).optional().nullable(),
  status: z
    .enum(["available", "reserved", "sold", "paused"])
    .optional()
    .nullable(),
  mainImageUrl: z.string().url().optional().nullable(),
  productId: z.string().trim().max(50).optional().nullable(),
  ownershipType: z.string().trim().max(50).optional().nullable(),
  ownerName: z.string().trim().max(50).optional().nullable(),
  ownerPhone: z.string().trim().max(50).optional().nullable(),
  soldPrice: z
    .number()
    .min(0, "El precio de venta no puede ser negativo")
    .optional()
    .nullable(),
  saleCost: z
    .number()
    .min(0, "Los costos no pueden ser negativos")
    .optional()
    .nullable(),
  seller: z.string().trim().max(100).optional().nullable(),
  saleDate: z.string().optional().nullable(),
});

// ✅ Update an existing sale
export async function updateSaleAction(
  productId: string,
  body: Partial<Sale>
): Promise<ServerResponse> {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id)
      return { status: 401, message: "Unauthorized" };

    const userId = session.user.id;
    const user = await getUser({ userId });
    if (!user || user.status !== 200 || !user.data?.companyId)
      return { status: 404, message: "User not found" };

    const companyId = user.data.companyId;

    const validatedBody = saleSchema.safeParse(body);
    if (!validatedBody.success)
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };

    const sanitizedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(validatedBody.data).filter(([_, value]) => value !== null)
    );

    return await updateSale(productId, companyId, sanitizedData);
  } catch (error) {
    console.error("[updateSaleAction] Error:", error);
    return errorObject;
  }
}

// ✅ Get a single sale
export async function getSaleAction(
  productId: string
): Promise<ServerResponse> {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id)
      return { status: 401, message: "Unauthorized" };

    const userId = session.user.id;
    const user = await getUser({ userId });
    if (!user || user.status !== 200 || !user.data?.companyId)
      return { status: 404, message: "User or company not found" };

    const companyId = user.data.companyId;
    const response = await getSale(companyId, productId);

    if (!response) return { status: 404, message: "Sale not found" };

    return { status: 200, data: response.data };
  } catch (error) {
    console.error("[getSaleAction] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving the sale",
    };
  }
}

// ✅ Delete a sale
export async function deleteSaleAction(
  productId: string
): Promise<ServerResponse> {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id)
      return { status: 401, message: "Unauthorized" };

    const userId = session.user.id;
    const user = await getUser({ userId });
    if (!user || user.status !== 200 || !user.data?.companyId)
      return { status: 404, message: "User not found" };

    const companyId = user.data.companyId;
    return await deleteSale(productId, companyId);
  } catch (error) {
    console.error("[deleteSaleAction] Error:", error);
    return errorObject;
  }
}
