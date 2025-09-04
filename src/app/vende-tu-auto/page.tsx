import { Metadata } from "next";
import SellerFormSelector from "./_components/seller-form-selector.client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: process.env.PAGE_NAME,
    description: "Vendé tu Vehículo",
    openGraph: {
      title: process.env.PAGE_NAME,
      description: "Vendé tu Vehículo",
      url: ``,
      images: [
        {
          url: process.env.LOGO_JPEG || "",
          width: 1200,
          height: 630,
          alt: process.env.PAGE_NAME,
        },
      ],
    },
  };
}
const SellerPage = () => {
  const logoUrl = process.env.LOGO_URL;
  const companyId = process.env.COMPANY_ID;

  return <SellerFormSelector logoUrl={logoUrl} companyId={companyId} />;
};

export default SellerPage;
