"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Car,
  Headset,
  House,
  MessageCircleQuestion,
  PackagePlus,
  Percent,
  PersonStanding,
  TicketSlash,
  TrendingUp,
} from "lucide-react";

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  url?: string;
}

export const sidebarData: SidebarSection[] = [
  {
    // title: "Inventario de Productos",
    items: [
      {
        label: "Compras",
        icon: <PackagePlus />,
        url: "/dashboard/purchases",
      },
      {
        label: "Productos en stock",
        icon: <Car />,
        url: "/dashboard/products",
      },
      {
        label: "Ventas",
        icon: <TrendingUp />,
        url: "/dashboard/sales",
      },
      { label: "Consultas por whatsapp", icon: <MessageCircleQuestion /> },
    ],
  },
  {
    title: "Página Web",
    items: [
      { label: "Elementos Página Principal", icon: <House /> },
      { label: "Elementos Nosotros", icon: <PersonStanding /> },
      { label: "Elementos Contacto", icon: <Headset /> },
      { label: "Ventana Promociones", icon: <Percent /> },
      { label: "Carrusel animado", icon: <TicketSlash /> },
    ],
  },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Wait 200ms after expanding before showing text
  useEffect(() => {
    if (isExpanded) {
      const timeout = setTimeout(() => setShowText(true), 400);
      return () => clearTimeout(timeout);
    } else {
      setShowText(false);
    }
  }, [isExpanded]);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen transition-all duration-300 z-40",
        isExpanded ? "w-[400px]" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "relative h-full shadow-lg transition-colors duration-300 bg-card  pt-[55px] "
        )}
      >
        <div className="py-4">
          {sidebarData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="px-3 py-2">
              {section.title && (
                <div
                  className={cn(
                    "mb-2 px-4 font-semibold racking-tight transition-opacity duration-200 overflow-hidden whitespace-nowrap border-t-[0px] border-muted pt-2",
                    isExpanded && showText ? "opacity-100" : "opacity-0"
                  )}
                >
                  {section.title}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant={item.url === pathname ? "secondary" : "ghost"}
                    className="flex w-full items-center justify-start space-x-2 px-[12px] py-2 transition-all duration-300 hover:bg-muted"
                    // theme === "dark"
                    //   ? "hover:bg-gray-800"
                    //   : "hover:bg-gray-200"

                    onClick={() => {
                      if (item.url) router.push(item.url);
                    }}
                  >
                    <span className="text-primary">{item.icon}</span>
                    {isExpanded && (
                      <span
                        className={cn(
                          "transition-opacity duration-300 overflow-hidden whitespace-nowrap",
                          showText ? "opacity-100" : "opacity-0"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
