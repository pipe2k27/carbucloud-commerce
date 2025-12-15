"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currencyUtils";
import { Car } from "@/dynamo-db/cars.db";
import { MessageCircleWarning, Plus } from "lucide-react";
import { CarStatusBadge } from "./car-status-badge";
import { useRouter } from "next/navigation";
import { openWhatsappModal } from "../Modals/transformation/new-contact-modal.client";
import { Sale } from "@/dynamo-db/sales.db";
import { useAtomValue } from "jotai";
import { brandsAtom } from "@/jotai/brands-atom.jotai";
import { companyCountryAtom } from "@/jotai/company-country-atom.jotai";

export default function CarCard({ car }: { car: Car | Sale }) {
  const router = useRouter();

  const carBrands = useAtomValue(brandsAtom);
  const { country } = useAtomValue(companyCountryAtom);

  const brandLogoPath = carBrands.brands.find(
    (brand) => brand.brandName === car.brand
  )?.logoPath;

  console.log(carBrands);

  let sold = false;

  if (car.status === "sold") {
    sold = true;
  }
  return (
    <Card className="overflow-hidden max-w-[500px] h-fit w-full hover:scale-[0.995] transition-all duration-[400ms] ease-in relative">
      <CardContent
        className={`p-0 min-h-[550px] ${
          (car.status === "reserved" || sold) && "opacity-50"
        }`}
      >
        <div className="relative aspect-square border-8 border-muted bg-muted rounded-sm overflow-hidden">
          <Image
            src={car.mainImageUrl || "/placeholder.svg?height=300&width=500"}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover rounded-lg"
            onClick={() => {
              if (!sold) router.push(`/product-detail/${car.productId}`);
              else router.push(`/vendidos-detail/${car.productId}`);
            }}
          />
        </div>
        {brandLogoPath && (
          <Image
            src={brandLogoPath}
            alt={`${car.brand} Logo`}
            width={60}
            height={60}
            className="absolute top-[7.5px] right-[7.5px] rounded-bl-[8px] rounded-tr-[8px] "
          />
        )}
        <div className="p-4">
          <div className="flex w-full items-start justify-between">
            <h3 className="text-[16px] font-semibold pr-1">
              {car.brand} {car.model}
            </h3>
            <div className="bg-muted p-2 rounded-sm">
              <CarStatusBadge car={car} status={car.status} />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {car.year} • {car.km.toLocaleString("es")} km
          </p>
          <p className="text-lg font-semibold mt-2">
            {!sold && formatCurrency(car.price, car.currency)}
            {!sold &&
              car.priceUsd &&
              car.currency === "ARS" &&
              country !== "UY" && (
                <span className="text-muted-foreground text-sm opacity-55 italic ml-2 font-normal">
                  ({formatCurrency(car.priceUsd, "USD")})
                </span>
              )}
            {/* Show "Venta" badge or info if car is a Sale */}
            {"soldPrice" in car && (
              <span className="text-muted-foreground opacity-55">
                {formatCurrency(car.soldPrice, car.currency)}{" "}
                <span className="text-muted-foreground text-sm opacity-55 italic ml-2 font-normal">
                  Vendido
                </span>
              </span>
            )}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {car.transmission && car.transmission.length > 1 && (
              <span className="inline-block bg-gray-200/20 rounded-full px-3 py-1 text-xs font-semibold text-card-foreground border border-solid border-muted">
                {car.transmission}
              </span>
            )}

            {car.engine && car.engine.length > 1 && (
              <span className="inline-block bg-gray-200/20 rounded-full px-3 py-1 text-xs font-semibold border border-solid border-muted">
                {car.engine}
              </span>
            )}

            {car.carType && car.carType.length > 1 && (
              <span className="inline-block bg-gray-200/20 rounded-full px-3 py-1 text-xs font-semibold border border-solid border-muted">
                {car.carType}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between items-center w-full">
          <Button
            // asChild
            className="w-[48%]"
            onClick={() => {
              if (!sold) router.push(`/product-detail/${car.productId}`);
              else router.push(`/vendidos-detail/${car.productId}`);
            }}
          >
            Ver detalles <Plus size={16} className="ml-[-4px]" />
          </Button>
          <Button
            variant="secondary"
            className="w-[48%]"
            onClick={() => {
              openWhatsappModal(car);
            }}
          >
            Consultar
            <MessageCircleWarning className="ml-[-2px] scale-110" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
