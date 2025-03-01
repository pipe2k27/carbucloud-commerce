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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { errorToast } from "@/constants/api-constants";
import {
  getPotentialCarPurchaseAction,
  updatePotentialCarPurchaseAction,
} from "@/service/actions/potentialCarPurchase.actions";
import { FormPotentialCarPurchase } from "@/dynamo-db/potentialCarPurchases.db";
import {
  potentialCarFormdefaultValues,
  potentialCarPurchasaeFormFields,
  potentialCarPurchaseSchema,
} from "./potential-car-purchase-form-utils";
import { editPotentialCarByProductId } from "@/jotai/potential-cars-atom.jotai";

const EditPurchaseModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { editingCarId } = useAtomValue(commonComponentAtom);

  const { toast } = useToast();

  const { control, handleSubmit, reset, watch } = useForm<FormCar>({
    defaultValues: potentialCarFormdefaultValues,
    resolver: zodResolver(potentialCarPurchaseSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormPotentialCarPurchase) => {
    if (!editingCarId) return;
    const newCar: FormPotentialCarPurchase = {
      ...data,
    };
    try {
      setLoading(true);

      const res = await updatePotentialCarPurchaseAction(editingCarId, newCar);
      if (res.status === 200) {
        editPotentialCarByProductId(editingCarId, newCar);
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
    if (!editingCarId) return;
    setLoading(true);
    try {
      const { data } = await getPotentialCarPurchaseAction(editingCarId);
      if (data) {
        const newDefaultValues: FormPotentialCarPurchase = {
          brand: data.brand,
          model: data.model,
          year: data.year,
          currency: data.currency,
          description: data.description,
          km: String(data.km),
          buyingPrice: data.buyingPrice ? String(data.buyingPrice) : "0",
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
  }, [editingCarId]);

  return (
    <Modal
      isOpen
      title="Editar datos del Vehiculo"
      description="Edite los campos que desee modificar"
      className={`max-w-[1200px] w-[80vw]`}
      footer={
        <Button onClick={handleNext} disabled={loading}>
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
          fields={potentialCarPurchasaeFormFields}
        />
      )}
    </Modal>
  );
};

export default EditPurchaseModal;
