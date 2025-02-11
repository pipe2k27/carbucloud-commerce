"use client";

import { useForm } from "react-hook-form";
import AutomaticForm from "../Form/automatic-form.client";
import { Button } from "../ui/button";
import Modal from "./modal.client";
import { useEffect, useState } from "react";
import {
  commonComponentAtom,
  resetCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import {
  carBrandsInArgentina,
  carTypes,
  carYears,
  currencyOptions,
  transmisionTypes,
} from "@/constants/car-constants";
import { addOneCarToAtom, editCarByProductId } from "@/jotai/cars-atom.jotai";
import { FormCar, tractionOptions } from "@/dynamo-db/cars.db";
import {
  createCarAction,
  getCarAction,
  updateCarAction,
} from "@/service/actions/cars.actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { errorToast } from "@/constants/api-constants";

const carSchema = z.object({
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
  price: z.coerce.number().min(1, "El precio debe ser positivo"), // ✅ Ensures price is a number
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
});

const EditCarModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { editingCarId } = useAtomValue(commonComponentAtom);

  const { toast } = useToast();

  const defaultValues: FormCar = {
    brand: "",
    model: "",
    year: "",
    carType: "",
    transmission: "",
    engine: "",
    currency: "",
    price: 0,
    description: "",
    internalNotes: "",
    km: 0,
    status: "available",
  };

  const { control, handleSubmit, reset } = useForm<FormCar>({
    defaultValues,
    resolver: zodResolver(carSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormCar) => {
    if (!editingCarId) return;
    const newCar: FormCar = {
      ...data,
      status: "available",
      price: Number(data.price),
      km: Number(data.km),
    };
    addOneCarToAtom(newCar);
    try {
      setLoading(true);

      const res = await updateCarAction(editingCarId, newCar);
      if (res.status === 200) {
        editCarByProductId(editingCarId, newCar);
        resetCommonComponentAtom();
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description:
            "Ha habido un error de procesamiento, intentelo más tarde.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Ha habido un error de procesamiento, intentelo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    handleSubmit(onSubmit)();
  };

  const getCar = async () => {
    if (!editingCarId) return;
    setLoading(true);
    try {
      const { data } = await getCarAction(editingCarId);
      if (data) {
        const newDefaultValues: FormCar = {
          brand: data.brand,
          model: data.model,
          year: data.year,
          carType: data.carType,
          transmission: data.transmission,
          engine: data.engine,
          currency: data.currency,
          price: String(data.price),
          description: data.description,
          internalNotes: data.internalNotes,
          km: String(data.km),
          status: data.status,
          traction: data.traction || "4x2",
          buyingPrice: data.buyingPrice ? String(data.buyingPrice) : "0",
        };
        reset(newDefaultValues);
      } else {
        toast(errorToast);
        resetCommonComponentAtom();
      }
    } catch {
      toast(errorToast);
      resetCommonComponentAtom();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCarId]);

  return (
    <Modal
      isOpen
      title="Editar datos del Vehiculo"
      description="Edite los campos que desee modificar"
      footer={
        <Button onClick={handleNext} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Siguiente
        </Button>
      }
    >
      {loading && (
        <div className="h-[200px] w-full flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {!loading && (
        <AutomaticForm
          control={control}
          fields={[
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
            { name: "price", label: "Precio", type: "number", required: true },
            {
              name: "buyingPrice",
              label: "Precio de compra (costo)",
              type: "number",
              required: true,
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
          ]}
        />
      )}
    </Modal>
  );
};

export default EditCarModal;
