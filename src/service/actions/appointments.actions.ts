"use server";

import { z } from "zod";
import { createAppointment, Appointment } from "@/dynamo-db/appointments.db";
import { errorObject, ServerResponse } from "@/constants/api-constants";
import { applyRateLimit, recordAction } from "@/utils/rateLimit";

// ✅ Schema for creating an appointment from the client
const appointmentSchema = z.object({
  clientName: z.string().trim().min(3, "Nombre y apellido requerido").max(100),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+\d{7,15}$/,
      "Número inválido. Debe iniciar con + seguido de dígitos"
    ),
  dateTimeStart: z.string().trim(), // ISO string
  dateTimeEnd: z.string().trim(), // ISO string
  date: z.string().trim(), // YYYY-MM-DD
  clientMessage: z.string().trim().max(500).optional(),
  productId: z.string().trim().max(50).optional(),
  productBrand: z.string().trim().max(100).optional(),
  productModel: z.string().trim().max(100).optional(),
});

export type CreateAppointmentInput = z.infer<typeof appointmentSchema>;

// ✅ Server action to create a new appointment (no auth)
export async function createAppointmentAction(
  body: unknown
): Promise<ServerResponse> {
  try {
    const validatedBody = appointmentSchema.safeParse(body);
    if (!validatedBody.success) {
      console.error(
        "[createAppointmentAction] Validation Error:",
        validatedBody.error
      );
      return {
        status: 400,
        message: "Invalid input data",
        data: validatedBody.error,
      };
    }

    // ✅ Rate limit check by phone number
    const rateLimitResponse = await applyRateLimit(
      validatedBody.data.phone,
      "appointment"
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const companyId = process.env.COMPANY_ID;
    if (!companyId) {
      return {
        status: 500,
        message: "Company ID not found",
        data: null,
      };
    }

    const now = String(Date.now());

    const sanitizedData = Object.fromEntries(
      Object.entries(validatedBody.data).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    ) as Partial<Appointment>;

    const appointment: Appointment = {
      ...sanitizedData,
      companyId,
      appointmentId: now,
      createdAt: now,
      status: "scheduled",
      clientName: validatedBody.data.clientName,
      phone: validatedBody.data.phone,
      dateTimeStart: validatedBody.data.dateTimeStart,
      dateTimeEnd: validatedBody.data.dateTimeEnd,
      date: validatedBody.data.date,
    };

    const result = await createAppointment(appointment);

    // ✅ Record successful action for rate limiting
    if (result.status === 200) {
      await recordAction(validatedBody.data.phone, "appointment");
    }

    return result;
  } catch (error) {
    console.error("[createAppointmentAction] Error:", error);
    return errorObject;
  }
}
