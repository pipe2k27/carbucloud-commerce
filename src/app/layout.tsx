import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/theme-provider.client";
import Navbar from "@/components/Navbar/navbar.client";
import { CommonComponentsProvider } from "@/components/Providers/common-components-provider.client";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer/footer.client";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="min-h-[83vh]">{children}</div>
          <Toaster />
          <CommonComponentsProvider />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
