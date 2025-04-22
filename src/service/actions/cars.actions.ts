"use server";

import { getCar } from "@/dynamo-db/cars.db";
import { ServerResponse } from "@/constants/api-constants";

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
