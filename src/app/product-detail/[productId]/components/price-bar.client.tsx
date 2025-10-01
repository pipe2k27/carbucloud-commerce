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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <Card className="rounded-none border-0 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 max-h-[80px] min-h-[60px] max-w-[1000px] mx-auto w-[98%]">
          {/* Price Section */}
          <div className="flex flex-col">
            <div className="text-xs text-muted-foreground mb-1">{carModel}</div>
            <div className=" text-lg md:text-2xl font-bold text-primary">
              {currency === "USD" ? "U$D " : "$"}

              {displayPrice?.toLocaleString("es") || 0}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => openWhatsappModal(car)}
              size="sm"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <MessageCircleWarning className="w-4 h-4" />{" "}
              <span className="sm:inline">Contactar</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
