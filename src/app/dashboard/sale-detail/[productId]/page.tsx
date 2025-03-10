export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import SaleDetail from "./components/sale-detail.client";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import { getSaleAction } from "@/service/actions/sales.actions";

type Params = Promise<{ productId: string }>;

type Props = {
  params: Params;
};

const SaleDetailPage: React.FC<Props> = async ({ params }) => {
  const pageparams = await params;
  const { productId } = pageparams;

  const response = await getSaleAction(productId);
  const imagesResponse = await getStockImagesByProductIdAction(productId);

  if (response.status !== 200 || !response.data) {
    return notFound(); // Show 404 if product is not found
  }

  if (imagesResponse.status !== 200 || !imagesResponse.data) {
    return notFound(); // Show 404 if product images are not found
  }

  const images = imagesResponse.data.map((img: any) => img.imageUrl);

  return <SaleDetail data={response.data} images={images} />;
};

export default SaleDetailPage;
