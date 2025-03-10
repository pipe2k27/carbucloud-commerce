"use client";
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
import { usePathname, useRouter } from "next/navigation";

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  variant?: "secondary" | "ghost";
  url?: string;
}

export const sidebarData: SidebarSection[] = [
  {
    title: "Inventario de Productos",
    items: [
      {
        label: "Productos en stock",
        icon: <Car className="mr-2 h-4 w-4" />,
        variant: "secondary",
        url: "/dashboard/products",
      },
      {
        label: "Posibles Compras",
        icon: <PackagePlus className="mr-2 h-4 w-4" />,
        variant: "ghost",
        url: "/dashboard/purchases",
      },
      {
        label: "Consultas por whatsapp",
        icon: <MessageCircleQuestion className="mr-2 h-4 w-4" />,
        variant: "ghost",
      },
      {
        label: "Ventas en el mes",
        icon: <TrendingUp className="mr-2 h-4 w-4" />,
        variant: "ghost",
        url: "/dashboard/sales",
      },
    ],
  },
  {
    title: "Pagina web",
    items: [
      {
        label: "Elementos Pagina Principal",
        icon: <House className="mr-2 h-4 w-4" />,
        variant: "ghost",
      },
      {
        label: "Elementos Nosotros",
        icon: <PersonStanding className="mr-2 h-4 w-4" />,
        variant: "ghost",
      },
      {
        label: "Elementos Contacto",
        icon: <Headset className="mr-2 h-4 w-4" />,
        variant: "ghost",
      },
      {
        label: "Ventana Promociones",
        icon: <Percent className="mr-2 h-4 w-4" />,
        variant: "ghost",
      },
      {
        label: "Carrusel animado",
        icon: <TicketSlash className="mr-2 h-4 w-4" />,
        variant: "ghost",
      },
    ],
  },
];

export function Sidebar() {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 py-4">
        {sidebarData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <Button
                  key={itemIndex}
                  variant={item.url === pathname ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    if (item.url) router.push(item.url);
                  }}
                >
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
