"use server";

import { getCar, searchCarsInDb } from "@/dynamo-db/cars.db";
import { ServerResponse } from "@/constants/api-constants";
import {
  carSearchSchema,
  CarSearchSchema,
} from "@/components/CarSearch/CarSearch.client";

export async function getCarAction(productId: string): Promise<ServerResponse> {
  try {
    const companyId = process.env.COMPANY_ID;
    if (!companyId) {
      return { status: 400, message: "Company ID not found" };
    }
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

export async function searchCarsAction(
  input: CarSearchSchema
): Promise<ServerResponse> {
  try {
    const parsed = carSearchSchema.safeParse(input);
    if (!parsed.success) {
      return {
        status: 400,
        message: "Invalid input",
      };
    }

    const companyId = process.env.COMPANY_ID;
    if (!companyId) {
      return { status: 400, message: "Company ID not found" };
    }

    const result = await searchCarsInDb(companyId, parsed.data);

    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    console.error("[searchCarsAction] Error:", error);
    return {
      status: 500,
      message: "An error occurred while searching for cars",
    };
  }
}
