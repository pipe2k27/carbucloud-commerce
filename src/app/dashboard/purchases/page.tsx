import { Metadata } from "next";
import CarsTable from "./components/purchases-table.client";
import PurchasesHeader from "./components/purchases-header";
import { getPotentialCarPurchasesByCompanyId } from "@/dynamo-db/potentialCarPurchases.db";
import { PurchasesInformationCards } from "./components/purchases-Information-cards.client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function PurchasesPage() {
  const { data: purchases } = await getPotentialCarPurchasesByCompanyId("0001");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-[1600px] w-[100%] place-self-center">
      <PurchasesHeader />
      <PurchasesInformationCards />
      <div className="min-h-[80vh]">
        <CarsTable purchases={purchases || []} />
      </div>
    </div>
  );
}
