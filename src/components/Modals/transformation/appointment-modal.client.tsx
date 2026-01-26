"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  commonComponentAtom,
  resetCommonComponentAtom,
  setCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { z } from "zod";
import Modal from "../modal.client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FormPhone from "@/components/Form/form-phone.client";
import { Car } from "@/dynamo-db/cars.db";
import { Sale } from "@/dynamo-db/sales.db";
import { createAppointmentAction } from "@/service/actions/appointments.actions";
import { formatModelVersion } from "@/utils/carUtils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  addMinutes,
  setHours,
  setMinutes,
  getDay,
  isPast,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Full screen loading overlay
const FullScreenLoading = () => (
  <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center">
    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
    <p className="text-lg font-medium text-foreground">
      Agendando tu visita...
    </p>
    <p className="text-sm text-muted-foreground mt-2">
      Por favor espera un momento
    </p>
  </div>
);

// Full screen success overlay
const FullScreenSuccess = ({
  date,
  time,
  onClose,
}: {
  date: Date;
  time: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6">
    <div className="max-w-md w-full text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
          <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        ¡Cita agendada con éxito!
      </h2>
      <p className="text-muted-foreground mb-6">Tu visita ha sido confirmada</p>
      <div className="bg-muted rounded-lg p-4 mb-8">
        <p className="text-lg font-semibold text-foreground capitalize">
          {format(date, "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </p>
        <p className="text-2xl font-bold text-primary mt-1">{time} hs</p>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Si no podes asistir, por favor comunicate con nosotrs a travez de
        WhatsApp.
      </p>
      <Button onClick={onClose} size="lg" className="w-full">
        <X className="mr-2 h-4 w-4" />
        Cerrar
      </Button>
    </div>
  </div>
);

export const openAppointmentModal = (car: Car | Sale) => {
  setCommonComponentAtom({
    currentCar: car,
    showAppointmentModal: true,
  });
};

const appointmentSchema = z.object({
  clientName: z.string().min(3, "Nombre y apellido requerido"),
  phone: z
    .string()
    .regex(
      /^\+\d{7,15}$/,
      "Número inválido. Debe iniciar con + seguido de dígitos",
    ),
  date: z.date({ required_error: "Selecciona una fecha" }),
  time: z.string({ required_error: "Selecciona un horario" }),
  clientMessage: z.string().max(500).optional(),
});

type FormData = z.infer<typeof appointmentSchema>;

// Generate time slots based on day of week
// Monday-Friday: 10:00 to 18:00 (10am to 6pm)
// Saturday: 10:00 to 13:00 (10am to 1pm)
// Sunday: No slots (disabled in calendar)
function getTimeSlotsForDate(date: Date | undefined): Array<{
  value: string;
  label: string;
}> {
  if (!date) return [];

  const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const slots: Array<{ value: string; label: string }> = [];

  // Sunday (0) - no slots
  if (dayOfWeek === 0) {
    return [];
  }

  // Saturday (6) - 10:00 to 13:00 (inclusive)
  if (dayOfWeek === 6) {
    for (let hour = 10; hour <= 13; hour++) {
      // For 13:00, only add 00, not 30
      const maxMinute = hour === 13 ? 0 : 30;
      for (let minute = 0; minute <= maxMinute; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        slots.push({
          value: `${formattedHour}:${formattedMinute}`,
          label: `${formattedHour}:${formattedMinute}`,
        });
      }
    }
    return slots;
  }

  // Monday-Friday (1-5) - 10:00 to 18:00 (inclusive)
  for (let hour = 10; hour <= 18; hour++) {
    // For 18:00, only add 00, not 30
    const maxMinute = hour === 18 ? 0 : 30;
    for (let minute = 0; minute <= maxMinute; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push({
        value: `${formattedHour}:${formattedMinute}`,
        label: `${formattedHour}:${formattedMinute}`,
      });
    }
  }

  return slots;
}

const AppointmentModal = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    date: Date;
    time: string;
  } | null>(null);
  const { currentCar } = useAtomValue(commonComponentAtom);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
    mode: "onChange",
    defaultValues: {
      clientName: "",
      phone: "",
      clientMessage: "",
    },
  });

  // Watch the selected date to update time slots
  const selectedDate = watch("date");
  const selectedTime = watch("time");

  // Reset form when modal opens with a new car
  useEffect(() => {
    if (currentCar) {
      reset({
        clientName: "",
        phone: "",
        clientMessage: "",
      });
      setSuccessData(null);
    }
  }, [currentCar, reset]);

  // Reset time if selected date changes and current time is not valid for new date
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const timeSlots = getTimeSlotsForDate(selectedDate);
      const isValidTime = timeSlots.some((slot) => slot.value === selectedTime);
      if (!isValidTime) {
        setValue("time", undefined as any, { shouldValidate: false });
      }
    }
  }, [selectedDate, selectedTime, setValue]);

  const handleClose = () => {
    setSuccessData(null);
    resetCommonComponentAtom();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // Parse selected time
      const [hours, minutes] = data.time.split(":").map(Number);

      // Combine date with time
      let dateTimeStart = setHours(data.date, hours);
      dateTimeStart = setMinutes(dateTimeStart, minutes);

      // Add 30 minutes for end time
      const dateTimeEnd = addMinutes(dateTimeStart, 30);

      const appointmentData = {
        clientName: data.clientName,
        phone: data.phone,
        dateTimeStart: dateTimeStart.toISOString(),
        dateTimeEnd: dateTimeEnd.toISOString(),
        date: format(data.date, "yyyy-MM-dd"),
        clientMessage: data.clientMessage || undefined,
        productId: currentCar?.productId,
        productBrand: currentCar?.brand,
        productModel: currentCar?.model
          ? formatModelVersion(currentCar.model, currentCar.version)
          : undefined,
      };

      const response = await createAppointmentAction(appointmentData);

      if (response.status === 200) {
        setSuccessData({ date: data.date, time: data.time });
      } else {
        // Show specific error message (e.g., rate limit message)
        const errorMessage =
          response.message || "No se pudo agendar la cita. Intenta nuevamente.";
        toast({
          variant: "destructive",
          title: response.status === 429 ? "Límite alcanzado" : "Error",
          description: errorMessage,
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("[AppointmentModal] Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo agendar la cita. Intenta nuevamente.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Show full screen loading
  if (loading) {
    return <FullScreenLoading />;
  }

  // Show full screen success
  if (successData) {
    return (
      <FullScreenSuccess
        date={successData.date}
        time={successData.time}
        onClose={handleClose}
      />
    );
  }

  return (
    <Modal
      isOpen
      title="Agendar una visita"
      description={
        currentCar
          ? `Agenda una cita para ver el ${currentCar.brand} ${formatModelVersion(currentCar.model, currentCar.version)}`
          : "Agenda una cita para ver el vehículo"
      }
      footer={
        <Button onClick={handleSubmit(onSubmit)} disabled={!isValid || loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Agendar
          visita
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <Label>Nombre y Apellido</Label>
          <Input
            className="mt-1 text-sm"
            placeholder="Ej: Juan Pérez"
            {...register("clientName")}
          />
          {errors.clientName && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.clientName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <FormPhone
            name="phone"
            control={control}
            label="Tu número de teléfono"
            required={true}
          />
        </div>

        {/* Date */}
        <div>
          <Label>Fecha de la visita</Label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Popover
                open={calendarOpen}
                onOpenChange={setCalendarOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "EEEE d 'de' MMMM, yyyy", {
                        locale: es,
                      })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => {
                      const today = startOfDay(new Date());
                      const dateStart = startOfDay(date);
                      const dayOfWeek = getDay(date);

                      // Disable past dates
                      if (dateStart < today) {
                        return true;
                      }

                      // Disable Sundays (dayOfWeek === 0)
                      if (dayOfWeek === 0) {
                        return true;
                      }

                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.date && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Time */}
        <div>
          <Label>Horario</Label>
          <Controller
            name="time"
            control={control}
            render={({ field }) => {
              const timeSlots = getTimeSlotsForDate(selectedDate);

              return (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedDate || timeSlots.length === 0}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue
                      placeholder={
                        !selectedDate
                          ? "Primero selecciona una fecha"
                          : timeSlots.length === 0
                            ? "No hay horarios disponibles"
                            : "Selecciona un horario"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label} hs
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.time && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.time.message}
            </p>
          )}
          {selectedDate && getTimeSlotsForDate(selectedDate).length === 0 && (
            <p className="text-[11px] text-muted-foreground mt-1">
              No hay horarios disponibles para este día
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <Label>Mensaje (opcional)</Label>
          <Textarea
            className="mt-1 text-sm resize-none"
            placeholder="¿Alguna consulta o comentario adicional?"
            rows={3}
            {...register("clientMessage")}
          />
          {errors.clientMessage && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.clientMessage.message}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentModal;
