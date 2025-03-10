export const dynamic = "force-dynamic";

import { Metadata } from "next";
import ProductsSummary from "./components/sales-summary";
import { getSalesByCompanyId } from "@/dynamo-db/sales.db";
import SalesTable from "./components/sales-table.client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function SalesPage() {
  const { data: sales } = await getSalesByCompanyId("0001");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-[1600px] place-self-center">
      <ProductsSummary />
      <div className="min-h-[80vh]">
        <SalesTable sales={sales || []} />
      </div>
    </div>
  );
}
