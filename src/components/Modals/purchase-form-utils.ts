import {
  carBrandsInArgentina,
  carTypes,
  carYears,
  currencyOptions,
  transmisionTypes,
} from "@/constants/car-constants";

import { z } from "zod";
import { Field } from "../Form/automatic-form.client";
import { FormPurchase } from "@/dynamo-db/purchases.db";
import { tractionOptions } from "@/dynamo-db/cars.db";

export const PurchaseSchema = z.object({
  brand: z.string().trim().max(50, "La marca no puede superar 50 caracteres"),
  model: z
    .string()
    .trim()
    .max(100, "El modelo no puede superar 100 caracteres")
    .min(1, "Por favor complete este campo"),
  year: z
    .string()
    .min(1, "Por favor complete este campo")
    .length(4, "El año debe tener 4 dígitos")
    .regex(/^\d{4}$/, "El año debe ser numérico"),
  carType: z
    .string()
    .trim()
    .min(1, "Por favor complete este campo")
    .max(50, "El tipo de auto no puede superar 50 caracteres"),
  transmission: z
    .string()
    .trim()
    .min(1, "Por favor complete este campo")
    .max(50, "La transmisión no puede superar 50 caracteres"),
  engine: z
    .string()
    .trim()
    .max(100, "El motor no puede superar 100 caracteres"),
  currency: z
    .string()
    .trim()
    .min(1, "Por favor complete este campo")
    .max(3, "La moneda debe ser un código de 3 letras"),
  buyingPrice: z.coerce.number().min(0, "El precio debe ser positivo"), // ✅ Ensures price is a number
  km: z.coerce
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .max(30000000, "El kilometraje no puede ser tan alto"), // ✅ Ensures km is a number
  description: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar 500 caracteres")
    .optional(),
  internalNotes: z
    .string()
    .trim()
    .max(500, "Las notas internas no pueden superar 500 caracteres")
    .optional(),
  traction: z
    .string()
    .trim()
    .min(1, "Por favor complete este campo")
    .max(50, "La transmisión no puede superar 50 caracteres"),
  ownerName: z
    .string()
    .trim()
    .max(50, "La transmisión no puede superar 50 caracteres"),
  ownerPhone: z
    .string()
    .trim()
    .max(50, "La transmisión no puede superar 50 caracteres"),
});

export const purchasaeFormFields: Field[] = [
  {
    name: "brand",
    label: "Marca",
    type: "options",
    options: carBrandsInArgentina
      .sort((a, b) => a.localeCompare(b))
      .map((brand) => ({
        value: brand,
        label: brand,
      })),
  },
  { name: "model", label: "Modelo", type: "text", required: true },
  {
    name: "year",
    label: "Año",
    type: "options",
    options: carYears.map((brand) => ({
      value: brand,
      label: brand,
    })),
  },
  {
    name: "km",
    label: "Kilometraje",
    type: "number",
  },
  {
    name: "carType",
    label: "Tipo de Vehículo",
    type: "options",
    options: carTypes.map((brand) => ({
      value: brand,
      label: brand,
    })),
  },

  {
    name: "transmission",
    label: "Transmisión",
    type: "options",
    options: transmisionTypes.map((brand) => ({
      value: brand,
      label: brand,
    })),
  },
  {
    name: "traction",
    label: "Tracción",
    type: "options",
    options: tractionOptions.map((brand) => ({
      value: brand,
      label: brand,
    })),
  },
  {
    name: "engine",
    label: "Motor",
    type: "text",
    required: false,
  },
  {
    name: "currency",
    label: "Moneda",
    type: "options",
    options: currencyOptions,
  },
  {
    name: "buyingPrice",
    label: "Precio de compra (costo)",
    type: "number",
    required: true,
  },
  {
    name: "ownerName",
    label: "Nombre del Dueño:",
    type: "text",
    required: false,
  },
  {
    name: "ownerPhone",
    label: "Teléfono del dueño:",
    type: "text",
    required: false,
  },
  {
    name: "description",
    label: "Descripción",
    type: "textarea",
  },
  {
    name: "internalNotes",
    label: "Notas internas (No se mostrarán en la web)",
    type: "textarea",
  },
];

export const purchaseFormdefaultValues: FormPurchase = {
  brand: "",
  model: "",
  year: "",
  carType: "",
  transmission: "",
  engine: "",
  currency: "",
  buyingPrice: 0,
  description: "",
  internalNotes: "",
  km: 0,
  ownerName: "",
  ownerPhone: "",
  status: "pending",
  traction: "4x2",
};
