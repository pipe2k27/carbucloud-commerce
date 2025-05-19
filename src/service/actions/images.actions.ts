"use server";

import { errorObject, ServerResponse } from "@/constants/api-constants";
import { getStockCarImagesByProductId } from "@/dynamo-db/product-images.db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_BUCKET = "public-images-carbucloud";
const REGION = process.env.AWS_REGION!;
const s3 = new S3Client({ region: REGION });

export async function uploadImageAction(
  formData: FormData
): Promise<ServerResponse> {
  try {
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
