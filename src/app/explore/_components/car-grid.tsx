"use client";

import CarCard from "@/components/Common/car-card";
import { Car } from "@/dynamo-db/cars.db";
import { CarGridFilters } from "./car-grid-filters";
import { useState } from "react";
import CarGridSort from "./car-grid-sort";
import { CarSearchForm } from "@/components/CarSearch/CarSearch.client";
import { motion, AnimatePresence } from "framer-motion";

export default function CarGrid({ cars }: { cars: Car[] }) {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);

  return (
    <div>
      <AnimatePresence>
        {showSearchForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-[100px]"
          >
            <CarSearchForm />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-[-100px]">
        <div className="absoulte top-0 right-0">
          <div>
            <CarGridSort cars={filteredCars} setSortedCars={setFilteredCars} />
          </div>
        </div>
        <div className="block lg:grid lg:grid-cols-[300px_auto]">
          <CarGridFilters
            setShowSearchForm={setShowSearchForm}
            cars={cars}
            setFilteredCars={setFilteredCars}
          />
          {filteredCars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-9">
                {filteredCars.map((car, index) => (
                  <div key={index} className="flex justify-center">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No se encontraron autos con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
