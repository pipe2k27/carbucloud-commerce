"use client";
import { Button } from "@/components/ui/button";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { PackagePlus } from "lucide-react";

export default function PurchasesHeader() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <PackagePlus className="text-primary mr-4" /> Posibles Compras
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setCommonComponentAtom({ showNewCarPurchaseModal: true });
            }}
          >
            + Agreger Nueva Compra
          </Button>
        </div>
      </div>
    </>
  );
}
