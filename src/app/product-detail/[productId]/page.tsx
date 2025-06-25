import { getCarAction } from "@/service/actions/cars.actions";
import { notFound } from "next/navigation";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import CarGridBanner from "@/components/Common/car-grid-banner.server";
import ProductDetailDesktop from "./components/product-detail-desktop.client";
import ProductDetailMobile from "./components/product-detail-mobile.client";

export const dynamic = "force-dynamic";

interface ProductDetailParams {
  productId: string;
}

interface ProductDetailPageProps {
  params: Promise<ProductDetailParams>;
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
    <div className="mb-16">
      <div className="hidden lg:block">
        <ProductDetailDesktop
          data={response.data}
          images={images}
          logoUrl={logoUrl}
          logoWhiteUrl={logoWhiteUrl}
        />
      </div>
      <div className="lg:hidden">
        <ProductDetailMobile data={response.data} images={images} />
      </div>
      <div className="w-[1050px] mx-auto max-w-[95vw]">
        <CarGridBanner label="También te puede interesar" />
      </div>
    </div>
  );
}
