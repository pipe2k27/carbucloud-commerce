"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Car } from "@/dynamo-db/cars.db";
import { formatCurrency } from "@/utils/currencyUtils";
import {
  Settings,
  Car as CarIcon,
  Calendar,
  Settings as Transmission, // Replace with a valid icon or alias
  MountainSnow,
  BadgeDollarSign,
} from "lucide-react";

type SpecCardsProps = {
  car: Car;
};

const specs = [
  {
    key: "engine",
    label: "Motor",
    icon: Settings,
  },
  {
    key: "traction",
    label: "Tracción",
    icon: MountainSnow,
  },
  {
    key: "transmission",
    label: "Transmisión",
    icon: Transmission,
  },
  {
    key: "carType",
    label: "Tipo",
    icon: CarIcon,
  },
  {
    key: "year",
    label: "Año",
    icon: Calendar,
  },
  {
    key: "price",
    label: "Precio",
    icon: BadgeDollarSign,
  },
];

export default function SpecCards({ car }: SpecCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {specs.map(({ key, label, icon: Icon }) => {
        const value = (car as any)[key];

        return (
          <Card key={key} className="text-center transition-all hover:bg-muted">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-3">
              <Icon className="w-5 h-5 text-primary" />
              <div className="text-xs text-muted-foreground">{label}</div>
              {key === "price" && (
                <div className="text-sm font-semibold">
                  {formatCurrency(value, car.currency)}
                </div>
              )}
              {key !== "price" && (
                <div className="text-md font-semibold">{value ?? "—"}</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
