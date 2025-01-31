"use client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Car,
  MoreHorizontal,
  PauseCircle,
  Clock,
  CircleDollarSign,
  CheckCircle2Icon,
  ChevronDown,
} from "lucide-react";
import CarHoverImage from "./car-hover-image";
import {} from "lucide-react";
import { useAtomValue } from "jotai";
import { carsAtom } from "@/jotai/cars-atom.jotai";

// Define the data type for the used cars
export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: "Automatica" | "Manual";
  type: "SUV" | "Sedan" | "Pick-Up" | "Hatchback" | "Coupe";
  price: number;
  imageUrl: string;
  status?: CarStatusType;
};

export type CarStatusType = "available" | "reserved" | "sold" | "paused";

interface StatusBadgeProps {
  status: CarStatusType;
}

const statusConfig = {
  available: {
    label: "Disponible",
    icon: CheckCircle2Icon,
    color: "text-primary",
  },
  reserved: {
    label: "Reservado",
    icon: Clock,
    color: "text-gray-500",
  },
  sold: {
    label: "Vendido",
    icon: CircleDollarSign,
    color: "text-green-500",
  },
  paused: {
    label: "Pausado",
    icon: PauseCircle,
    color: "text-muted",
  },
};

const CarStatus: React.FC<StatusBadgeProps> = ({ status }) => {
  const data = statusConfig[status] || statusConfig["available"];

  const { label, icon: Icon, color } = data;

  return (
    <div className={`flex items-center space-x-2 ${color}`}>
      <div className="w-[100px] flex items-center">
        <Icon className="w-4 h-4 mr-1" />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <ChevronDown className="cursor-pointer w-5 text-muted-foreground" />
    </div>
  );
};

// Define the column definitions for the used cars table
export const columns: ColumnDef<Car>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
    cell: ({ getValue }) => (
      <div className="flex gap-2 items-center">
        <CarHoverImage imageUrl="https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp" />
        {getValue() as string}
      </div>
    ),
    size: 15, // 20% of the table width
  },
  {
    accessorKey: "model",
    header: "Modelo",
    size: 15, // 15% of the table width
  },
  {
    accessorKey: "year",
    header: "Año",
    size: 5, // 10% of the table width
  },
  {
    accessorKey: "status",
    header: "Estado",
    size: 15, // 15% of the table width
    cell: ({ getValue }) => {
      return <CarStatus status={getValue() as CarStatusType} />;
    },
  },
  {
    accessorKey: "km",
    header: "KM",
    size: 10, // 15% of the table width
    cell: ({ getValue }) => (
      <div>{(getValue() as number)?.toLocaleString()} KM</div>
    ),
  },
  {
    accessorKey: "transmission",
    header: "Transmisión",
    size: 10, // 15% of the table width
  },
  {
    accessorKey: "type",
    header: "Tipo",
    size: 10, // 15% of the table width
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ getValue }) => (
      <div className="text-primary font-semibold">
        U$D {(getValue() as number)?.toLocaleString()}
      </div>
    ), // Format price with commas
    size: 10, // 15% of the table width
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex w-full justify-center gap-2">
        {/* <Plus className="cursor-pointer text-primary w-4" />
        <ShoppingBag className="cursor-pointer text-primary w-4" />{" "}
        <Wand2Icon className="cursor-pointer text-primary w-4" />
        <Trash2 className="cursor-pointer text-red-300 w-4" /> */}
        <MoreHorizontal className="cursor-pointer w-5" />
      </div>
    ),
    size: 4, // 10% of the table width
  },
];

// Mock data for 20 cars

// Component to render the table
export default function CarsTable() {
  const { filteredCars } = useAtomValue(carsAtom);
  return (
    <div className="container py-10" suppressHydrationWarning>
      <DataTable columns={columns} data={filteredCars} />
    </div>
  );
}
