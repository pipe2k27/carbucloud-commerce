export const dynamic = "force-dynamic";

import { Car, getCarsByCompanyId } from "@/dynamo-db/cars.db";
import { Suspense } from "react";
import CarCard from "./car-card";
import CarGridSkeleton from "@/app/explore/_components/car-grid-skeleton";
import {
  getWebElementsByCompanyId,
  WebElementTier1,
} from "@/dynamo-db/web-elements.db";

type Props = {
  label?: string;
  description?: string;
};

export default async function SelectedCarGridBanner({
  label,
  description,
}: Props) {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const { data: cars, status: status2 } = await getCarsByCompanyId(companyId);

  const { data, status } = await getWebElementsByCompanyId(companyId);

  let selectedCars: Car[] = [];

  if (data && data.length > 0) {
    const webElements = data[0] as WebElementTier1;

    if (status !== 200 || status2 !== 200) {
      return <></>;
    }

    if (webElements) {
      const carouselOrder = [
        webElements.carrouselElement1,
        webElements.carrouselElement2,
        webElements.carrouselElement3,
      ];

      selectedCars = carouselOrder
        .map((id) => cars.find((car: Car) => car.productId === id))
        .filter((car): car is Car => Boolean(car)); // <-- this removes undefined

      if (selectedCars.length < 3 && cars.length > 2) {
        selectedCars = [...selectedCars, cars[0], cars[1], cars[2]];
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {label && (
          <h1 className="text-2xl w-full text-center  font-semibold mb-2">
            {label}
          </h1>
        )}
        {description && <div className="w-full text-center">{description}</div>}
      </div>
      <Suspense fallback={<CarGridSkeleton />}>
        {cars.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-9">
            {selectedCars.slice(0, 3).map((car: Car, index: number) => (
              <div key={index} className="flex justify-center">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
