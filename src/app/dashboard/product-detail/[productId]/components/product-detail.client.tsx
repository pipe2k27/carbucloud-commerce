"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Image as ImageIcon,
  Car as CarIcon,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Car } from "@/dynamo-db/cars.db";
import { useRouter } from "next/navigation";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useEffect, useState } from "react";
import ImageCarousel from "@/components/ui/image-carousel";

interface Props {
  data: Car;
  images: string[];
}

export default function ProductDetail({ data, images }: Props) {
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCar(data);
  }, [data]);

  if (!car) return <></>;

  const mainImage =
    car.mainImageUrl ||
    "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/uploads/1739235783900-D_NQ_NP_2X_698744-MLA82189741523_012025-F.JPEG";

  return (
    <div className="max-w-[1300px] w-[90%] mx-auto p-6">
      <div
        onClick={() => {
          router.push("/dashboard/products");
        }}
        className="mb-4 cursor-pointer flex items-center"
      >
        <ArrowLeft className="w-4 mr-1" /> Volver
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <CarIcon className="mr-2 scale-x-[-1] text-primary w-8 h-8" />
          {car.brand} {car.model}
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setCommonComponentAtom({
                showEditCarModal: true,
                currentElementId: car.productId,
                shouldRefreshRouter: true,
              });
            }}
          >
            <Pencil className="w-4 h-4 mr-2" /> Editar Detalles
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCommonComponentAtom({
                showEditCarImagesModal: true,
                currentElementId: car.productId,
                shouldRefreshRouter: true,
              });
            }}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Editar Imágenes
          </Button>
        </div>
      </div>
      <Card className="flex flex-col md:flex-row">
        <CardContent className="pt-6 flex flex-col items-center">
          <ImageCarousel images={[mainImage, ...images]} />
        </CardContent>
        <CardContent className="md:w-2/3 p-4">
          <div className="text-lg font-bold mb-4 flex items-center">
            {" "}
            <CheckCircle2 className="mr-2 text-primary w-5 h-5" />
            Detalles del Vehículo
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem label="Año" value={car.year} />
            <DetailItem label="Tipo" value={car.carType} />
            <DetailItem label="Transmisión" value={car.transmission} />
            <DetailItem label="Motor" value={car.engine} />
            <DetailItem label="Tracción" value={car.traction} />
            <DetailItem label="Kilometraje" value={`${car.km} km`} />
            <DetailItem label="Estado" value={car.status} />
            <DetailItem
              label="Precio"
              value={`${car.currency} $${car.price?.toLocaleString("es") || 0}`}
              className="text-primary"
            />
            <DetailItem
              label="Precio de compra"
              value={`${car.currency} $${
                car.buyingPrice?.toLocaleString("es") || 0
              }`}
            />
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-6" />
          <DetailText label="Notas Internas" value={car.internalNotes} />
          <DetailText label="Descripción" value={car.description} />
        </CardContent>
      </Card>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string | number;
  className?: string;
}

const DetailItem = ({ label, value, className }: DetailItemProps) => (
  <div>
    <p className="text-[12px] text-gray-500">{label}</p>
    <p className={`text-sm font-semibold ${className}`}>
      {value || "Sin Especificar"}
    </p>
  </div>
);

const DetailText = ({ label, value }: DetailItemProps) => (
  <div className="my-4 min-h-14">
    <p className="font-semibold text-gray-500">{label}</p>
    <p className="text-[12px]">{value || "Sin Especificar"} </p>
  </div>
);
