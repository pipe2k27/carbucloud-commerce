"use client";

import { useForm } from "react-hook-form";
import AutomaticForm from "../Form/automatic-form.client";
import { Button } from "../ui/button";
import Modal from "./modal.client";
import { useEffect, useState } from "react";
import {
  commonComponentAtom,
  resetCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import { FormCar } from "@/dynamo-db/cars.db";
import { getCarAction, updateCarAction } from "@/service/actions/cars.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { errorToast } from "@/constants/api-constants";
import {
  carFormdefaultValues,
  carFormFields,
  carSchema,
} from "./car-form-utils";
import { useRouter } from "next/navigation";

const EditCarModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentElementId } = useAtomValue(commonComponentAtom);

  const { toast } = useToast();
  const router = useRouter();

  const { control, handleSubmit, reset, watch } = useForm<FormCar>({
    defaultValues: carFormdefaultValues,
    resolver: zodResolver(carSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormCar) => {
    if (!currentElementId) return;
    const newCar: FormCar = {
      ...data,
      price: Number(data.price),
      km: Number(data.km),
      buyingPrice: Number(data.buyingPrice),
    };
    try {
      setLoading(true);

      const res = await updateCarAction(currentElementId, newCar);
      if (res.status === 200) {
        router.refresh();
        resetCommonComponentAtom();
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description:
            "Ha habido un error de procesamiento, intentelo más tarde.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Ha habido un error de procesamiento, intentelo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    handleSubmit(onSubmit)();
  };

  const getCar = async () => {
    if (!currentElementId) return;
    setLoading(true);
    try {
      const { data } = await getCarAction(currentElementId);
      if (data) {
        const newDefaultValues: FormCar = {
          brand: data.brand,
          model: data.model,
          year: data.year,
          carType: data.carType,
          transmission: data.transmission,
          engine: data.engine,
          currency: data.currency,
          price: String(data.price),
          description: data.description,
          internalNotes: data.internalNotes || "",
          km: String(data.km),
          status: data.status,
          traction: data.traction || "4x2",
          buyingPrice: data.buyingPrice,
          ownershipType: data.ownershipType || "",
          ownerName: data.ownerName || "",
          ownerPhone: data.ownerPhone || "",
        };
        reset(newDefaultValues);
      } else {
        toast(errorToast);
        resetCommonComponentAtom();
      }
    } catch {
      toast(errorToast);
      resetCommonComponentAtom();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentElementId]);

  return (
    <Modal
      isOpen
      title="Editar datos del Vehiculo"
      description="Edite los campos que desee modificar"
      className={`max-w-[1200px] w-[80vw]`}
      footer={
        <Button onClick={handleNext} disabled={loading} className="mt-4">
          {loading && <Loader2 className="animate-spin" />}
          Siguiente
        </Button>
      }
    >
      {loading && (
        <div className="h-[200px] w-full flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {!loading && (
        <AutomaticForm
          dualColumn
          watch={watch}
          control={control}
          fields={carFormFields}
        />
      )}
    </Modal>
  );
};

export default EditCarModal;
