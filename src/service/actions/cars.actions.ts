"use server";

import {
  FormCar,
  Car,
  createCar,
  updateCar,
  getCar,
  deleteCar,
} from "@/dynamo-db/cars.db";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../next-auth.config";
import { getUser } from "@/dynamo-db/user.db";
import { z } from "zod";
import { errorObject, ServerResponse } from "@/constants/api-constants";
import { Sale } from "@/dynamo-db/sales.db";
import { convertCarToSale } from "@/dynamo-db/transactions.db";

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
  price: z
    .number()
    .min(0, "El precio no puede ser negativo")
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
    .enum(["available", "reserved", "sold", "paused"])
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
  ownershipType: z
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

export async function createCarAction(
  formCar: FormCar
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

    const sanitizedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(newCar).filter(([_, value]) => value !== null)
    ) as Car;

    // ✅ Call createCar function to save to DynamoDB
    return await createCar(sanitizedData);
  } catch {
    return errorObject;
  }
}

export async function updateCarImageAction(
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
    const updateResponse = await updateCar(productId, companyId, {
      mainImageUrl: imageUrl,
    });

    return updateResponse;
  } catch (error) {
    console.error("[updateCarImageAction] Error:", error);
    return errorObject;
  }
}

export async function updateCarAction(
  productId: string,
  body: Partial<Car>
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
    const updateResponse = await updateCar(productId, companyId, sanitizedData);

    return updateResponse;
  } catch (error) {
    console.error("[updateCarImageAction] Error:", error);
    return errorObject;
  }
}

export async function getCarAction(productId: string): Promise<ServerResponse> {
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
    const response = await getCar(companyId, productId);

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

export async function deleteCarAction(
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
    const deleteResponse = await deleteCar(productId, companyId);

    return deleteResponse;
  } catch (error) {
    console.error("[deleteCarAction] Error:", error);
    return errorObject;
  }
}

// ✅ Schema to validate sale data
const saleDataSchema = z.object({
  soldPrice: z.number().min(0, "El precio de venta no puede ser negativo"),
  saleCost: z.number().min(0, "Los costos no pueden ser negativa"),
  seller: z.string().trim().max(100),
  saleDate: z.string().optional(),
});

// ✅ Function to fetch latest "Dólar Blue" exchange rate
const fetchDolarBlueRate = async (): Promise<number | null> => {
  try {
    const response = await fetch("https://dolarapi.com/v1/dolares/blue");
    if (!response.ok) {
      throw new Error("Failed to fetch Dólar Blue exchange rate");
    }
    const data = await response.json();
    const ventaRate = Number(data?.venta);
    return isNaN(ventaRate) ? null : ventaRate;
  } catch (error) {
    console.error("[fetchDolarBlueRate] Error:", error);
    return null;
  }
};

// ✅ Convert Car to Sale with Dólar Blue Rate
export async function convertCarToSaleAction(
  car: Car,
  saleData: Partial<Sale>
): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const userId = session.user.id;
    const user = await getUser({ userId });

    if (!user || user.status !== 200 || !user.data?.companyId) {
      return { status: 404, message: "User not found" };
    }

    // ✅ Validate sale data
    const validatedSale = saleDataSchema.safeParse(saleData);
    if (!validatedSale.success) {
      return {
        status: 400,
        message: "Invalid sale data",
        data: validatedSale.error,
      };
    }

    // ✅ Fetch latest "Dólar Blue" exchange rate
    const dolarBlueRate = await fetchDolarBlueRate();
    if (!dolarBlueRate) {
      return {
        status: 400,
        message: "Failed to retrieve Dólar Blue exchange rate",
      };
    }

    const now = String(Date.now());

    const prices: any = {
      price: Number(car.price),
      soldPrice: Number(saleData.soldPrice),
      buyingPrice: Number(car.buyingPrice),
      saleCost: Number(saleData.saleCost),
    };

    if (saleData.currency === "ARS") {
      prices.soldPrice = Math.round(prices.soldPrice / dolarBlueRate);
      prices.saleCost = Math.round(prices.saleCost / dolarBlueRate);
    }

    if (car.currency === "ARS") {
      prices.price = Math.round(prices.price / dolarBlueRate);
      prices.buyingPrice = Math.round(prices.buyingPrice / dolarBlueRate);
    }

    prices.profit = prices.soldPrice - prices.saleCost - prices.buyingPrice;

    // ✅ Generate sale object with price converted to Dólar Blue
    const sale: Sale = {
      ...car,
      ...saleData,
      ...prices,
      createdAt: now,
      updatedAt: now,
      userId,
      createdBy: user.data.name || "Desconocido",
      status: "sold",
      currency: "USD",
    } as Sale;

    // ✅ Call transaction function to delete car & create sale
    return await convertCarToSale(sale);
  } catch (error) {
    console.error("[convertCarToSaleAction] Error:", error);
    return errorObject;
  }
}
