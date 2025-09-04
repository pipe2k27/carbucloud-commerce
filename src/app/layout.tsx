export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/theme-provider.client";
import Navbar from "@/components/Navbar/navbar.client";
import { CommonComponentsProvider } from "@/components/Providers/common-components-provider.client";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer/footer.client";
import { getWebElementsByCompanyId } from "@/dynamo-db/web-elements.db";
import { isMotos } from "@/utils/isMotos";

export const metadata: Metadata = {
  title: process.env.PAGE_NAME || "Carbucloud Commerce",
  description: "Tu concesionaria en la nube",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companyId = process.env.COMPANY_ID;
  if (!companyId) return <></>;
  const webElements = (await getWebElementsByCompanyId(companyId)) as any;

  const isMotosOnly = isMotos(companyId);

  const logoUrl = process.env.LOGO_URL;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider
          attribute="class"
          forcedTheme={
            webElements?.data[0]?.theme
              ? String(webElements?.data[0]?.theme)
              : "theme-blue-light"
          }
          enableSystem
          disableTransitionOnChange
        >
          <Navbar isMotosOnly={isMotosOnly} logoUrl={logoUrl} />
          <div className="min-h-[83vh]">{children}</div>
          <Toaster />
          <CommonComponentsProvider />
          <Footer logoUrl={logoUrl} webElements={webElements?.data[0]} />
        </ThemeProvider>
      </body>
    </html>
  );
}
