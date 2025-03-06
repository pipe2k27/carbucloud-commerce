export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PurchaseDetail from "./components/purchase-detail.client";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import { getPurchaseAction } from "@/service/actions/purchases.actions";

type Params = Promise<{ productId: string }>;

type Props = {
  params: Params;
};

const PurchaseDetailPage: React.FC<Props> = async ({ params }) => {
  const pageparams = await params;
  const { productId } = pageparams;

  const response = await getPurchaseAction(productId);
  const imagesResponse = await getStockImagesByProductIdAction(productId);
  if (response.status !== 200 || !response.data) {
    return notFound(); // Show 404 if product is not found
  }
  if (imagesResponse.status !== 200 || !imagesResponse.data) {
    return notFound(); // Show 404 if product is not found
  }

  const images = imagesResponse.data.map((img: any) => img.imageUrl);

  if (images) return <PurchaseDetail data={response.data} images={images} />;
  return notFound();
};

export default PurchaseDetailPage;
