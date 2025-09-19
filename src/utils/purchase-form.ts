import {
  carBrandsInArgentina,
  carTypes,
  carYears,
  currencyOptions,
  motorcycleBrandsInArgentina,
  transmisionTypes,
} from "@/constants/car-constants";

import { tractionOptions } from "@/dynamo-db/cars.db";
import { Field } from "@/components/Form/automatic-form.client";

export const PurchaseSchema = z.object({
  brand: z
    .string()
    .trim()
    .max(50, "La marca no puede superar 50 caracteres")
    .min(1, "Por favor complete este campo"),
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
    .max(50, "El tipo de vehículo no puede superar 50 caracteres"),
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
  buyingPrice: z.coerce.number().min(-2, "El precio debe ser positivo"), // ✅ Ensures price is a number
  km: z.coerce
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .max(30000000, "El kilometraje no puede ser tan alto")
    .refine((value) => !isNaN(value), { message: "Este campo es obligatorio" }), // ✅ Ensures km is a number
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
    .regex(
      /^\+549\d{6,10}$/,
      "Número inválido. Debe iniciar con +549 seguido de 6 a 10 dígitos"
    ),
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
    label: "Precio (Cuanto pide el dueño por el vehículo)",
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
    type: "phone",
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

// Ajustá esto también si es necesario

export const brandAndModelFields: Field[] = [
  {
    name: "vehicleType",
    label: "Tipo de Vehículo",
    type: "options",
    options: [
      { value: "car", label: "Auto" },
      { value: "motorbike", label: "Moto" },
    ],
  },
  {
    name: "brand",
    label: "Marca",
    type: "options",
    depndency: {
      field: "vehicleType",
      value: "car",
    },
    options: carBrandsInArgentina
      .sort((a, b) => a.localeCompare(b))
      .map((brand) => ({
        value: brand,
        label: brand,
      })),
  },
  {
    name: "brand",
    label: "Marca",
    type: "options",
    depndency: {
      field: "vehicleType",
      value: "motorbike",
    },
    options: motorcycleBrandsInArgentina
      .sort((a, b) => a.localeCompare(b))
      .map((brand) => ({
        value: brand,
        label: brand,
      })),
  },
  { name: "model", label: "Modelo y versión", type: "text", required: true },
];

export const yearAndKmFields: Field[] = [
  {
    name: "year",
    label: "Año",
    type: "options",
    options: carYears.map((year) => ({
      value: year,
      label: year,
    })),
  },
  {
    name: "km",
    label: "Kilometraje",
    type: "number",
  },
];

export const priceAndCurrencyFields: Field[] = [
  {
    name: "buyingPrice",
    label: "Precio que te gustaria recibir por el vehículo:",
    type: "number",
  },
  {
    name: "currency",
    label: "Moneda",
    type: "options",
    options: currencyOptions,
  },
];

export const ownerFields: Field[] = [
  {
    name: "ownerName",
    label: "Tu nombre:",
    type: "text",
    required: false,
  },
  {
    name: "ownerPhone",
    label: "Teléfono para que te contactemos:",
    type: "phone",
    required: false,
  },
];

export const ownershipToPurchaseOptions = [
  { value: "own", label: "Producto Propio (La empresa compra el vehículo)" },
  {
    value: "other",
    label: "Producto de un Tercero (se venderá en consignación)",
  },
];

export const purchaseToStockSchema = z.object({
  currency: z
    .string()
    .trim()
    .min(1, "Por favor complete este campo")
    .max(3, "La moneda debe ser un código de 3 letras"),
  price: z.coerce.number().min(1, "El precio debe ser positivo"),
  buyingPrice: z.coerce.number().min(0, "El precio debe ser positivo"),
  ownershipType: z
    .string()
    .trim()
    .min(1, "Por favor complete este campo")
    .max(50, "No puede superar 50 caracteres"),
});

export const purchaseToStockFormFields: Field[] = [
  {
    name: "currency",
    label: "Moneda:",
    type: "options",
    options: currencyOptions,
  },
  {
    name: "buyingPrice",
    label: "Precio de compra (al que compramos el vehiculo):",
    type: "number",
  },
  {
    name: "price",
    label: "Precio de Venta (al que se venderá):",
    type: "number",
  },
  {
    name: "ownershipType",
    label: "Dueño del vehículo:",
    type: "options",
    options: ownershipToPurchaseOptions,
  },
];

import { z } from "zod";

// Grupo 1: Marca y modelo
export const brandAndModelSchema = z.object({
  vehicleType: z
    .string()
    .trim()
    .max(50, "El tipo de vehículo no puede superar 50 caracteres")
    .min(1, "Por favor complete este campo"),
  brand: z
    .string()
    .trim()
    .max(50, "La marca no puede superar 50 caracteres")
    .min(1, "Por favor complete este campo"),
  model: z
    .string()
    .trim()
    .max(100, "El modelo no puede superar 100 caracteres")
    .min(1, "Por favor complete este campo"),
});

// Grupo 2: Año y kilometraje
export const yearAndKmSchema = z.object({
  year: z
    .string()
    .min(1, "Por favor complete este campo")
    .length(4, "El año debe tener 4 dígitos")
    .regex(/^\d{4}$/, "El año debe ser numérico"),
  km: z.coerce
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .max(30000000, "El kilometraje no puede ser tan alto")
    .refine((value) => !isNaN(value), { message: "Este campo es obligatorio" }),
});

// Grupo 3: Precio y moneda
export const priceAndCurrencySchema = z.object({
  currency: z
    .string()
    .trim()
    .min(1, "Por favor complete este campo")
    .max(3, "La moneda debe ser un código de 3 letras"),
  buyingPrice: z.coerce.number().min(-2, "El precio debe ser positivo"),
});

// Grupo 4: Dueño
export const ownerSchema = z.object({
  ownerName: z
    .string()
    .trim()
    .max(50, "La transmisión no puede superar 50 caracteres"),
  ownerPhone: z
    .string()
    .regex(
      /^\+549\d{6,10}$/,
      "Número inválido. Debe iniciar con +549 seguido de 6 a 10 dígitos"
    ),
});

// Si necesitás el esquema completo:
export const sellerFrom: Field[][] = [
  brandAndModelFields,
  yearAndKmFields,
  priceAndCurrencyFields,
  ownerFields,
];

export const sellerSchemas = [
  brandAndModelSchema,
  yearAndKmSchema,
  priceAndCurrencySchema,
  ownerSchema,
];
