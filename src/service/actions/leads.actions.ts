"use server";

import { z } from "zod";
import { createLead, Lead } from "@/dynamo-db/leads.db";
import { errorObject, ServerResponse } from "@/constants/api-constants";
import { applyRateLimit, recordAction } from "@/utils/rateLimit";

// ✅ Schema matching the Lead type (excluding system-generated fields)
const leadSchema = z.object({
  vehicleType: z.enum(["car", "motorbike"]),
  leadName: z.string().trim().max(100),
  phone: z.string().trim().max(20),
  productId: z.string().trim().max(50),
  status: z.enum([
    "new",
    "contacted",
    "interested",
    "not-interested",
    "converted",
    "lost",
  ]),
  brand: z.string().trim().max(100),
  model: z.string().trim().max(100),
  year: z.string().trim().max(10),
  mainImageUrl: z.string().url().optional().nullable(),
});

// ✅ Server action to create a new lead (no auth)
export async function createLeadAction(body: unknown): Promise<ServerResponse> {
  try {
    const validatedBody = leadSchema.safeParse(body);
    if (!validatedBody.success) {
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };
    }

    // ✅ Rate limit check by phone number
    const rateLimitResponse = await applyRateLimit(
      validatedBody.data.phone,
      "lead"
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const sanitizedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(validatedBody.data).filter(([_, value]) => value !== null)
    ) as Lead;

    const now = String(Date.now());

    const companyId = process.env.COMPANY_ID;
    if (!companyId) {
      return {
        status: 500,
        message: "Company ID not found",
        data: null,
      };
    }

    const result = await createLead({
      ...sanitizedData,
      leadId: now,
      createdAt: now,
      companyId: companyId,
    });

    // ✅ Record successful action for rate limiting
    if (result.status === 200) {
      await recordAction(validatedBody.data.phone, "lead");
    }

    return result;
  } catch (error) {
    console.error("[createLeadAction] Error:", error);
    return errorObject;
  }
}
