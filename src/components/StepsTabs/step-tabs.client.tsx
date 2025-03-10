"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function StepTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // Define tab mapping
  const tabMapping: Record<string, string> = {
    "/dashboard/purchases": "purchases",
    "/dashboard/products": "products",
    "/dashboard/sales": "sales",
  };

  // Determine the selected tab based on the current URL

  const [selectedTab, setSelectedTab] = useState(
    tabMapping[pathname] || "purchases"
  );

  useEffect(() => {
    setSelectedTab(tabMapping[pathname] || "purchases");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (pathname.includes("detail")) return null;

  return (
    <div>
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        className="space-y-4 left-[50%] relative translate-x-[-48%] mt-8 w-fit"
      >
        <TabsList>
          <TabsTrigger
            className="w-[240px]"
            value="purchases"
            onClick={() => router.push("/dashboard/purchases")}
          >
            1. Compras
          </TabsTrigger>
          <TabsTrigger
            className="w-[240px]"
            value="products"
            onClick={() => router.push("/dashboard/products")}
          >
            2. Productos en stock
          </TabsTrigger>
          <TabsTrigger
            className="w-[240px]"
            value="sales"
            onClick={() => router.push("/dashboard/sales")}
          >
            3. Ventas
          </TabsTrigger>
        </TabsList>
        <TabsContent value={selectedTab} className="space-y-4"></TabsContent>
      </Tabs>
    </div>
  );
}
