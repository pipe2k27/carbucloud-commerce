export const dynamic = "force-dynamic";

import { getCarAction } from "@/service/actions/cars.actions";
import { notFound } from "next/navigation";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import CarGridBanner from "@/components/Common/car-grid-banner.server";
import ProductDetailDesktop from "./components/product-detail-desktop.client";
import ProductDetailMobile from "./components/product-detail-mobile.client";

type Params = { productId: string };

type Props = {
  params: Params;
};

const ProductDetailPage: React.FC<Props> = async ({ params }) => {
  const pageparams = params;
  const { productId } = pageparams;

  const response = await getCarAction(productId);
  const imagesResponse = await getStockImagesByProductIdAction(productId);

  if (response.status !== 200 || !response.data) {
    return notFound(); // Show 404 if product is not found
  }

  if (imagesResponse.status !== 200 || !imagesResponse.data) {
    return notFound(); // Show 404 if product images are not found
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
};

export default ProductDetailPage;
