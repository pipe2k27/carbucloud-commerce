import { getCarAction } from "@/service/actions/cars.actions";
import { notFound } from "next/navigation";
import ProductDetail from "./components/product-detail.client";

interface Props {
  params: { productId: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = params;

  const response = await getCarAction(productId);

  if (response.status !== 200 || !response.data) {
    return notFound(); // Show 404 if product is not found
  }

  return <ProductDetail car={response.data} />;
}
