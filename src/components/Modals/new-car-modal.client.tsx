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
import { FormCar } from "@/dynamo-db/cars";
import { createCarAction } from "@/service/actions/cars.actions";

const NewCarModal = () => {
  const [section, setCurrentSection] = useState<1 | 2>(1);
  const [currentImage, setCurrentImage] = useState<number>(1);

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
  });

  const onSubmit = async (data: FormCar) => {
    const newCar: FormCar = {
      ...data,
      status: "available",
      price: Number(data.price),
      km: Number(data.km),
    };

    console.log(newCar);

    addOneCarToAtom(newCar);
    setCurrentSection(2);
    try {
      const data = await createCarAction(newCar);
      if (data.status === 200) {
        alert("Auto creado con éxito");
      } else {
        alert("Error");
      }
    } catch {
      alert("Error");
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
      footer={<Button onClick={handleNext}>Siguiente</Button>}
    >
      {section === 1 && (
        <AutomaticForm
          control={control}
          fields={[
            {
              name: "brand",
              label: "Marca",
              type: "options",
              required: true,
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
              required: true,
              options: carYears.map((brand) => ({
                value: brand,
                label: brand,
              })),
            },
            {
              name: "km",
              label: "Kilometraje",
              type: "number",
              required: true,
            },
            {
              name: "carType",
              label: "Tipo de Vehículo",
              type: "options",
              required: true,
              options: carTypes.map((brand) => ({
                value: brand,
                label: brand,
              })),
            },
            {
              name: "transmission",
              label: "Transmisión",
              type: "options",
              required: true,
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
              required: true,
              options: currencyOptions,
            },
            { name: "price", label: "Precio", type: "number", required: true },
            {
              name: "description",
              label: "Descripción",
              type: "textarea",
              required: false,
            },
            {
              name: "internalNotes",
              label: "Notas internas (No se mostrarán en la web)",
              type: "textarea",
              required: false,
            },
          ]}
        />
      )}
      {section === 2 && (
        <>
          <div className="my-2">
            <FormLabel label="Imagen Principal:" required />
            <div className="grid-cols-3 grid">
              <UploadImage productId="1" index={0} />
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
                    productId="2"
                    index={e + 1}
                    onUpload={(i) => {
                      setCurrentImage(i + 1);
                    }}
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
