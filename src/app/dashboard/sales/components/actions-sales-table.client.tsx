/* eslint-disable jsx-a11y/alt-text */
"use client";

import { MoreHorizontal, Pencil, Trash2, PlusCircle } from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  resetCommonComponentAtom,
  setCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import { Car } from "@/dynamo-db/cars.db";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteOneSaleFromAtom } from "@/jotai/sales-atom.jotai";
import { deleteSaleAction } from "@/service/actions/sales.actions";

export function ActionsCarTable({ row }: { row: Car }) {
  const router = useRouter();

  const { toast } = useToast();

  const deleteCar = async () => {
    deleteOneSaleFromAtom(row.productId);
    resetCommonComponentAtom();
    const res = await deleteSaleAction(row.productId);
    if (res.status !== 200) {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Ha habido un error de eliminando el producto, intentelo más tarde.",
      });
      setTimeout(() => {
        router.refresh();
      }, 500);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/sale-detail/${row.productId}`);
          }}
        >
          <PlusCircle size={18} className="mr-2" /> Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem
        // onClick={() => {
        //   setCommonComponentAtom({
        //     showEditCarModal: true,
        //     currentElementId: row.productId,
        //     shouldRefreshRouter: true,
        //   });
        // }}
        >
          <Pencil size={18} className="mr-2" /> Editar datos del producto
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCommonComponentAtom({
              confirmModal: {
                show: true,
                title: "Eliminar producto",
                description: `¿Está seguro que desea eliminar la venta ${row.brand} ${row.model} ${row.year}?`,
                onConfirm: () => {
                  deleteCar();
                },
              },
            });
          }}
          className="text-red-500"
        >
          <Trash2 size={18} className="mr-2" /> Eliminar producto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
