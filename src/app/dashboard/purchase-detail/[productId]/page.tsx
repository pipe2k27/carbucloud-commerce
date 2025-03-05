import { notFound } from "next/navigation";
import PurchaseDetail from "./components/purchase-detail.client";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import { getPurchaseAction } from "@/service/actions/purchases.actions";

interface Props {
  params: { productId: string };
}

export default async function PurchaseDetailPage({ params }: Props) {
  const { productId } = params;

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
}
