export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, SearchCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function SellYourCar() {
  const logoUrl = process.env.LOGO_URL;

  return (
    <Card className="bg-muted my-32 relative">
      <CardHeader className="pt-12 flex flex-col items-center text-center max-w-[98vw] mx-auto px-0">
        <h1 className="text-xl md:text-4xl font-bold mb-4 flex">
          <PlayCircle className="text-primary mr-3 w-7 h-7 md:w-10 md:h-10" />
          Compramos tu auto{" "}
          {/* <Car className="text-primary ml-3  w-7 h-7 md:w-10 md:h-10" /> */}
        </h1>
      </CardHeader>
      <div className="flex flex-col items-center text-center max-w-[98vw] mx-auto px-0">
        <div className="md:text-[16px] mt-3">
          <p className="my-3 flex items-center">
            <CheckCircle className="mr-2 w-4 text-primary" /> Recibí una
            cotización en menos de 24hs
          </p>
          <p className="my-3 flex items-center">
            <CheckCircle className="mr-2 w-4 text-primary" /> Compramos usados
            de todas las Marcas
          </p>
          <p className="my-3 flex items-center">
            <CheckCircle className="mr-2 w-4 text-primary" /> Pagamos en Dólares
            y al contado
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 my-16">
          <Button asChild size="lg" className="py-6 md:px-24 ">
            <Link href="/seller">
              Cotizá tu auto ahora <SearchCheck className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
      {logoUrl && (
        <Image
          src={logoUrl}
          alt="Logo"
          width={120}
          height={50}
          className=" relative left-[50%] translate-x-[-50%]  grayscale opacity-30 mb-12"
        />
      )}
    </Card>
  );
}
