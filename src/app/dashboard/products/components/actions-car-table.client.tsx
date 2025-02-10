/* eslint-disable jsx-a11y/alt-text */
"use client";

import { MoreHorizontal, Pencil, Image, Trash2 } from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { Car } from "@/dynamo-db/cars.db";

export function ActionsCarTable({ row }: { row: Car }) {
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
        <DropdownMenuItem>
          <Pencil size={18} className="mr-2" /> Editar datos del producto
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCommonComponentAtom({
              showEditCarImagesModal: true,
              editingCarId: row.productId,
            });
          }}
        >
          <Image size={18} className="mr-2" /> Cargar o modificar imágenes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          <Trash2 size={18} className="mr-2" /> Eliminar producto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
