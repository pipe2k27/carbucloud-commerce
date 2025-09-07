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
import FormPhone from "@/components/Form/form-phone.client";
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
      /^\+549\d{6,10}$/,
      "Número inválido. Debe iniciar con +549 seguido de 6 a 10 dígitos"
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
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(whatsappSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "+549",
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
      const lead = createLeadAction(carData);
      console.log("Lead created:", lead);

      const message = `Hola, soy ${data.fullName} y vi el vehículo ${currentCar?.brand} ${currentCar?.model} ${currentCar?.year} en tu PÁGINA WEB. Te quería hacer la siguiente consulta:`;
      const encodedMsg = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

      // iOS Safari may block window.open with "_blank" unless triggered directly by user gesture.
      // Fallback: set location.href if window.open returns null (popup blocked or iOS Safari)
      const newWindow = window.open(whatsappURL, "_blank");
      if (!newWindow) {
        window.location.href = whatsappURL;
      }
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
          <FormPhone
            name="phone"
            control={control}
            label="Tu número de WhatsApp"
            required={true}
            defaultValue="+549"
          />
        </div>
      </div>
    </Modal>
  );
};

export default WhatsappModal;
