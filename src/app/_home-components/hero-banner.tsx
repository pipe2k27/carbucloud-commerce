export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getWebElementsByCompanyId } from "@/dynamo-db/web-elements.db";
import { CarSearchForm } from "@/components/CarSearch/CarSearch.client";
import { BadgeDollarSign, Car } from "lucide-react";

export default async function HeroBanner() {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const response = (await getWebElementsByCompanyId(companyId)) as any;

  const webElements =
    response.status === 200 &&
    Array.isArray(response.data) &&
    response.data.length
      ? response.data[0]
      : {};

  const logoUrl = process.env.LOGO_URL;

  return (
    <div className="mb-8">
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={
              webElements.bannerImageUrl ||
              "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/home/pexels-pixabay-164634.jpg"
            }
            alt="Foto de autos usados"
            width={1200}
            height={600}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative py-20 px-6 md:py-32 md:px-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {webElements.title || "Encontrá el auto ideal para vos"}
          </h1>
          <p className="text-xl text-white/90 mb-8">
            {webElements.subtitle ||
              "Las mejores ofertas en vehículos certificados. ¡Fácil, rápido y seguro!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/catalogo/todos">
                Ver autos disponibles <Car className="mr-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Link href="/vende-tu-auto">
                Vendé tu Auto <BadgeDollarSign />{" "}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <CarSearchForm logoUrl={logoUrl} />
    </div>
  );
}
