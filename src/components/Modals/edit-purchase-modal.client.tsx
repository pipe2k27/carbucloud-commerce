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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAtomValue } from "jotai";
import { errorToast } from "@/constants/api-constants";
import {
  getPurchaseAction,
  updatePurchaseAction,
} from "@/service/actions/purchases.actions";
import { FormPurchase } from "@/dynamo-db/purchases.db";
import {
  purchaseFormdefaultValues,
  purchasaeFormFields,
  PurchaseSchema,
} from "./purchase-form-utils";
import { editPurchaseByProductId } from "@/jotai/purchases-atom.jotai";

const EditPurchaseModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentElementId } = useAtomValue(commonComponentAtom);

  const { toast } = useToast();

  const { control, handleSubmit, reset, watch } = useForm<FormPurchase>({
    defaultValues: purchaseFormdefaultValues,
    resolver: zodResolver(PurchaseSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormPurchase) => {
    if (!currentElementId) return;
    const newCar: FormPurchase = {
      ...data,
    };
    try {
      setLoading(true);

      const res = await updatePurchaseAction(currentElementId, newCar);
      if (res.status === 200) {
        editPurchaseByProductId(currentElementId, newCar);
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

  const getPurchase = async () => {
    if (!currentElementId) return;
    setLoading(true);
    try {
      const { data } = await getPurchaseAction(currentElementId);
      if (data) {
        const newDefaultValues: FormPurchase = {
          brand: data.brand,
          model: data.model,
          year: data.year,
          currency: data.currency,
          description: data.description,
          km: String(data.km),
          buyingPrice: data.buyingPrice ? String(data.buyingPrice) : "0",
          ownerName: data.ownerName || "",
          ownerPhone: data.ownerPhone || "",
          status: data.status,
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
    getPurchase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentElementId]);

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
          fields={purchasaeFormFields}
        />
      )}
    </Modal>
  );
};

export default EditPurchaseModal;
