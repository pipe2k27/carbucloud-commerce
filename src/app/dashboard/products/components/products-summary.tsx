"use client";
import { Button } from "@/components/ui/button";
import { InformationCards } from "./Information-cards.client";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";

export default function ProductsSummary() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setCommonComponentAtom({ showNewCarModal: true });
            }}
          >
            + Nuevo Producto
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InformationCards />
      </div>
    </>
  );
}
