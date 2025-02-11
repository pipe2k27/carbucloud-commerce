"use client";

import { useEffect, useState } from "react";
import { Car, CarStatusType } from "@/dynamo-db/cars.db";
import {
  CheckCircle2Icon,
  ChevronDown,
  CircleDollarSign,
  Clock,
  PauseCircle,
} from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateCarAction } from "@/service/actions/cars.actions";
import { editCarByProductId } from "@/jotai/cars-atom.jotai";

interface StatusBadgeProps {
  status: CarStatusType;
  row: Car;
}

const statusConfig: Record<
  CarStatusType,
  { label: string; icon: any; color: string }
> = {
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

export const CarStatus: React.FC<StatusBadgeProps> = ({ status, row }) => {
  const [currentStatus, setCurrentStatus] = useState<CarStatusType>(status);

  const handleStatusChange = async (newStatus: CarStatusType) => {
    setCurrentStatus(newStatus);
    if (newStatus !== currentStatus) {
      const res = await updateCarAction(row.productId, { status: newStatus });
      editCarByProductId(row.productId, { status: newStatus });
      if (res.status !== 200) {
        alert("Error al actualizar el estado del vehículo");
        setCurrentStatus(currentStatus);
      }
    }
  };

  const { label, icon: Icon, color } = statusConfig[currentStatus];

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  return (
    <DropdownMenu>
      <div className={`flex items-center space-x-2 ${color} cursor-pointer`}>
        <div className="w-[120px] flex items-center">
          <Icon className="w-4 h-4 mr-2" />
          <span className="text-sm font-bold">{label}</span>
        </div>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <ChevronDown className="w-5 text-muted-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="start" className="w-[150px]">
        {Object.entries(statusConfig).map(
          ([key, { label, icon: StatusIcon, color }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleStatusChange(key as CarStatusType)}
              className={`flex items-center gap-2 ${color}`}
            >
              <StatusIcon className="w-4 h-4" />
              {label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
