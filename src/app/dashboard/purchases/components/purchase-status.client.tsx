"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2Icon,
  ChevronDown,
  HourglassIcon,
  SearchIcon,
  TimerReset,
} from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Purchase, PurchaseStatusType } from "@/dynamo-db/purchases.db";
import { updatePurchaseAction } from "@/service/actions/purchases.actions";
import { editPurchaseByProductId } from "@/jotai/purchases-atom.jotai";

interface StatusBadgeProps {
  status: PurchaseStatusType;
  row: Purchase;
}

const statusConfig: Record<
  PurchaseStatusType,
  { label: string; icon: any; color: string }
> = {
  pending: {
    label: "Pendiente",
    icon: HourglassIcon,
    color: "text-primary",
  },
  rejected: {
    label: "Rechazado",
    icon: TimerReset,
    color: "text-red-500",
  },
  revision: {
    label: "En revisión",
    icon: SearchIcon,
    color: "text-yellow-300",
  },
  buying: {
    label: "Comprando",
    icon: CheckCircle2Icon,
    color: "text-green-500",
  },
};

export const PurchaseStatus: React.FC<StatusBadgeProps> = ({ status, row }) => {
  const [currentStatus, setCurrentStatus] =
    useState<PurchaseStatusType>(status);

  const handleStatusChange = async (newStatus: PurchaseStatusType) => {
    setCurrentStatus(newStatus);
    if (newStatus !== currentStatus) {
      const res = await updatePurchaseAction(row.productId, {
        status: newStatus,
      });
      editPurchaseByProductId(row.productId, { status: newStatus });
      if (res.status !== 200) {
        alert("Error al actualizar el estado de la compra");
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
              onClick={() => handleStatusChange(key as PurchaseStatusType)}
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
