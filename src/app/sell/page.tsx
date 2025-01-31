"use client";

import AutomaticForm from "@/components/Form/automatic-form.client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { carBrandsInArgentina, carConditions } from "@/constants/car-constants";
import { Car } from "lucide-react";
import { useForm } from "react-hook-form";

const NewCarModal = () => {
  const { control, handleSubmit } = useForm<any>();

  return (
    <div className="mt-8 flex flex-col w-full items-center justify-center min-h-full">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>
            <div className="mb-1 text-lg font-semibold leading-none tracking-tight">
              Vehiculo a comprar o valuar
            </div>
          </CardTitle>
          <div className="mb-4 text-sm text-muted-foreground">
            Complete los siguientes datos sobre el vehículo
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-[500px]">
            <AutomaticForm
              control={control}
              fields={[
                {
                  name: "patente",
                  label: "Patente",
                  type: "text",
                  required: true,
                },
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
                {
                  name: "model",
                  label: "Modelo",
                  type: "text",
                  required: true,
                },

                {
                  name: "km",
                  label: "Kilometraje",
                  type: "number",
                  required: true,
                },
                {
                  name: "condition",
                  label: "Condición",
                  type: "options",
                  required: true,
                  options: carConditions.map((brand) => ({
                    value: brand,
                    label: brand,
                  })),
                },
                {
                  name: "nombre",
                  label: "Nombre y apellido",
                  type: "text",
                  required: true,
                },

                {
                  name: "numero",
                  label: "Numero de telefono",
                  type: "text",
                  required: true,
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCarModal;
