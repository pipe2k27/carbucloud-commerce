export const dynamic = "force-dynamic";

import { Suspense } from "react";
import HeroBanner from "./_home-components/hero-banner";
import MapLocation from "./_home-components/map-location";
// import CustomerFeedback from "./_home-components/customer-feedback";
import SelectedCarGridBanner from "@/components/Common/selected-car-grid-banner.server";
import SellYourCar from "./_home-components/sell-your-car";
import WhatsAppButton from "@/components/Common/whatsapp-button.client";
import { Metadata } from "next";

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

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <HeroBanner />
        <SelectedCarGridBanner
          label="En Stock"
          description="Todos nuestros autos estan disponibles para entrega inmediata."
        />
        <SellYourCar />
        {process.env.NEXT_PUBLIC_MAP_LOCATION && (
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
        )}
        {/* <section className="my-16">
          <h2 className="text-2xl font-semibold text-center mb-16">
            Lo que dicen nuestros clientes
          </h2>
          <CustomerFeedback />
        </section> */}
      </div>
      <WhatsAppButton />
    </>
  );
}
