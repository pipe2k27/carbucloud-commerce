"use client";

import { Button } from "@/components/ui/button";
import {
  Car as CarIcon,
  DownloadCloud,
  MessageCircleWarning,
  SearchCheckIcon,
  Bike,
} from "lucide-react";
import { Car } from "@/dynamo-db/cars.db";
import { useEffect, useState } from "react";
import { openWhatsappModal } from "@/components/Modals/transformation/new-contact-modal.client";
import { openAppointmentModal } from "@/components/Modals/transformation/appointment-modal.client";
import ImageGrid from "./image-grid.client";
import SpecCards from "./spec-cards.client";
import CarSpecs from "./car-specs.client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ProductDetailPdf } from "./product-detail-pdf.client";
import ImageViewer from "./image-viewer";
import { Sale } from "@/dynamo-db/sales.db";
import PriceBar from "./price-bar.client";
import { useAtomValue } from "jotai";
import { brandsAtom } from "@/jotai/brands-atom.jotai";
import Image from "next/image";
import { formatModelVersion } from "@/utils/carUtils";

interface Props {
  data: Car | Sale;
  images: string[];
  logoUrl?: string;
  logoWhiteUrl?: string;
  sold?: boolean;
}

export default function ProductDetailDesktop({
  data,
  images,
  logoUrl,
  logoWhiteUrl,
  sold,
}: Props) {
  const [car, setCar] = useState<Car | Sale | null>(null);

  const [currentImages, setCurrentImages] = useState<string[]>();
  const [viewingImageIndex, setViewingImageIndex] = useState<number>(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const carBrands = useAtomValue(brandsAtom);

  const brandLogoPath = car
    ? carBrands.brands.find((brand) => brand.brandName === car.brand)?.logoPath
    : undefined;

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

  const isReserved = car.status === "reserved";

  const openImageViewer = (index: number) => {
    setViewingImageIndex(index);
    setIsImageViewerOpen(true);
  };

  return (
    <>
      {isImageViewerOpen && (
        <ImageViewer
          setCurrentIndex={setViewingImageIndex}
          currentIndex={viewingImageIndex}
          images={currentImages || []}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
      <div className="py-8 mb-24 w-[1050px] relative left-[50%] translate-x-[-50%] max-w-[90vw]">
        <div className="mt-4 mb-8 flex justify-between items-center">
          <div className="flex items-center relative">
            <div className="text-[12px] text-primary font-normal absolute top-[0px] left-[54px] truncate">
              {car.year} - {Number(car.km).toLocaleString("es")}km
            </div>
            <div className="max-w-[35vw] whitespace-nowrap text-lg  xl:text-xl font-bold flex relative">
              <div className="w-[45px] flex-shrink-0">
                {brandLogoPath ? (
                  <Image
                    src={brandLogoPath}
                    alt={`${car.brand} Logo`}
                    width={45}
                    height={45}
                    className="mr-2 rounded-[6px] object-contain relative z-10 shadow-md"
                  />
                ) : (
                  <>
                    {car.vehicleType !== "motorbike" && (
                      <CarIcon className="mr-2  scale-x-[-1] text-primary w-7 h-7 translate-y-[-1px]" />
                    )}
                    {car.vehicleType === "motorbike" && (
                      <Bike className="mr-2  scale-x-[-1] text-primary w-7 h-7 translate-y-[-1px]" />
                    )}
                  </>
                )}
              </div>
              <div className="min-w-0 flex-1 pl-2">
                <div className="translate-y-[16px] truncate w-full xl:max-w-[500px]">
                  {car.brand} {formatModelVersion(car.model, car.version)}
                </div>
              </div>
            </div>
            <div className="font-normal text-md text-muted-foreground translate-y-[2px] align-bottom p-0 ml-0 opacity-60">
              {isReserved && " /Reservado"} {sold && " /Vendido"}
            </div>
          </div>

          <div>
            <Button
              onClick={() => {
                openWhatsappModal(car);
              }}
              className="w-[140px] mr-4"
              variant="secondary"
            >
              Consultar
              <MessageCircleWarning className="ml-[-2px] scale-110" />
            </Button>

            <PDFDownloadLink
              document={
                <ProductDetailPdf
                  car={car}
                  imageBase64={car.mainImageUrl}
                  logoUrl={logoWhiteUrl}
                />
              }
              fileName={`${car.brand}-${formatModelVersion(car.model, car.version)}.pdf`}
            >
              {() => (
                <Button className="w-[140px]">
                  Ficha Tecnica
                  <DownloadCloud className="ml-[-2px] scale-110" />
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div
            className="flex justify-center items-center w-full"
            style={{ opacity: sold ? 0.5 : 1 }}
          >
            {currentImages && (
              <ImageGrid
                logoUrl={logoUrl}
                images={currentImages}
                openImageViewer={openImageViewer}
                isReserved={isReserved}
              />
            )}
          </div>
          <div className="w-full my-8">
            <SpecCards car={car} sold={sold} />
            <div className="text-lg mt-6 font-bold mb-0 flex relative w-full ">
              {/* <div className="w-[45px]">
              <CarIcon className="mr-2  scale-x-[-1] text-primary w-8 h-8 translate-y-[-3px]" />
            </div> */}
              <div className="w-full">
                <div className="lg:max-w-[calc(100%_-_230px)]">
                  {car.brand} {formatModelVersion(car.model, car.version)}
                </div>
              </div>
            </div>
            <CarSpecs car={car} sold={sold} />
            <div className="flex justify-between items-center w-full mt-2">
              <Button
                className="w-[48%]"
                onClick={() => {
                  openAppointmentModal(car);
                }}
              >
                Agendar Visita{" "}
                <SearchCheckIcon size={20} className="ml-[-4px]" />
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
      <PriceBar car={car} sold={sold} />
    </>
  );
}
