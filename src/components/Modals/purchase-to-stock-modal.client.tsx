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
  convertPurchaseToStockAction,
  getPurchaseAction,
} from "@/service/actions/purchases.actions";
import { Purchase } from "@/dynamo-db/purchases.db";
import {
  purchaseToStockFormFields,
  purchaseToStockSchema,
} from "./purchase-form-utils";
import { Car } from "@/dynamo-db/cars.db";
import { useRouter } from "next/navigation";
import { deleteOnePurchaseFromAtom } from "@/jotai/purchases-atom.jotai";

type FormData = {
  currency: string;
  price: string;
  buyingPrice: string;
  ownershipType: string;
};

const PurchaseToStockModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentElementId } = useAtomValue(commonComponentAtom);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);

  const { toast } = useToast();

  const router = useRouter();

  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(purchaseToStockSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormData) => {
    if (!currentElementId || !currentPurchase) return;
    const newCar: Car = {
      ...currentPurchase,
      price: Number(data.price),
      buyingPrice: Number(data.buyingPrice),
      ownershipType: data.ownershipType,
      currency: data.currency,
      status: "available",
    };
    try {
      setLoading(true);

      const res = await convertPurchaseToStockAction(newCar);
      if (res.status === 200) {
        deleteOnePurchaseFromAtom(currentElementId);
        setTimeout(() => {
          router.refresh();
        }, 300);
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
        setCurrentPurchase(data);
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
      title="Convertir en vehiculo en stock"
      description="Se moverá a productos en stock y aparecerá en la página web"
      footer={
        <Button onClick={handleNext} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Convertir
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
          watch={watch}
          control={control}
          fields={purchaseToStockFormFields}
        />
      )}
    </Modal>
  );
};

export default PurchaseToStockModal;
