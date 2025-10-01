"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircleWarning } from "lucide-react";
import { Car } from "@/dynamo-db/cars.db";
import { Sale } from "@/dynamo-db/sales.db";
import { openWhatsappModal } from "@/components/Modals/transformation/new-contact-modal.client";

interface PriceBarProps {
  car: Car | Sale;
  sold?: boolean;
}

export default function PriceBar({ car, sold }: PriceBarProps) {
  const soldCar = car as Sale;
  const displayPrice = sold ? soldCar.soldPrice : car.price;
  const currency = car.currency;
  const carModel = `${car.brand} ${car.model}`;

  return (
    <>
      {/* Safe-area underlay: paints below the bar when Safari's toolbar collapses */}
      <div className="fixed inset-x-0 bottom-0 z-40 h-[env(safe-area-inset-bottom)] bg-background pointer-events-none" />

      {/* The bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-[max(0px,env(safe-area-inset-bottom))]">
        <Card className="rounded-none border-0 shadow-lg">
          <div className="mx-auto flex w-[98%] max-w-[1000px] items-center justify-between px-4 py-3">
            <div className="flex flex-col">
              <div className="mb-1 text-xs text-muted-foreground">
                {carModel}
              </div>
              <div className="text-lg font-bold text-primary md:text-2xl">
                {currency === "USD" ? "U$D " : "$"}
                {displayPrice?.toLocaleString("es") || 0}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => openWhatsappModal(car)}
                size="sm"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <MessageCircleWarning className="h-4 w-4" />
                <span className="sm:inline">Contactar</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
