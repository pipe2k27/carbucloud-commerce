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
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ui/mode-toggle";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  const shouldRenderNavbar = pathname !== "/login";

  if (!shouldRenderNavbar) return null;

  return (
    <>
      <nav className="flex items-center bg-card justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-lg logo-title flex text-primary font-bold">
          <Cloud className="mr-1" /> CarbuCloud
        </div>

        {/* Desktop Links */}
        <div className="hidden place-items-center md:flex space-x-6">
          <div onClick={() => signOut()}> Log Out </div>
          <div className="">
            <ModeToggle />
          </div>
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
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log Out / Salir
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
