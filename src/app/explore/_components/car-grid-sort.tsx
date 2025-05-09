import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "@/dynamo-db/cars.db";
import { Car as CarIcon, TrendingUp } from "lucide-react";

type Props = {
  cars: Car[];
  setSortedCars: (cars: Car[]) => void;
};

export default function CarSortSelect({ cars, setSortedCars }: Props) {
  const [sortOption, setSortOption] = useState<string>("");

  const handleSortChange = (value: string) => {
    setSortOption(value);

    if (value === "none") {
      // Restore original order
      setSortedCars(cars);
      return;
    }

    const sorted = [...cars].sort((a, b) => {
      const priceA = Number(a.priceUsd) || 0;
      const priceB = Number(b.priceUsd) || 0;
      return value === "asc" ? priceA - priceB : priceB - priceA;
    });

    setSortedCars(sorted);
  };

  return (
    <div className="flex flex-row py-4 gap-2 justify-between items-center">
      <div>
        <p className="text-sm hidden lg:block pl-[310px] lg:translate-y-[16px]">
          <CarIcon className="text-primary inline mr-2 scale-x-[-100%] translate-y-[-2px] text-lg" />
          Mostrando{" "}
          <span className="font-semibold bg-muted px-2 rounded-sm py-2">
            {cars.length || 0}
          </span>{" "}
          Autos
        </p>
      </div>
      <div>
        <div className="mb-0 pl-2 text-muted-foreground text-xs">
          Ordenar por
          <TrendingUp className="text-primary inline ml-1 translate-y-[-1px] w-4" />
        </div>
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-select" className="w-[130px] md:w-[200px]">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-muted-foreground">
              Seleccionar
            </SelectItem>
            <SelectItem value="asc">Menor Precio</SelectItem>
            <SelectItem value="desc">Mayor Precio</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
