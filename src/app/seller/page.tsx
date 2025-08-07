import { Metadata } from "next";
import SellerFormSelector from "./_components/seller-form-selector.client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: process.env.PAGE_NAME,
    description: "Vendé tu auto",
    openGraph: {
      title: process.env.PAGE_NAME,
      description: "Vendé tu auto",
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

  return <SellerFormSelector logoUrl={logoUrl} />;
};

export default SellerPage;
