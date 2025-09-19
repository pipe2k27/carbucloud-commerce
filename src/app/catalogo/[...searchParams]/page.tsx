export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Car, getCarsByCompanyId, searchCarsInDb } from "@/dynamo-db/cars.db";
import { Suspense } from "react";
import CarGridSkeleton from "../_components/car-grid-skeleton";
import CarGrid from "../_components/car-grid";
import { fetchDolarOficialRate } from "@/utils/currencyUtils";
import { redirect } from "next/navigation";
import CleanupBadge from "../_components/cleanup-badge";
import SearchBadges from "../_components/search-badges.client";
import {
  getSellerTypeServer,
  getSellerWordServerCapitalized,
} from "@/utils/sellerTypeServer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: process.env.PAGE_NAME,
    description: "Tu Concesionaria",
    openGraph: {
      title: process.env.PAGE_NAME,
      description: "Tu Concesionaria",
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

export default async function ExplorePage({ params }: any) {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;

  const sellerType = await getSellerTypeServer(companyId);
  const sellerWordCapitalized = await getSellerWordServerCapitalized(
    sellerType
  );

  const { searchParams } = await params;

  let cars: Car[] = [];

  let showParams = false;

  if (searchParams[0] && searchParams[0] !== "todos") {
    const res = await searchCarsInDb(companyId, {
      brand: processParam(searchParams[0]),
      model: processParam(searchParams[1]),
      minYear: processParam(searchParams[2]),
    });

    if (!res || res.status !== 200 || !res.data) return redirect("/error-page");

    cars = res.data as Car[];
    showParams = true;
  } else {
    const res = await getCarsByCompanyId(companyId);
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

  cars.sort((a, b) => {
    // If one car is reserved and the other is not, send reserved to the end
    if (a.status === "reserved" && b.status !== "reserved") {
      return 1;
    }
    if (a.status !== "reserved" && b.status === "reserved") {
      return -1;
    }
    // Otherwise, sort by priceUsd if both exist

    return 0;
  });

  return (
    <div className="container relative mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">
        {showParams ? "Resultados" : "Explorar"}{" "}
      </h1>
      <CleanupBadge showParams={showParams} />
      {!showParams && <p className="mb-8">{sellerWordCapitalized} en stock</p>}
      {showParams && <SearchBadges searchParams={searchParams} />}
      <Suspense fallback={<CarGridSkeleton />}>
        <div className={`${showParams && "mt-[110px]"} md:mt-4`}>
          <CarGrid cars={cars} />
        </div>
      </Suspense>
    </div>
  );
}
