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
import { useRouter } from "next/navigation";
import { setCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useEffect, useState } from "react";
import ImageCarousel from "@/components/ui/image-carousel";
import { Purchase } from "@/dynamo-db/purchases.db";
import { dateStringToddmmyyyy } from "@/utils/dateUtils";
import { statusConfig } from "@/app/dashboard/purchases/components/purchase-status.client";

interface Props {
  data: Purchase;
  images: string[];
}

export default function PurchaseDetail({ data, images }: Props) {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const router = useRouter();

  const [currentImages, setCurrentImages] = useState<string[]>();

  useEffect(() => {
    setPurchase(data);
    const mainImage =
      data.mainImageUrl ||
      "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/uploads/1739235783900-D_NQ_NP_2X_698744-MLA82189741523_012025-F.JPEG";
    const newImages = [mainImage, ...images];
    setTimeout(() => {
      setCurrentImages([...newImages]);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!purchase) return <></>;

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
          Detalles de la Compra
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setCommonComponentAtom({
                showEditPurchaseModal: true,
                currentElementId: purchase.productId,
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
                showEditPurchaseImages: true,
                currentElementId: purchase.productId,
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
            {purchase.brand} {purchase.model}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem label="Año" value={purchase.year} />
            <DetailItem label="Tipo" value={purchase.carType} />
            <DetailItem label="Transmisión" value={purchase.transmission} />
            <DetailItem label="Motor" value={purchase.engine} />
            <DetailItem label="Tracción" value={purchase.traction} />
            <DetailItem label="Kilometraje" value={`${purchase.km} km`} />
            <DetailItem label="Estado" value={purchase.status} />
            <DetailItem
              label="Fecha de Ingreso:"
              value={dateStringToddmmyyyy(String(purchase.createdAt))}
              className="text-muted-foreground"
            />
            <DetailItem
              icon={statusConfig[purchase.status]?.icon}
              label="Estado"
              value={statusConfig[purchase.status]?.label}
              className={
                statusConfig[purchase.status]?.color || "text-gray-500"
              }
            />
            <DetailItem
              label="Teléfono del Dueño"
              value={purchase.ownerPhone}
            />
            <DetailItem
              className="text-primary"
              label="Precio de compra"
              value={`${purchase.currency} $${
                purchase.buyingPrice?.toLocaleString("es") || 0
              }`}
            />
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-6" />
          <DetailText label="Descripción" value={purchase.description} />
          <DetailText label="Notas Internas" value={purchase.internalNotes} />
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
