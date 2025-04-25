// app/components/Navbar.tsx
"use client";
import { useState } from "react";
import { Cloud, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
// import { ModeToggle } from "../ui/mode-toggle";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <>
      <nav className="flex border-b items-center bg-card justify-between px-6 py-4 z-50 relative shadow-sm">
        {/* Logo */}
        <div
          className="text-lg logo-title flex text-primary font-bold"
          onClick={() => router.push("/")}
        >
          <Cloud className="mr-1" /> CarbuCloud
        </div>

        {/* Desktop Links */}
        <div className="hidden place-items-center md:flex space-x-6">
          <div
            className="hover:text-muted-foreground cursor-pointer"
            onClick={() => {
              router.push("/explore");
            }}
          >
            Explorar
          </div>
          {/* <div className="hover:text-muted-foreground cursor-pointer">
            Vender
          </div> */}
          <div
            className="hover:text-muted-foreground cursor-pointer"
            onClick={() => router.push("/contact")}
          >
            Contacto
          </div>{" "}
          <div
            className="hover:text-muted-foreground cursor-pointer"
            onClick={() => router.push("/about")}
          >
            Nosotros
          </div>
          {/* <div className="">
            <ModeToggle />
          </div> */}
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col mt-4 space-y-4">
              <a
                onClick={() => {
                  router.push("/explore");
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Explorar
              </a>
              <a
                onClick={() => {
                  router.push("/contact");
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Contacto
              </a>
              <a
                onClick={() => {
                  router.push("/about");
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Nosotros
              </a>
              <a
                onClick={() => {
                  router.push("/");
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Home
              </a>
              {/* <div className="">
                <ModeToggle />
              </div> */}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
