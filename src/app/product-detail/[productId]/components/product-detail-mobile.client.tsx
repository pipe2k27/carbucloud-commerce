"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car as CarIcon,
  ArrowLeft,
  CircleArrowRight,
  MessageCircleWarning,
  SearchCheckIcon,
} from "lucide-react";
import { Car } from "@/dynamo-db/cars.db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageCarousel from "@/components/ui/image-carousel";
import { statusConfig } from "@/components/Common/car-status-badge";
import { openWhatsappModal } from "@/components/Modals/transformation/new-contact-modal.client";
import SpecCards from "./spec-cards.client";

interface Props {
  data: Car;
  images: string[];
}

export default function ProductDetailMobile({ data, images }: Props) {
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();

  const [currentImages, setCurrentImages] = useState<string[]>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="max-w-[1500px] w-[98%] mx-auto p-1 mb-8">
      <div
        onClick={() => {
          router.push("/explore");
        }}
        className="mb-6 cursor-pointer flex items-center mt-6"
      >
        <ArrowLeft className="w-4 mr-1" /> Volver
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <CircleArrowRight className="mr-2 text-primary w-6 h-6" />
          Detalles del Vehículo
        </h1>
      </div>
      <Card className="flex flex-col lg:flex-row relative">
        <div className="absolute top-0 right-0 z-10 bg-muted w-[230px] h-[68px] place-content-center  pl-8 rounded-bl-[8px] rounded-tr-[12px] hidden lg:block">
          <div>
            <div className="text-xs">Precio:</div>
            <div className="font-semibold text-primary text-lg text-left w-full">
              {car.currency === "USD" ? "U$D " : "$"}
              {car.price?.toLocaleString("es") || 0}
            </div>
          </div>
        </div>
        <CardContent className="pt-0 px-0 flex flex-col items-center pb-0">
          {currentImages && <ImageCarousel images={currentImages} />}
        </CardContent>
        <CardContent className="lg:w-2/3 p-4 pt-0 lg:pt-14">
          <div className="text-lg font-bold mb-4 flex relative w-full ">
            <div className="w-[45px]">
              <CarIcon className="mr-2  scale-x-[-1] text-primary w-8 h-8 translate-y-[-3px]" />
            </div>
            <div className="w-full">
              <div className="text-[11px] text-muted-foreground font-normal absolute top-[-18px] left-[45px]">
                {car.year} - {Number(car.km).toLocaleString("es")}km
              </div>
              <div className="lg:max-w-[calc(100%_-_230px)]">
                {car.brand} {car.model}
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-4 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Año" value={car.year} />
            <DetailItem label="Tipo" value={car.carType} />
            <DetailItem label="Transmisión" value={car.transmission} />
            <DetailItem label="Motor" value={car.engine} />
            <DetailItem label="Tracción" value={car.traction} />
            <DetailItem
              label="Kilometraje"
              value={`${Number(car.km).toLocaleString("es")} km`}
            />
            <DetailItem
              icon={statusConfig[car.status]?.icon}
              label="Estado"
              value={statusConfig[car.status]?.label}
              className={statusConfig[car.status]?.color || "text-gray-500"}
            />
            {/* <DetailItem
              label="Fecha de Ingreso:"
              value={dateStringToddmmyyyy(String(car.createdAt))}
              className="text-muted-foreground"
            /> */}
            <div className="lg:hidden">
              <DetailItem
                label="Precio"
                value={`${car.currency} $${
                  car.price?.toLocaleString("es") || 0
                }`}
                className="text-primary"
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-6" />
          <div className="lg:min-h-[100px]">
            <DetailText label="Descripción" value={car.description} />
          </div>
          {/* <DetailText label="Notas Internas" value={car.internalNotes} /> */}
          <div className="flex justify-between items-center w-full mt-2">
            <Button
              // asChild
              className="w-[48%]"
              onClick={() => {
                openWhatsappModal(car);
              }}
            >
              Agendar Visita <SearchCheckIcon size={20} className="ml-[-4px]" />
            </Button>
            <Button
              onClick={() => {
                openWhatsappModal(car);
              }}
              variant="secondary"
              className="w-[48%]"
            >
              Consultar
              <MessageCircleWarning className="ml-[-2px] scale-110" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <SpecCards car={car} />
      </div>
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
