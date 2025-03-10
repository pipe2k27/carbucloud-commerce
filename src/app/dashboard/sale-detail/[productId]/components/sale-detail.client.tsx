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
import { ownershipOptions } from "@/dynamo-db/cars.db";
import { useRouter } from "next/navigation";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useEffect, useState } from "react";
import ImageCarousel from "@/components/ui/image-carousel";
import { Sale } from "@/dynamo-db/sales.db";

interface Props {
  data: Sale;
  images: string[];
}

export default function SaleDetail({ data, images }: Props) {
  const [sale, setSale] = useState<Sale | null>(null);
  const router = useRouter();

  useEffect(() => {
    setSale(data);
  }, [data]);

  if (!sale) return <></>;

  const mainImage =
    sale.mainImageUrl ||
    "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/uploads/1739235783900-D_NQ_NP_2X_698744-MLA82189741523_012025-F.JPEG";

  return (
    <div className="max-w-[1300px] w-[90%] mx-auto p-6">
      <div
        onClick={() => {
          router.push("/dashboard/sales");
        }}
        className="mb-4 cursor-pointer flex items-center"
      >
        <ArrowLeft className="w-4 mr-1" /> Volver
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <CircleArrowRight className="mr-2 text-primary w-6 h-6" />
          Detalles de la venta
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setCommonComponentAtom({
                showEditCarModal: true,
                currentElementId: sale.productId,
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
                currentElementId: sale.productId,
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
            <CarIcon className="mr-2  scale-x-[-1] text-primary w-6 h-6" />
            {sale.brand} {sale.model}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem label="Año" value={sale.year} />
            <DetailItem label="Tipo" value={sale.carType} />
            <DetailItem label="Transmisión" value={sale.transmission} />
            <DetailItem label="Motor" value={sale.engine} />
            <DetailItem label="Tracción" value={sale.traction} />
            <DetailItem label="Kilometraje" value={`${sale.km} km`} />
            <DetailItem label="Estado" value={sale.status} />
            <DetailItem
              label="Precio de venta:"
              value={`${sale.currency} $${
                sale.soldPrice?.toLocaleString("es") || 0
              }`}
              className="text-primary"
            />
            <DetailItem
              label="costos de venta / comisiones totales"
              value={`${sale.currency} $${
                sale.saleCost?.toLocaleString("es") || 0
              }`}
              className="text-red-400"
            />
            <DetailItem
              label="Precio de compra"
              value={`${sale.currency} $${
                sale.buyingPrice?.toLocaleString("es") || 0
              }`}
              className="text-red-400"
            />
            <DetailItem
              label="Ganancia"
              value={`${sale.currency} $${
                sale.buyingPrice?.toLocaleString("es") || 0
              }`}
              className="text-primary"
            />
            <DetailItem
              label="Dueño"
              value={
                ownershipOptions.find((e) => e.value === sale.ownershipType)
                  ?.label || "Sin Especificar"
              }
            />
            <DetailItem
              label="Precio de compra"
              value={`${sale.currency} $${
                sale.buyingPrice?.toLocaleString("es") || 0
              }`}
            />
            {sale.ownerName && (
              <DetailItem label="Nombre del dueño" value={sale.ownerName} />
            )}
            {sale.ownerPhone && (
              <DetailItem label="Telefono del dueño" value={sale.ownerPhone} />
            )}
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-6" />
          <DetailText label="Descripción" value={sale.description} />
          <DetailText label="Notas Internas" value={sale.internalNotes} />
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
