"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtomValue } from "jotai";
import { Metadata } from "next";
import { carsAtom, setCarsState } from "@/jotai/cars-atom.jotai";
import { Car } from "@/dynamo-db/cars.db";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function CarsTabs() {
  const { cars } = useAtomValue(carsAtom);
  const onFilter = (status: any) => {
    const filteredCars = cars.filter((car: Car) => car.status === status);
    setCarsState({ cars, filteredCars });
  };

  return (
    <div className="translate-y-[90px]">
      <Tabs defaultValue="overview" className="space-y-4 w-fit">
        <TabsList>
          <TabsTrigger
            value="overview"
            onClick={() => {
              setCarsState({ cars, filteredCars: cars });
            }}
          >
            Todos
          </TabsTrigger>
          <TabsTrigger value="analytics" onClick={() => onFilter("available")}>
            Disponibles
          </TabsTrigger>
          <TabsTrigger value="reports" onClick={() => onFilter("reserved")}>
            Reservados
          </TabsTrigger>
          {/* <TabsTrigger value="sold" onClick={() => onFilter("sold")}>
            Vendidos
          </TabsTrigger> */}
          <TabsTrigger value="notifications" onClick={() => onFilter("paused")}>
            Pausados
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4"></TabsContent>
      </Tabs>
    </div>
  );
}
