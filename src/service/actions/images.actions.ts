"use server";

import { errorObject, ServerResponse } from "@/constants/api-constants";
import { getStockCarImagesByProductId } from "@/dynamo-db/product-images.db";

export async function getStockImagesByProductIdAction(
  productId: string
): Promise<ServerResponse> {
  try {
    // ✅ Validate `productId`
    if (!productId) {
      return { status: 400, message: "Invalid productId" };
    }

    // ✅ Get session from NextAuth
    // const session = await getServerSession(authConfig);
    // if (!session || !session.user.id) {
    //   return { status: 401, message: "Unauthorized: User not logged in" };
    // }

    const response = await getStockCarImagesByProductId(productId);

    if (!response || !response.data) {
      return errorObject;
    }

    return {
      status: 200,
      message: "Images retrieved successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("[getStockImagesByProductIdAction] Error:", error);
    return {
      status: 500,
      message: "Error retrieving images",
    };
  }
}
