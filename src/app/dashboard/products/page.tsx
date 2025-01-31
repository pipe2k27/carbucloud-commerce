import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { Sidebar } from "./components/sidebar.client";
import CarsTable from "./components/cars-table.client";
import ProductsSummary from "./components/products-summary";
import CarsTabs from "./components/cars-filters";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-[300px_1fr] gap-4">
      <Sidebar />
      <div className="flex-1 space-y-4 p-8 pt-6 max-w-[1600px] place-self-center">
        <ProductsSummary />
        <CarsTabs />
        <CarsTable />
      </div>
    </div>
  );
}
