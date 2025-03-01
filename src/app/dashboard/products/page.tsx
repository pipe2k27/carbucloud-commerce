import { Metadata } from "next";
import CarsTable from "./components/cars-table.client";
import ProductsSummary from "./components/products-summary";
import CarsTabs from "./components/cars-filters";
import { getCarsByCompanyId } from "@/dynamo-db/cars.db";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const { data: cars } = await getCarsByCompanyId("0001");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-[1600px] place-self-center">
      <ProductsSummary />
      <CarsTabs />
      <div className="min-h-[80vh]">
        <CarsTable cars={cars || []} />
      </div>
    </div>
  );
}
