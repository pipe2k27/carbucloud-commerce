import { getWebElementsByCompanyId } from "@/dynamo-db/web-elements.db";
import AboutUsContent from "./_components/about-content.client";

export default async function AboutUsPage() {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const response = (await getWebElementsByCompanyId(companyId)) as any;

  const webElements =
    response.status === 200 &&
    Array.isArray(response.data) &&
    response.data.length
      ? response.data[0]
      : {};

  return <AboutUsContent webElements={webElements} />;
}
