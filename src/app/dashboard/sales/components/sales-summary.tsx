"use client";
import { InformationCards } from "./Information-cards.client";
import { ShoppingBag } from "lucide-react";

export default function ProductsSummary() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <ShoppingBag className="text-primary mr-4" /> Ventas y datos
        </h2>

        <div className="flex items-center space-x-2"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InformationCards />
      </div>
    </div>
  );
}
