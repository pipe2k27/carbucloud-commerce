export const dynamic = "force-dynamic";

import { Car, getCarsByCompanyId } from "@/dynamo-db/cars.db";
import { Suspense } from "react";
import CarCard from "./car-card";
import CarGridSkeleton from "@/app/explore/_components/car-grid-skeleton";

type Props = {
  label?: string;
  description?: string;
};

export default async function CarGridBanner({ label, description }: Props) {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const { data: cars } = await getCarsByCompanyId(companyId);

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
            {cars.slice(0, 3).map((car: Car, index: number) => (
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
