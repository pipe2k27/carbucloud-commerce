"use server";

import { errorObject, ServerResponse } from "@/constants/api-constants";
import { getCompanyCountry } from "@/dynamo-db/companies.db";

const companyId = process.env.COMPANY_ID;

export async function getCompanyCountryAction(): Promise<ServerResponse> {
  try {
    // ✅ Fetch company country from DynamoDB
    if (!companyId) {
      return { status: 400, message: "Company ID not found" };
    }
    const country = await getCompanyCountry(companyId);

    return { status: 200, data: country };
  } catch (error) {
    console.error("[getCompanyCountryAction] Error:", error);
    return errorObject;
  }
}
