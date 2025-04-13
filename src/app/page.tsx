import { Suspense } from "react";
import HeroBanner from "./_home-components/hero-banner";
import MapLocation from "./_home-components/map-location";
import CustomerFeedback from "./_home-components/customer-feedback";
import CarGridBanner from "@/components/Common/car-grid-banner.server";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />
      <CarGridBanner
        label="En Stock"
        description="Todos nuestros autos estan disponibles para entrega inmediata."
      />
      <section className="my-16">
        <h2 className="text-2xl font-semibold text-center mb-16">
          ¿Dónde estamos?
        </h2>
        <Suspense
          fallback={
            <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
          }
        >
          <MapLocation />
        </Suspense>
      </section>

      <section className="my-16">
        <h2 className="text-2xl font-semibold text-center mb-16">
          Lo que dicen nuestros clientes
        </h2>
        <CustomerFeedback />
      </section>
    </div>
  );
}
