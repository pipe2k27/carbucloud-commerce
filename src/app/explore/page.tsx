export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getCarsByCompanyId } from "@/dynamo-db/cars.db";
import { Suspense } from "react";
import CarGridSkeleton from "./_components/car-grid-skeleton";
import CarGrid from "./_components/car-grid";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const { data: cars } = await getCarsByCompanyId("0001");

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
