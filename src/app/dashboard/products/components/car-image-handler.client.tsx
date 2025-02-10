"use client";

import { useState } from "react";
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import { useDropzone } from "react-dropzone";
import Spinner from "@/components/ui/spinner";
import {
  createStockIamgeAction,
  deleteStockImageByIdAction,
  uploadImageAction,
} from "@/service/actions/images.actions";
import { updateCarImageAction } from "@/service/actions/cars.actions";
import { RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockCarImage } from "@/dynamo-db/product-images.db";

type UploadImageProps = {
  productId: string;
  onUpload?: (i: any) => void;
  isMainImage?: boolean;
  onImageDelete?: () => void;
  currentImage?: Partial<StockCarImage>;
};

const UploadImage: React.FC<UploadImageProps> = ({
  productId,
  onUpload,
  isMainImage,
  onImageDelete,
  currentImage,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (resizedFile: File) => {
    try {
      const formData = new FormData();
      formData.append("file", resizedFile);

      const result = await uploadImageAction(formData);

      if (result.status !== 200) {
        setError("Error al cargar la imagen");
      } else {
        if (isMainImage) {
          const res = await updateCarImageAction(
            productId,
            result.data.imageUrl
          );
          if (res?.status === 200) {
            if (onUpload) onUpload(result.data.imageUrl);
          } else {
            setError("Error al cargar la imagen");
          }
        }

        if (!isMainImage) {
          const res = await createStockIamgeAction({
            productId,
            imageUrl: result.data.imageUrl,
          });
          if (res?.status === 200) {
            if (onUpload) onUpload(res.data);
          } else {
            setError("Error al cargar la imagen");
          }
        }

        // armar la logica para las imagenes secundarias
      }
    } catch {
      setError("Error al cargar la imagen");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload and resize
  const handleImageUpload = (file: File) => {
    Resizer.imageFileResizer(
      file,
      800,
      800,
      "JPEG",
      80,
      0,
      (uri) => {
        setIsSubmitting(true);
        const resizedFile = uri as File;

        // setImagePreview(URL.createObjectURL(resizedFile));
        handleSubmit(resizedFile);
      },
      "file"
    );
  };

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleImageUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const deleteImage = async () => {
    try {
      const imageId = currentImage?.imageId;
      if (productId && imageId) {
        setIsSubmitting(true);
        const res = await deleteStockImageByIdAction(productId, imageId);
        if (res?.status === 200 && onImageDelete) {
          onImageDelete();
        }
      }
    } catch {
      setError("Error al eliminar la imagen");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit the image
  if (isSubmitting) {
    return (
      <div className="max-w-md mx-auto space-y-4 my-4">
        <div
          className={`w-[150px] h-[150px] border-2 ${"border-dashed border-gray-400 opacity-50 hover:opacity-1  hover:border-blue-500"} rounded-md flex items-center justify-center cursor-pointer`}
        >
          <div className="relative inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <Spinner size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 my-4 relative">
      <div
        {...getRootProps()}
        className={`w-[150px] h-[150px] border-2 ${
          isDragActive
            ? "border-blue-500"
            : "border-dashed border-gray-400 opacity-50 hover:opacity-1  hover:border-blue-500"
        } rounded-md flex items-center justify-center cursor-pointer`}
      >
        <input {...getInputProps()} disabled={!isMainImage && !!currentImage} />
        {isSubmitting && (
          <div className="relative inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <Spinner size={24} />
          </div>
        )}
        {!currentImage?.imageUrl && (
          <p className={`text-xs ${error ? "text-red-400" : "text-gray-500"}`}>
            {error ? error : "Subir una imagen"}
          </p>
        )}
        {!isSubmitting && currentImage?.imageUrl && (
          <div className="relative w-full h-full overflow-hidden rounded-md">
            <Image
              src={currentImage?.imageUrl}
              alt="Image Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
      {currentImage?.imageUrl && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-1 right-1"
          onClick={isMainImage ? () => open() : () => deleteImage()}
        >
          {isMainImage ? <RefreshCcw /> : <Trash2 className="text-red-200" />}
        </Button>
      )}
    </div>
  );
};

export default UploadImage;
