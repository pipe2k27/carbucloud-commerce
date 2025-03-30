"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Image as ImageIcon,
  Car as CarIcon,
  ArrowLeft,
  CircleArrowRight,
} from "lucide-react";
import { Car, ownershipOptions } from "@/dynamo-db/cars.db";
import { useRouter } from "next/navigation";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useEffect, useState } from "react";
import ImageCarousel from "@/components/ui/image-carousel";
import { dateStringToddmmyyyy } from "@/utils/dateUtils";
import { statusConfig } from "@/app/dashboard/products/components/car-status.client";

interface Props {
  data: Car;
  images: string[];
}

export default function ProductDetail({ data, images }: Props) {
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();

  const [currentImages, setCurrentImages] = useState<string[]>();

  useEffect(() => {
    setCar(data);
    setCurrentImages(undefined);
    const mainImage =
      data?.mainImageUrl ||
      "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/uploads/1739235783900-D_NQ_NP_2X_698744-MLA82189741523_012025-F.JPEG";
    const newImages = [mainImage, ...images];
    setTimeout(() => {
      setCurrentImages([...newImages]);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!car) return <></>;

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
          <CircleArrowRight className="mr-2 text-primary w-6 h-6" />
          Detalles del Vehículo
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
          {currentImages && <ImageCarousel images={currentImages} />}
        </CardContent>
        <CardContent className="md:w-2/3 p-4">
          <div className="text-lg font-bold mb-4 flex items-center">
            {" "}
            <CarIcon className="mr-2  scale-x-[-1] text-primary w-6 h-6" />
            {car.brand} {car.model}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem label="Año" value={car.year} />
            <DetailItem label="Tipo" value={car.carType} />
            <DetailItem label="Transmisión" value={car.transmission} />
            <DetailItem label="Motor" value={car.engine} />
            <DetailItem label="Tracción" value={car.traction} />
            <DetailItem label="Kilometraje" value={`${car.km} km`} />
            <DetailItem
              icon={statusConfig[car.status]?.icon}
              label="Estado"
              value={statusConfig[car.status]?.label}
              className={statusConfig[car.status]?.color || "text-gray-500"}
            />
            <DetailItem
              label="Fecha de Ingreso:"
              value={dateStringToddmmyyyy(String(car.createdAt))}
              className="text-muted-foreground"
            />
            <DetailItem
              label="Precio"
              value={`${car.currency} $${car.price?.toLocaleString("es") || 0}`}
              className="text-primary"
            />
            <DetailItem
              label="Dueño"
              value={
                ownershipOptions.find((e) => e.value === car.ownershipType)
                  ?.label || "Sin Especificar"
              }
            />
            <DetailItem
              label="Precio de compra"
              value={`${car.currency} $${
                car.buyingPrice?.toLocaleString("es") || 0
              }`}
            />
            {car.ownershipType === "other" && car.ownerName && (
              <DetailItem label="Nombre del dueño" value={car.ownerName} />
            )}
            {car.ownershipType === "other" && car.ownerPhone && (
              <DetailItem label="Telefono del dueño" value={car.ownerPhone} />
            )}
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-6" />
          <DetailText label="Descripción" value={car.description} />
          <DetailText label="Notas Internas" value={car.internalNotes} />
        </CardContent>
      </Card>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string | number;
  className?: string;
  icon?: React.ElementType;
}

const DetailItem = ({
  label,
  value,
  className,
  icon: StatusIcon,
}: DetailItemProps) => (
  <div>
    <p className="text-[12px] text-gray-500">{label}</p>
    <p className={`text-sm font-semibold ${className} flex items-center`}>
      {StatusIcon && <StatusIcon className="w-4 h-4 mr-1" />}
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
