"use client";

import { useEffect, useState } from "react";
import { Car, CarStatusType } from "@/dynamo-db/cars.db";
import {
  CheckCircle2Icon,
  CircleDollarSign,
  Clock,
  PauseCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: CarStatusType;
  car: Car;
}

export const statusConfig: Record<
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
    color: "text-yellow-500",
  },
};

export const CarStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const [currentStatus, setCurrentStatus] = useState<CarStatusType>(status);

  const { label, icon: Icon, color } = statusConfig[currentStatus];

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  return (
    <div className={`flex items-center space-x-2 ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
};
