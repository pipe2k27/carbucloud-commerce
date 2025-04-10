import { Suspense } from "react";
import HeroBanner from "./_home-components/hero-banner";
import MapLocation from "./_home-components/map-location";
import CustomerFeedback from "./_home-components/customer-feedback";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">¿Dónde estamos?</h2>
        <Suspense
          fallback={
            <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
          }
        >
          <MapLocation />
        </Suspense>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Lo que dicen nuestros clientes
        </h2>
        <CustomerFeedback />
      </section>
    </div>
  );
}
