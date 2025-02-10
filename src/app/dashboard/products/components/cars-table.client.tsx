"use client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import CarHoverImage from "./car-hover-image";
import { useAtomValue } from "jotai";
import { carsAtom, setCarsState } from "@/jotai/cars-atom.jotai";
import { Car, CarStatusType } from "@/dynamo-db/cars.db";
import { useEffect } from "react";
import { ActionsCarTable } from "./actions-car-table.client";
import { CarStatus } from "./car-status.client";

// Define the column definitions for the used cars table
export const columns: ColumnDef<Car>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
    cell: ({ getValue, row }) => (
      <div className="flex gap-2 items-center">
        <CarHoverImage
          imageUrl={
            row?.original?.mainImageUrl || // Access another field from the row
            "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp"
          }
        />
        {getValue() as string}
      </div>
    ),
    size: 15, // 20% of the table width
  },
  {
    accessorKey: "model",
    header: "Modelo",
    size: 15, // 15% of the table width
  },
  {
    accessorKey: "year",
    header: "Año",
    size: 5, // 10% of the table width
  },
  {
    accessorKey: "status",
    header: "Estado",
    size: 15, // 15% of the table width
    cell: ({ getValue, row }) => {
      return (
        <CarStatus status={getValue() as CarStatusType} row={row.original} />
      );
    },
  },
  {
    accessorKey: "km",
    header: "KM",
    size: 10, // 15% of the table width
    cell: ({ getValue }) => (
      <div>{(getValue() as number)?.toLocaleString()} KM</div>
    ),
  },
  {
    accessorKey: "transmission",
    header: "Transmisión",
    size: 10, // 15% of the table width
  },
  {
    accessorKey: "carType",
    header: "Tipo",
    size: 10, // 15% of the table width
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ getValue }) => (
      <div className="text-primary font-semibold">
        U$D {(getValue() as number)?.toLocaleString()}
      </div>
    ), // Format price with commas
    size: 10, // 15% of the table width
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex w-full justify-center gap-2">
        <ActionsCarTable row={row.original} />
      </div>
    ),
    size: 4, // 10% of the table width
  },
];

export default function CarsTable({ cars }: { cars: Car[] }) {
  const { filteredCars } = useAtomValue(carsAtom);

  useEffect(() => {
    if (cars.length) {
      setCarsState({ filteredCars: cars, cars });
    }
  }, [cars]);

  return (
    <div className="container py-10" suppressHydrationWarning>
      <DataTable columns={columns} data={filteredCars || []} />
    </div>
  );
}
