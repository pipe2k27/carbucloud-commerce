"use client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
// import { ActionsCarTable } from "./actions-car-table.client";
import { Purchase, PurchaseStatusType } from "@/dynamo-db/purchases.db";
import { purchaseAtom, setPurchaseState } from "@/jotai/purchases-atom.jotai";
import { PurchaseActionsTable } from "./purchase-actions-table.client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { PurchaseStatus } from "./purchase-status.client";
import PictureIcon from "@/components/ui/picture-icon";
import { PackagePlus } from "lucide-react";
import { dateStringToddmmyyyy } from "@/utils/dateUtils";

// Define the column definitions for the used cars table

export default function PurchasesTable({
  purchases,
}: {
  purchases: Purchase[];
}) {
  const { Purchases } = useAtomValue(purchaseAtom);

  useEffect(() => {
    if (purchases.length) {
      setPurchaseState({ Purchases: purchases });
    }
  }, [purchases]);

  const [showPictures, setShowPictures] = useState<boolean>(false);

  const initialColumns: ColumnDef<Purchase>[] = [
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
            className="w-5 h-5"
            icon={<PackagePlus />}
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
      accessorKey: "createdAt",
      header: "Ingreso",

      size: 10, // 15% of the table width
      cell: ({ getValue }) => (
        <div className="text-muted-foreground font-semibold">
          {dateStringToddmmyyyy(String(getValue() as number))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      size: 13, // 15% of the table width
      cell: ({ getValue, row }) => {
        return (
          <PurchaseStatus
            status={getValue() as PurchaseStatusType}
            row={row.original}
          />
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
      header: "Precio",
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

  const columns = initialColumns.filter(
    (col: any) => col.accessorKey !== "mainImageUrl" || showPictures
  );

  return (
    <div className="py-10" suppressHydrationWarning>
      <div className="flex items-center space-x-2 translate-y-[50px] w-[300px]">
        <Switch
          id="airplane-mode"
          onCheckedChange={(e) => {
            setShowPictures(e);
          }}
        />
        <Label htmlFor="airplane-mode">Mostrar Fotos</Label>
      </div>
      <DataTable columns={columns} data={Purchases || []} />
    </div>
  );
}
