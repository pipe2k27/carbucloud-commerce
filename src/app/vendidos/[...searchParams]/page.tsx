export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Car } from "@/dynamo-db/cars.db";
import { Suspense } from "react";
import { fetchDolarOficialRate } from "@/utils/currencyUtils";
import { redirect } from "next/navigation";
import CleanupBadge from "@/app/catalogo/_components/cleanup-badge";
import SearchBadges from "@/app/catalogo/_components/search-badges.client";
import CarGridSkeleton from "@/app/catalogo/_components/car-grid-skeleton";
import CarGrid from "@/app/catalogo/_components/car-grid";
import { getSalesByCompanyId, searchSalesInDb } from "@/dynamo-db/sales.db";
import { isMotos } from "@/utils/isMotos";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: process.env.PAGE_NAME,
    description: "Concesionaria de autos",
    openGraph: {
      title: process.env.PAGE_NAME,
      description: "Concesionaria de autos",
      url: ``,
      images: [
        {
          url: process.env.LOGO_JPEG || "",
          width: 1200,
          height: 630,
          alt: process.env.PAGE_NAME,
        },
      ],
    },
  };
}

const processParam = (param?: string) => {
  if (!param) return "";
  if (param === "todos") return "";
  return decodeURIComponent(param);
};

export default async function SalesPage({ params }: any) {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const isMotosOnly = isMotos(companyId);

  const { searchParams } = await params;

  let cars: Car[] = [];

  let showParams = false;

  if (searchParams[0] && searchParams[0] !== "todos") {
    const res = await searchSalesInDb(companyId, {
      brand: processParam(searchParams[0]),
      model: processParam(searchParams[1]),
      minYear: processParam(searchParams[2]),
    });

    if (!res || res.status !== 200 || !res.data) return redirect("/error-page");

    cars = res.data as Car[];
    showParams = true;
  } else {
    const res = await getSalesByCompanyId(companyId);
    if (!res || res.status !== 200 || !res.data) return redirect("/error-page");
    cars = res.data as Car[];
  }

  const dolarRate = await fetchDolarOficialRate();

  if (!cars || !dolarRate) return redirect("/error-page");

  if (dolarRate) {
    cars.forEach((car: Car) => {
      if (car.price && car.currency === "USD") {
        car.priceUsd = car.price;
      } else {
        car.priceUsd = Math.round(Number(car.price) / dolarRate);
      }
    });
  }

  return (
    <div className="container relative mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">
        {showParams ? "Resultados" : "Vendidos"}{" "}
      </h1>
      <CleanupBadge showParams={showParams} />
      {!showParams && (
        <p className="mb-8">
          {isMotosOnly ? "Motos Vendidas" : "Autos Vendidos"}
        </p>
      )}
      {showParams && <SearchBadges searchParams={searchParams} />}
      <Suspense fallback={<CarGridSkeleton />}>
        <div className={`${showParams && "mt-[110px]"} md:mt-4`}>
          <CarGrid cars={cars} isMotosOnly={isMotosOnly} />
        </div>
      </Suspense>
    </div>
  );
}
