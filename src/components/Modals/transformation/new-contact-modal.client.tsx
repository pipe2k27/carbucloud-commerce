"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  commonComponentAtom,
  resetCommonComponentAtom,
  setCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { z } from "zod";
import Modal from "../modal.client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "@/dynamo-db/cars.db";
import { createLeadAction } from "@/service/actions/leads.actions";

export const openWhatsappModal = (car: Car) => {
  setCommonComponentAtom({
    currentCar: car,
    showWhatsappModal: true,
  });
};

const whatsappSchema = z.object({
  fullName: z.string().min(3, "Nombre y apellido requerido"),
  phone: z
    .string()
    .regex(
      /^\+\d{6,15}$/,
      "Número inválido. Debe iniciar con + y no tener espacios ni guiones"
    ),
});

type FormData = z.infer<typeof whatsappSchema>;

const WhatsappModal = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { currentCar } = useAtomValue(commonComponentAtom);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(whatsappSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "+54",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const carData = {
        ...currentCar,
        leadName: data.fullName,
        phone: data.phone,
        status: "new",
      };

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

      // Simulate server-side save
      const lead = await createLeadAction(carData);
      console.log("Lead created:", lead);

      const message = `Hola! Soy ${data.fullName} y me interesa un vehículo. Mi número es ${data.phone}`;
      const encodedMsg = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

      window.open(whatsappURL, "_blank");
      resetCommonComponentAtom();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar la conversación por WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen
      title="Contactarse por WhatsApp"
      description="Ingresá tu nombre y número para iniciar una conversación"
      footer={
        <Button onClick={handleSubmit(onSubmit)} disabled={!isValid || loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Iniciar
          chat
        </Button>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Nombre y Apellido</Label>
          <Input
            className="mt-1 text-sm"
            placeholder="Ej: Juan Pérez"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label>
            Tu número de WhatsApp{" "}
            <span className="text-xs ml-1 text-muted-foreground">
              (sin espacios ni guiones, iniciando con +)
            </span>
          </Label>
          <Input
            className="mt-1 text-sm"
            placeholder="Ej: +541168223455"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WhatsappModal;
