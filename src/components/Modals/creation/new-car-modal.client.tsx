"use client";

import { useForm } from "react-hook-form";
import AutomaticForm from "../../Form/automatic-form.client";
import { Button } from "../../ui/button";
import Modal from "../modal.client";
import FormLabel from "../../Form/form-label.client";
import { useState } from "react";
import { resetCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { addOneCarToAtom, editCarByProductId } from "@/jotai/cars-atom.jotai";
import { Car, FormCar } from "@/dynamo-db/cars.db";
import { createCarAction } from "@/service/actions/cars.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StockCarImage } from "@/dynamo-db/product-images.db";

import UploadImage from "@/app/dashboard/_components/upload-image.client";
import {
  carFormdefaultValues,
  carFormFields,
  carSchema,
} from "@/utils/forms/car-form-utils";

const NewCarModal = () => {
  const [section, setCurrentSection] = useState<1 | 2>(1);
  const [currentCarImages, setCurrentCarImages] = useState<
    null | StockCarImage[]
  >(null);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const { control, handleSubmit, watch } = useForm<FormCar>({
    defaultValues: carFormdefaultValues,
    resolver: zodResolver(carSchema), // ✅ Apply Zod validation
  });

  const onSubmit = async (data: FormCar) => {
    const newCar: FormCar = {
      ...data,
      status: "available",
      price: Number(data.price),
      buyingPrice: Number(data.buyingPrice),
      km: Number(data.km),
    };
    try {
      setLoading(true);

      const res = await createCarAction(newCar);
      if (res.status === 200) {
        setCurrentCar(res.data);
        addOneCarToAtom(res.data);
        setCurrentSection(2);
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
    if (section === 1) {
      handleSubmit(onSubmit)();
    } else {
      resetCommonComponentAtom();
    }
  };

  const onDelete = (index: number) => {
    setLoading(true);
    if (!currentCarImages) return;
    const newImages = currentCarImages.filter((_, i) => i !== index);
    setCurrentCarImages([...newImages]);
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const onUpload = (image: StockCarImage) => {
    const newImages = currentCarImages ? [...currentCarImages, image] : [image];
    setCurrentCarImages(newImages);
  };

  const onUploadMain = async (imageUrl: string) => {
    if (!currentCar) return;
    const newCar: Car = { ...currentCar, mainImageUrl: imageUrl };
    setCurrentCar(newCar);
    editCarByProductId(currentCar.productId, {
      mainImageUrl: imageUrl,
    });
  };

  return (
    <Modal
      isOpen
      title="Nuevo Vehiculo"
      description="Complete los campos para agregar un nuevo auto"
      footer={
        <Button onClick={handleNext} disabled={loading} className="mt-4">
          {loading && <Loader2 className="animate-spin" />}
          Siguiente
        </Button>
      }
      className={`max-w-[1200px] ${
        section === 1 ? "w-[80vw]" : "w-[fit-content]"
      } `}
    >
      {section === 1 && (
        <AutomaticForm
          control={control}
          dualColumn
          watch={watch}
          fields={carFormFields}
        />
      )}
      {section === 2 && currentCar && (
        <>
          <div className="my-2">
            <FormLabel label="Imagen Principal:" required />
            <div className="grid-cols-3 grid">
              <UploadImage
                isMainImage
                productId={currentCar.productId}
                currentImage={
                  currentCar?.mainImageUrl
                    ? { imageUrl: currentCar?.mainImageUrl }
                    : undefined
                }
                onUpload={(url: string) => {
                  onUploadMain(url);
                }}
              />
            </div>
          </div>
          <FormLabel label="Imagenes complementarias:" required />
          <div className="text-xs text-gray-500 opacity-45">
            *Hasta 9 imágenes
          </div>
          <div className="grid-cols-3 grid">
            {currentCarImages?.map((image, index) => {
              // if (index > 8) return null;
              return (
                <UploadImage
                  key={image.imageId}
                  onUpload={(im: StockCarImage) => {
                    onUpload(im);
                  }}
                  currentImage={image}
                  productId={currentCar.productId}
                  onImageDelete={() => {
                    onDelete(index);
                  }}
                />
              );
            })}
            <UploadImage
              onUpload={(im: StockCarImage) => {
                onUpload(im);
              }}
              productId={currentCar.productId}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default NewCarModal;
