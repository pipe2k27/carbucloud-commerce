export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Suspense } from "react";
import { fetchDolarOficialRate } from "@/utils/currencyUtils";
import { redirect } from "next/navigation";
import { Car, searchCarsInDb } from "@/dynamo-db/cars.db";
import CarGrid from "../../explore/_components/car-grid";
import CarGridSkeleton from "../../explore/_components/car-grid-skeleton";

export const metadata: Metadata = {
  title: "Búsqueda de Autos",
  description: "Resultados de búsqueda de autos.",
};

const processParam = (param?: string) => {
  if (!param) return "";
  if (param === "any") return "";
  return param;
};

export default async function SearchPage({ params }: any) {
  const companyId = process.env.COMPANY_ID;
  const { searchParams } = await params;

  if (!companyId || !searchParams[0]) return redirect("/");

  const res = await searchCarsInDb(companyId, {
    brand: processParam(searchParams[0]),
    model: processParam(searchParams[1]),
    minYear: processParam(searchParams[2]),
  });

  if (!res || res.status !== 200 || !res.data) return redirect("/error-page");

  const cars = res.data as Car[];

  const dolarRate = await fetchDolarOficialRate();
  if (!cars || !dolarRate) return redirect("/error-page");

  // Calculamos el precio en USD
  cars.forEach((car: Car) => {
    if (car.price && car.currency === "USD") {
      car.priceUsd = car.price;
    } else {
      car.priceUsd = Math.round(Number(car.price) / dolarRate);
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Resultados</h1>
      <p className="mb-8">Autos en stock</p>

      <Suspense fallback={<CarGridSkeleton />}>
        <CarGrid cars={cars} />
      </Suspense>
    </div>
  );
}
