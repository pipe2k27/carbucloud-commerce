export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Car, getCarsByCompanyId } from "@/dynamo-db/cars.db";
import { Suspense } from "react";
import CarGridSkeleton from "./_components/car-grid-skeleton";
import CarGrid from "./_components/car-grid";
import { fetchDolarOficialRate } from "@/utils/currencyUtils";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const { data: cars } = await getCarsByCompanyId(companyId);

  const dolarRate = await fetchDolarOficialRate();

  if (!cars || !dolarRate) return redirect("/error-page");

  if (dolarRate) {
    cars.forEach((car: Car) => {
      if (car.price && car.currency === "USD") {
        car.priceUsd = car.price;
      } else {
        car.priceUsd = Math.round(Number(car.price) / dolarRate);
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Explorar</h1>
      <p className="mb-8">Autos en stock</p>

      <Suspense fallback={<CarGridSkeleton />}>
        <CarGrid cars={cars} />
      </Suspense>
    </div>
  );
}
