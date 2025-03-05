"use client";

import { Button } from "../ui/button";
import Modal from "./modal.client";
import FormLabel from "../Form/form-label.client";
import { useEffect, useState } from "react";
import {
  commonComponentAtom,
  resetCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import { useAtomValue } from "jotai";
import { errorToast } from "@/constants/api-constants";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getStockImagesByProductIdAction } from "@/service/actions/images.actions";
import { StockCarImage } from "@/dynamo-db/product-images.db";
import UploadImage from "@/app/dashboard/_components/upload-image.client";
import { useRouter } from "next/navigation";
import { getPurchaseAction } from "@/service/actions/purchases.actions";
import { Purchase } from "@/dynamo-db/purchases.db";

const EditPurchaseImagesModal = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [currentPurchaseImages, setCurrentPurchaseImages] = useState<
    null | StockCarImage[]
  >(null);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const { toast } = useToast();

  const { currentElementId } = useAtomValue(commonComponentAtom);

  const router = useRouter();

  const getPurchase = async () => {
    if (!currentElementId) return;
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

  const getPurchaseImages = async () => {
    if (!currentElementId) return;
    try {
      const { data, status } = await getStockImagesByProductIdAction(
        currentElementId
      );
      if (status === 200 && data && data.length > 0) {
        setCurrentPurchaseImages(data);
      } else if (status === 200) {
        setCurrentPurchaseImages([]);
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
    getPurchaseImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentElementId]);

  const onDelete = (index: number) => {
    setLoading(true);
    if (!currentPurchaseImages) return;
    const newImages = currentPurchaseImages.filter((_, i) => i !== index);
    setCurrentPurchaseImages([...newImages]);
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const onUpload = (image: StockCarImage) => {
    setHasUpdates(true);
    const newImages = currentPurchaseImages
      ? [...currentPurchaseImages, image]
      : [image];
    setCurrentPurchaseImages(newImages);
  };

  const onUploadMain = (imageUrl: string) => {
    setHasUpdates(true);
    if (!currentPurchase) return;
    const newPurchase: Purchase = {
      ...currentPurchase,
      mainImageUrl: imageUrl,
    };
    setCurrentPurchase(newPurchase);
  };

  if (loading || !currentPurchase || !currentPurchaseImages) {
    return (
      <Modal
        isOpen
        title="Editar Imagenes"
        description="Agrega o edita las imagenes del producto"
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
              isMainPurchaseImage
              productId={currentPurchase.productId}
              currentImage={
                currentPurchase?.mainImageUrl
                  ? { imageUrl: currentPurchase?.mainImageUrl }
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
          {currentPurchaseImages?.map((image, index) => {
            // if (index > 8) return null;
            return (
              <UploadImage
                key={image.imageId}
                onUpload={(im: StockCarImage) => {
                  onUpload(im);
                }}
                currentImage={image}
                productId={currentPurchase.productId}
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
            productId={currentPurchase.productId}
          />
        </div>
      </>
    </Modal>
  );
};

export default EditPurchaseImagesModal;
