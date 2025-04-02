"use client";

import { Button } from "../../ui/button";
import Modal from "../modal.client";
import FormLabel from "../../Form/form-label.client";
import { useEffect, useState } from "react";
import {
  commonComponentAtom,
  resetCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import { useAtomValue } from "jotai";
import { getCarAction } from "@/service/actions/cars.actions";
import { errorToast } from "@/constants/api-constants";
import { useToast } from "@/hooks/use-toast";
import { Car } from "@/dynamo-db/cars.db";
import { Loader2 } from "lucide-react";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import { StockCarImage } from "@/dynamo-db/product-images.db";
import { editCarByProductId } from "@/jotai/cars-atom.jotai";
import UploadImage from "@/app/dashboard/_components/upload-image.client";
import { useRouter } from "next/navigation";

const EditCarImagesModal = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [currentCarImages, setCurrentCarImages] = useState<
    null | StockCarImage[]
  >(null);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const { toast } = useToast();

  const { currentElementId } = useAtomValue(commonComponentAtom);

  const router = useRouter();

  const getCar = async () => {
    if (!currentElementId) return;
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

  const getCarImages = async () => {
    if (!currentElementId) return;
    try {
      const { data, status } = await getStockImagesByProductIdAction(
        currentElementId
      );
      if (status === 200 && data && data.length > 0) {
        setCurrentCarImages(data);
      } else if (status === 200) {
        setCurrentCarImages([]);
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
    getCarImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentElementId]);

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
    setHasUpdates(true);
    const newImages = currentCarImages ? [...currentCarImages, image] : [image];
    setCurrentCarImages(newImages);
  };

  const onUploadMain = (imageUrl: string) => {
    setHasUpdates(true);
    if (!currentCar) return;
    const newCar: Car = { ...currentCar, mainImageUrl: imageUrl };
    setCurrentCar(newCar);
    editCarByProductId(currentCar.productId, {
      mainImageUrl: imageUrl,
    });
  };

  if (loading || !currentCar || !currentCarImages) {
    return (
      <Modal
        isOpen
        title="Editar Imagenes de la potencial compra"
        description="Agrega o edita las imagenes de la potencial compra"
        footer={
          <Button
            onClick={() => {
              resetCommonComponentAtom();
            }}
          >
            Cerrar
          </Button>
        }
      >
        <div className="h-[200px] w-full flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      title="Editar Imagenes"
      description="Agrega o edita las imagenes del producto"
      onClose={() => {
        if (hasUpdates) {
          router.refresh();
        }
        resetCommonComponentAtom();
      }}
      footer={
        <Button
          onClick={() => {
            if (hasUpdates) {
              router.refresh();
            }
            resetCommonComponentAtom();
          }}
        >
          Cerrar
        </Button>
      }
    >
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
    </Modal>
  );
};

export default EditCarImagesModal;
