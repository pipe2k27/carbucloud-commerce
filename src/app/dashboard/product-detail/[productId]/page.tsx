import { getCarAction } from "@/service/actions/cars.actions";
import { notFound } from "next/navigation";
import ProductDetail from "./components/product-detail.client";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";

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

  return <ProductDetail data={response.data} images={images} />;
};

export default ProductDetailPage;
