"use server";

import { ServerResponse } from "@/constants/api-constants";
import { getAllBrands } from "@/dynamo-db/brands.db";

export async function getAllBrandsAction(): Promise<ServerResponse> {
  try {
    // ✅ Fetch all brands from DynamoDB
    const response = await getAllBrands();

    if (response.status !== 200) {
      return {
        status: response.status,
        message: response.message || "Failed to retrieve brands",
      };
    }

    return { status: 200, data: response.data || [] };
  } catch (error) {
    console.error("[getAllBrandsAction] Error:", error);
    return {
      status: 500,
      message: "An error occurred while retrieving brands",
    };
  }
}
