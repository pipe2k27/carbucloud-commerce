"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { errorObject, ServerResponse } from "@/constants/api-constants";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../next-auth.config";
import { z } from "zod";
import {
  createStockCarImage,
  deleteStockCarImage,
  getStockCarImagesByProductId,
  StockCarImage,
} from "@/dynamo-db/product-images.db";

const S3_BUCKET = "public-images-carbucloud";
const REGION = process.env.AWS_REGION!;
const s3 = new S3Client({ region: REGION });

export async function uploadImageAction(
  formData: FormData
): Promise<ServerResponse> {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    // ✅ Extract file from FormData
    const file = formData.get("file") as File | null;
    if (!file) {
      return { status: 400, message: "No file uploaded" };
    }

    // ✅ Define unique S3 key
    const fileKey = `uploads/${Date.now()}-${file.name}`;

    // ✅ Upload to S3
    // ✅ Upload to S3 without ACL (fixed)
    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // ✅ Generate public URL
    const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`;

    return { status: 200, message: "Upload successful", data: { imageUrl } };
  } catch (error) {
    console.error("[uploadImageAction] Error:", error);
    return errorObject;
  }
}

const imageSchema = z.object({
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
});

export async function createStockIamgeAction(body: {
  imageUrl: string;
  productId: string;
}): Promise<ServerResponse> {
  try {
    // ✅ Get session from NextAuth
    const session = await getServerSession(authConfig);

    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const validatedBody = imageSchema.safeParse(body);
    if (!validatedBody.success) {
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };
    }

    const now = String(Date.now());

    // ✅ Generate new car object with productId and userId
    const newImage: StockCarImage = {
      productId: body.productId,
      imageId: now,
      imageUrl: body.imageUrl,
    };

    const sanitizedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(newImage).filter(([_, value]) => value !== null)
    ) as StockCarImage;

    // ✅ Call createCar function to save to DynamoDB
    return await createStockCarImage(sanitizedData);
  } catch {
    return errorObject;
  }
}

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

export async function deleteStockImageByIdAction(
  productId: string,
  imageId: string
): Promise<ServerResponse> {
  try {
    // ✅ Validate input
    if (!productId || !imageId) {
      return { status: 400, message: "Invalid productId or imageId" };
    }

    // ✅ Get session from NextAuth (Authentication)
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
      return { status: 401, message: "Unauthorized: User not logged in" };
    }

    const response = await deleteStockCarImage(productId, imageId);

    if (!response || response.status !== 200) {
      return errorObject;
    }

    return {
      status: 200,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("[deleteStockImageByIdAction] Error:", error);
    return {
      status: 500,
      message: "Error deleting image",
    };
  }
}
