"use client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { ActionsCarTable } from "./actions-sales-table.client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import PictureIcon from "@/components/ui/picture-icon";
import { TrendingUpIcon } from "lucide-react";
import { Sale } from "@/dynamo-db/sales.db";
import { salesAtom, setSalesState } from "@/jotai/sales-atom.jotai";
import { dateStringToddmmyyyy } from "@/utils/dateUtils";

// Define the column definitions for the used sales table

export default function SalesTable({ sales }: { sales: Sale[] }) {
  const { filteredSales } = useAtomValue(salesAtom);
  const [showPictures, setShowPictures] = useState<boolean>(false);

  useEffect(() => {
    if (sales.length) {
      setSalesState({ filteredSales: sales, sales });
    }
  }, [sales]);

  const initialColumns: ColumnDef<Sale>[] = [
    {
      accessorKey: "mainImageUrl",
      size: 1,
      header: "Foto",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <div className="w-[70px] h-[70px] relative">
            {row?.original?.mainImageUrl ? (
              <Image
                src={
                  row?.original?.mainImageUrl // Access another field from the row
                }
                alt="car"
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="w-[70px] h-[70px] relative rounded-lg bg-white opacity-5"></div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "brand",
      header: "Marca",
      cell: ({ getValue, row }) => (
        <div className="flex gap-2 items-center">
          <PictureIcon
            icon={<TrendingUpIcon />}
            imageUrl={
              row?.original?.mainImageUrl || // Access another field from the row
              "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp"
            }
          />
          {getValue() as string}
        </div>
      ),
      size: 5, // 20% of the table width
    },
    {
      accessorKey: "model",
      header: "Modelo",
      size: 10, // 15% of the table width
    },
    {
      accessorKey: "year",
      header: "Año",
      size: 5, // 10% of the table width
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Venta",

      size: 10, // 15% of the table width
      cell: ({ getValue }) => (
        <div className="text-muted-foreground font-semibold">
          {dateStringToddmmyyyy(String(getValue() as number))}
        </div>
      ),
    },
    {
      accessorKey: "soldPrice",
      header: "Precio de Venta",
      cell: ({ getValue, row }) => {
        if (row.original.currency === "ARS") {
          return (
            <div className="text-primary font-semibold">
              ARS ${(getValue() as number)?.toLocaleString()}
            </div>
          );
        }
        return (
          <div className="text-primary font-semibold">
            U$D {(getValue() as number)?.toLocaleString()}
          </div>
        );
      },
      size: 12, // 15% of the table width
    },
    {
      accessorKey: "buyingPrice",
      header: "Precio de Compra",
      cell: ({ getValue, row }) => {
        if (row.original.currency === "ARS") {
          return (
            <div className="text-red-400 font-semibold">
              ARS ${(getValue() as number)?.toLocaleString()}
            </div>
          );
        }
        return (
          <div className="text-red-400  font-semibold">
            U$D {(getValue() as number)?.toLocaleString()}
          </div>
        );
      },
      size: 12, // 15% of the table width
    },
    {
      accessorKey: "saleCost",
      header: "Costos / Comisiones",
      cell: ({ getValue }) => {
        return (
          <div className="text-red-400  font-semibold">
            U$D {(getValue() as number)?.toLocaleString()}
          </div>
        );
      },
      size: 12, // 15% of the table width
    },
    {
      accessorKey: "profit",
      header: "Ganancia",
      cell: ({ getValue }) => {
        return (
          <div className="text-primary  font-semibold">
            U$D {(getValue() as number)?.toLocaleString()}
          </div>
        );
      },
      size: 12, // 15% of the table width
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

  // Conditionally filter the columns
  const columns = initialColumns.filter(
    (col: any) => col.accessorKey !== "mainImageUrl" || showPictures
  );

  return (
    <>
      <div className="flex items-center space-x-2 translate-y-[90px] w-[300px]">
        <Switch
          id="airplane-mode"
          onCheckedChange={(e) => {
            setShowPictures(e);
          }}
        />
        <Label htmlFor="airplane-mode">Mostrar Fotos</Label>
      </div>
      <div className="py-10" suppressHydrationWarning>
        <DataTable columns={columns} data={filteredSales || []} />
      </div>
    </>
  );
}
