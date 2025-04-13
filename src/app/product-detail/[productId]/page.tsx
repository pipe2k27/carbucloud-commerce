export const dynamic = "force-dynamic";

import { getCarAction } from "@/service/actions/cars.actions";
import { notFound } from "next/navigation";
import ProductDetail from "./components/product-detail.client";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import CarGridBanner from "@/components/Common/car-grid-banner.server";

type Params = Promise<{ productId: string }>;

type Props = {
  params: Params;
};

const ProductDetailPage: React.FC<Props> = async ({ params }) => {
  const pageparams = await params;
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

  return (
    <div className="mb-16">
      <ProductDetail data={response.data} images={images} />
      <CarGridBanner label="También te puede interesar" />
    </div>
  );
};

export default ProductDetailPage;
