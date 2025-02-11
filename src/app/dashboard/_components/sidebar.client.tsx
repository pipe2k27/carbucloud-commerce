"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Car,
  Headset,
  House,
  PackagePlus,
  Percent,
  PersonStanding,
  TicketSlash,
  TrendingUp,
} from "lucide-react";

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  variant?: "secondary" | "ghost";
}

export const sidebarData: SidebarSection[] = [
  {
    title: "Inventario de Productos",
    items: [
      {
        label: "Todos los productos",
        icon: <Car className="mr-2 h-4 w-4" />,
        variant: "secondary",
      },
      {
        label: "Agregar o editar productos",
        icon: <PackagePlus className="mr-2 h-4 w-4" />,
        variant: "ghost",
      },
      {
        label: "Estadísticas de productos",
        icon: <TrendingUp className="mr-2 h-4 w-4" />,
        variant: "ghost",
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
                  variant={item.variant || "ghost"}
                  className="w-full justify-start"
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
