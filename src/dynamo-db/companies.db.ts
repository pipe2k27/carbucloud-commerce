// companies.db.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export type SellerType = "motorbikes" | "cars" | "multi";

export type Company = {
  companyId: string;
  companyName: string;
  sellerType?: SellerType;
  country?: "AR" | "UY";
};

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.COMPANIES_TABLE || "companies";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
);

/**
 * Get a single company by companyId.
 */
export async function getCompanyByCompanyId(
  companyId: string
): Promise<{ status: number; data?: Company; message?: string }> {
  try {
    if (!companyId) {
      return { status: 400, message: "companyId is required" };
    }

    const res = await ddb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { companyId: String(companyId) },
      })
    );

    if (!res.Item) {
      return { status: 404, message: "Company not found" };
    }

    return {
      status: 200,
      data: res.Item as Company,
    };
  } catch (err) {
    console.error("[getCompanyByCompanyId] Error:", err);
    return { status: 500, message: "Failed to retrieve company" };
  }
}

/**
 * Get company country with default fallback to "AR"
 */
export async function getCompanyCountry(
  companyId: string
): Promise<"AR" | "UY"> {
  try {
    const companyRes = await getCompanyByCompanyId(companyId);

    if (companyRes.status === 200 && companyRes.data?.country) {
      return companyRes.data.country;
    }

    // Default to "AR" if company not found or country is missing
    return "AR";
  } catch (error) {
    console.error("[getCompanyCountry] Error:", error);
    return "AR";
  }
}
