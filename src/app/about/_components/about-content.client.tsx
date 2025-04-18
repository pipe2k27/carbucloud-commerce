"use client";

import { Button } from "@/components/ui/button";
import { MessageCircleWarning, SearchCheckIcon } from "lucide-react";
import { Suspense } from "react";
import MapLocation from "../../_home-components/map-location";
import { WebElementTier1 } from "@/dynamo-db/web-elements.db";

type Props = {
  webElements?: Partial<WebElementTier1>;
};

export default function AboutUsContent({ webElements }: Props) {
  return (
    <div className="bg-background text-foreground py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          {webElements?.aboutTitle || "Sobre nosotros"}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {webElements?.aboutText ||
            "En nuestra empresa, nos dedicamos a ofrecer los mejores autos usados del país con un servicio personalizado y transparente. Desde nuestros inicios, nos enfocamos en brindar una experiencia confiable para quienes buscan su próximo vehículo."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild variant="default" className=" px-6 py-4">
          <a
            href="https://wa.me/5491168220080"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleWarning className="ml-[-2px] scale-110" />
            Contactarse por WhatsApp
          </a>
        </Button>

        <Button variant="secondary" className="px-6 py-4">
          Agendar visita
          <SearchCheckIcon size={20} className="ml-[-4px]" />
        </Button>
      </div>
      <section className="my-16 max-w-[800px] mx-auto">
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
    </div>
  );
}
