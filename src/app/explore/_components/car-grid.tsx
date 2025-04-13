"use client";

import CarCard from "@/components/Common/car-card";
import { Car } from "@/dynamo-db/cars.db";
import { CarGridFilters } from "./car-grid-filters";
import { useState } from "react";

export default function CarGrid({ cars }: { cars: Car[] }) {
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);

  return (
    <div className="block lg:grid lg:grid-cols-[300px_auto]">
      <CarGridFilters cars={cars} setFilteredCars={setFilteredCars} />
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-9">
          {filteredCars.map((car, index) => (
            <div key={index} className="flex justify-center">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            No se encontraron autos con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
}
