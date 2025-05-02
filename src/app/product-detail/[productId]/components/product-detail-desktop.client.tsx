"use client";

import { Button } from "@/components/ui/button";
import {
  Car as CarIcon,
  DownloadCloud,
  MessageCircleWarning,
  SearchCheckIcon,
} from "lucide-react";
import { Car } from "@/dynamo-db/cars.db";
import { useEffect, useState } from "react";
import { statusConfig } from "@/components/Common/car-status-badge";
import { openWhatsappModal } from "@/components/Modals/transformation/new-contact-modal.client";
import ImageGrid from "./image-grid.client";
import { formatCurrency } from "@/utils/currencyUtils";
import SpecCards from "./spec-cards.client";

interface Props {
  data: Car;
  images: string[];
  logoUrl?: string;
}

export default function ProductDetailDesktop({ data, images, logoUrl }: Props) {
  const [car, setCar] = useState<Car | null>(null);

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
    <div className="py-8 mb-8 max-w-[1488px] mx-auto w-[calc(80vw+48px)]">
      <div className="my-12 flex justify-between items-center">
        <div className="flex items-center">
          <div className="max-w-[35vw] whitespace-nowrap overflow-hidden text-lg  xl:text-3xl font-bold flex relative">
            <div className="w-[45px]">
              <CarIcon className="mr-2  scale-x-[-1] text-primary w-8 h-8 translate-y-[2px]" />
            </div>
            <div className="w-full">
              <div className="text-[13px] text-muted-foreground font-normal absolute top-[-24px] left-[45px]">
                {car.year} - {Number(car.km).toLocaleString("es")}km
              </div>
              <div className="translate-y-[5px] xl:translate-y-0">
                {car.brand} {car.model}
              </div>
            </div>
          </div>
          <div className="font-normal text-lg text-muted-foreground translate-y-[4px] align-bottom p-0 ml-0 opacity-60">
            / {formatCurrency(car.price, car.currency)}
          </div>
        </div>

        <div>
          <Button
            onClick={() => {
              openWhatsappModal(car);
            }}
            className="w-[200px] mr-4"
            variant="secondary"
          >
            Consultar
            <MessageCircleWarning className="ml-[-2px] scale-110" />
          </Button>
          <Button
            onClick={() => {
              openWhatsappModal(car);
            }}
            className="w-[200px]"
          >
            Ficha Tecnica
            <DownloadCloud className="ml-[-2px] scale-110" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex justify-center items-center w-full">
          {currentImages && (
            <ImageGrid logoUrl={logoUrl} images={currentImages} />
          )}
        </div>
        <div className="w-full my-12">
          <div className="text-lg mt-10 font-bold mb-4 flex relative w-full ">
            {/* <div className="w-[45px]">
              <CarIcon className="mr-2  scale-x-[-1] text-primary w-8 h-8 translate-y-[-3px]" />
            </div> */}
            <div className="w-full">
              <div className="lg:max-w-[calc(100%_-_230px)]">
                {car.brand} {car.model}
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-4 mb-12" />
          <SpecCards car={car} />

          <div className="w-full h-[1px] bg-gray-300 mt-8 mb-8" />
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Marca" value={car.brand} />
            <DetailItem label="Modelo y versión" value={car.model} />
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
            <div className="">
              <DetailItem
                label="Precio"
                value={`${car.currency} $${
                  car.price?.toLocaleString("es") || 0
                }`}
                className="text-primary"
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-8" />
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
        </div>
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
