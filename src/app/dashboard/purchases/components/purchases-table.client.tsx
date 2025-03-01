"use client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import CarHoverImage from "./purchase-hover-image";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
// import { ActionsCarTable } from "./actions-car-table.client";
import { PotentialCarPurchase } from "@/dynamo-db/potentialCarPurchases.db";
import {
  potentialCarsPurchaseAtom,
  setPotentialCarPurchaseState,
} from "@/jotai/potential-cars-atom.jotai";
import { PurchaseActionsTable } from "./purchase-actions-table.client";

// Define the column definitions for the used cars table
export const columns: ColumnDef<PotentialCarPurchase>[] = [
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
    accessorKey: "km",
    header: "KM",
    size: 10, // 15% of the table width
    cell: ({ getValue }) => (
      <div>{(getValue() as number)?.toLocaleString()} KM</div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: "Nombre",
    size: 10, // 15% of the table width
  },
  {
    accessorKey: "ownerPhone",
    header: "Telefono",
    size: 10, // 15% of the table width
  },
  {
    accessorKey: "buyingPrice",
    header: "Costo",
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
        <PurchaseActionsTable row={row.original} />
      </div>
    ),
    size: 4, // 10% of the table width
  },
];

export default function PurchasesTable({
  purchases,
}: {
  purchases: PotentialCarPurchase[];
}) {
  const { potentialCarPurchases } = useAtomValue(potentialCarsPurchaseAtom);

  useEffect(() => {
    if (purchases.length) {
      setPotentialCarPurchaseState({ potentialCarPurchases: purchases });
    }
  }, [purchases]);

  return (
    <div className="container py-10" suppressHydrationWarning>
      <DataTable
        columns={columns}
        data={potentialCarPurchases || []}
        initialSort={[]}
      />
    </div>
  );
}
