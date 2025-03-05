/* eslint-disable jsx-a11y/alt-text */
"use client";

import {
  MoreHorizontal,
  Pencil,
  Image,
  Trash2,
  PlusCircle,
} from "lucide-react";

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
import { useRouter } from "next/navigation";
import { Purchase } from "@/dynamo-db/purchases.db";
import { deleteOnePurchaseFromAtom } from "@/jotai/purchases-atom.jotai";
import { useToast } from "@/hooks/use-toast";
import { deletePurchaseAction } from "@/service/actions/purchases.actions";

export function PurchaseActionsTable({ row }: { row: Purchase }) {
  const router = useRouter();

  const { toast } = useToast();

  const deletePurchase = async () => {
    deleteOnePurchaseFromAtom(row.productId);
    resetCommonComponentAtom();
    const res = await deletePurchaseAction(row.productId);
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
            router.push(`/dashboard/purchase-detail/${row.productId}`);
          }}
        >
          <PlusCircle size={18} className="mr-2" /> Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCommonComponentAtom({
              showEditPurchaseModal: true,
              currentElementId: row.productId,
            });
          }}
        >
          <Pencil size={18} className="mr-2" /> Editar datos del producto
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCommonComponentAtom({
              showEditPurchaseImages: true,
              currentElementId: row.productId,
            });
          }}
        >
          <Image size={18} className="mr-2" /> Cargar o modificar imágenes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCommonComponentAtom({
              confirmModal: {
                show: true,
                title: "Eliminar Posible Compra",
                description: `¿Está seguro que desea eliminar la compra: ${row.brand} ${row.model} ${row.year}?`,
                onConfirm: () => {
                  deletePurchase();
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
