import { getCarAction } from "@/service/actions/cars.actions";
import { notFound } from "next/navigation";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import CarGridBanner from "@/components/Common/car-grid-banner.server";
import ProductDetailDesktop from "./components/product-detail-desktop.client";
import ProductDetailMobile from "./components/product-detail-mobile.client";
import { Car } from "@/dynamo-db/cars.db";
import { Metadata } from "next";
import { formatModelVersion } from "@/utils/carUtils";

export const dynamic = "force-dynamic";

interface ProductDetailParams {
  productId: string;
}

interface ProductDetailPageProps {
  params: Promise<ProductDetailParams>;
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { productId } = await params;

  const res = await getCarAction(productId);

  if (!res || res.status !== 200 || !res.data) {
    return {
      title: "Vehiculo no encontrado",
      description: "Este Vehiculo no existe o fue removido.",
    };
  }

  const car = res.data as Car;

  return {
    title: `${car.brand} - ${formatModelVersion(car.model, car.version)} - ${car.year}`,
    description: "Vehiculo Usado en impecable estado",
    openGraph: {
      title: `${car.brand} - ${formatModelVersion(car.model, car.version)} - ${car.year}`,
      description: "Vehiculo Usado en impecable estado",
      url: `https://carbucloud.com`,
      images: [
        {
          url: car.mainImageUrl || "",
          width: 1200,
          height: 630,
          alt: car.brand,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productId } = await params;

  const response = await getCarAction(productId);
  const imagesResponse = await getStockImagesByProductIdAction(productId);

  if (response.status !== 200 || !response.data) {
    return notFound();
  }

  if (imagesResponse.status !== 200 || !imagesResponse.data) {
    return notFound();
  }

  const images = imagesResponse.data.map((img: any) => img.imageUrl);
  const logoUrl = process.env.LOGO_URL;
  const logoWhiteUrl = process.env.LOGO_JPEG;

  return (
    <div className="mb-24">
      <div className="hidden lg:block">
        <ProductDetailDesktop
          data={response.data}
          images={images}
          logoUrl={logoUrl}
          logoWhiteUrl={logoWhiteUrl}
        />
      </div>
      <div className="lg:hidden">
        <ProductDetailMobile
          data={response.data}
          images={images}
          logoWhiteUrl={logoWhiteUrl}
        />
      </div>
      <div className="w-[1050px] mx-auto max-w-[95vw]">
        <CarGridBanner label="También te puede interesar" />
      </div>
    </div>
  );
}
