"use client";

import { useForm } from "react-hook-form";
import AutomaticForm from "../Form/automatic-form.client";
import { Button } from "../ui/button";
import Modal from "./modal.client";
import UploadImage from "@/app/dashboard/products/components/car-image-handler.client";
import FormLabel from "../Form/form-label.client";
import { useState } from "react";
import { resetCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import {
  carBrandsInArgentina,
  carTypes,
  carYears,
  currencyOptions,
  transmisionTypes,
} from "@/constants/car-constants";
import { addOneCarToAtom } from "@/jotai/cars-atom.jotai";
import { Car, FormCar } from "@/dynamo-db/cars.db";
import { createCarAction } from "@/service/actions/cars.actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const NewCarModal = () => {
  const [section, setCurrentSection] = useState<1 | 2>(1);
  const [currentImage, setCurrentImage] = useState<number>(1);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const { control, handleSubmit } = useForm<FormCar>({
    defaultValues,
    resolver: zodResolver(carSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormCar) => {
    const newCar: FormCar = {
      ...data,
      status: "available",
      price: Number(data.price),
      km: Number(data.km),
    };
    addOneCarToAtom(newCar);
    try {
      setLoading(true);

      const res = await createCarAction(newCar);
      if (res.status === 200) {
        setCurrentCar(res.data);
        setCurrentSection(2);
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
    if (section === 1) {
      handleSubmit(onSubmit)();
    } else {
      resetCommonComponentAtom();
    }
  };

  return (
    <Modal
      isOpen
      title="Nuevo Vehiculo"
      description="Complete los campos para agregar un nuevo auto"
      footer={
        <Button onClick={handleNext} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Siguiente
        </Button>
      }
    >
      {section === 1 && (
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
      {section === 2 && currentCar && (
        <>
          <div className="my-2">
            <FormLabel label="Imagen Principal:" required />
            <div className="grid-cols-3 grid">
              <UploadImage
                index={0}
                isMainImage
                productId={currentCar.productId}
              />
            </div>
          </div>
          <FormLabel label="Imagenes complementarias:" required />
          <div className="text-xs text-gray-500 opacity-45">
            *Hasta 9 imágenes
          </div>
          <div className="grid-cols-3 grid">
            {Array.from({ length: currentImage }, (_, index) => index).map(
              (e) => {
                if (e > 8) return null;
                return (
                  <UploadImage
                    key={e}
                    index={e + 1}
                    onUpload={(i) => {
                      setCurrentImage(i + 1);
                    }}
                    productId={currentCar.productId}
                  />
                );
              }
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default NewCarModal;
