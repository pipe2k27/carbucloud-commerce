import { getWebElementsByCompanyId } from "@/dynamo-db/web-elements.db";
import AboutUsContent from "./_components/about-content.client";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: process.env.PAGE_NAME,
    description: "Tu Concesionaria",
    openGraph: {
      title: process.env.PAGE_NAME,
      description: "Tu Concesionaria",
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

export default async function AboutUsPage() {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const response = (await getWebElementsByCompanyId(companyId)) as any;

  const logoUrl = process.env.LOGO_URL;

  const webElements =
    response.status === 200 &&
    Array.isArray(response.data) &&
    response.data.length
      ? response.data[0]
      : {};

  return <AboutUsContent logoUrl={logoUrl} webElements={webElements} />;
}
