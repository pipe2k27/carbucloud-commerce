"use client";
import { Button } from "@/components/ui/button";
import { InformationCards } from "./Information-cards.client";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { ShoppingBag } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function ProductsSummary() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <ShoppingBag className="text-primary mr-4" /> Productos en Stock
        </h2>

        <div className="flex items-center space-x-2">
          <Button
            onClick={async () => {
              setCommonComponentAtom({ showNewCarModal: true });
              await Sentry.startSpan(
                {
                  name: "click aca",
                  op: "test",
                },
                async () => {
                  const res = await fetch("/api/milanesa");
                  if (!res.ok) {
                    throw new Error("cacona");
                  }
                }
              );
            }}
          >
            + Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InformationCards />
      </div>
    </div>
  );
}
