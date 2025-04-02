"use client";

import { useForm } from "react-hook-form";
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
import { Car } from "@/dynamo-db/cars.db";
import { useRouter } from "next/navigation";
import {
  convertCarToSaleAction,
  getCarAction,
} from "@/service/actions/cars.actions";
import { Sale } from "@/dynamo-db/sales.db";
import { deleteOneCarFromAtom } from "@/jotai/cars-atom.jotai";
import {
  carToSaleFormFields,
  carToSaleSchema,
} from "@/utils/forms/car-form-utils";
import Modal from "../modal.client";
import { Button } from "@/components/ui/button";
import AutomaticForm from "@/components/Form/automatic-form.client";

type FormData = {
  currency: string;
  soldPrice: string;
  saleCost: string;
  seller: string;
};

const CarToSaleModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { currentElementId } = useAtomValue(commonComponentAtom);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);

  const { toast } = useToast();

  const router = useRouter();

  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(carToSaleSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormData) => {
    if (!currentElementId || !currentCar) return;
    const sale: Partial<Sale> = {
      ...currentCar,
      soldPrice: Number(data.soldPrice),
      saleCost: Number(data.saleCost),
      seller: data.seller,
      currency: data.currency,
      status: "sold",
    };
    try {
      setLoading(true);

      const res = await convertCarToSaleAction(currentCar, sale);
      if (res.status === 200) {
        deleteOneCarFromAtom(currentElementId);
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

  const getCar = async () => {
    if (!currentElementId) return;
    setLoading(true);
    try {
      const { data } = await getCarAction(currentElementId);
      if (data) {
        setCurrentCar(data);
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
      title="Convertir en vehiculo en Venta"
      description="Se moverá a Ventas y desaparecerá de la página web"
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
          fields={carToSaleFormFields}
        />
      )}
    </Modal>
  );
};

export default CarToSaleModal;
