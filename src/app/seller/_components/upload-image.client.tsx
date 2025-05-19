"use client";

import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { useDropzone } from "react-dropzone";
import Spinner from "@/components/ui/spinner";
import { uploadImageAction } from "@/service/actions/images.actions";
import { updatePurchaseImageAction } from "@/service/actions/purchases.actions";

type UploadImageProps = {
  productId: string;
  onUpload?: (i: any) => void;
};

const UploadImage: React.FC<UploadImageProps> = ({ productId, onUpload }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (resizedFile: File) => {
    try {
      const formData = new FormData();
      formData.append("file", resizedFile);

      const result = await uploadImageAction(formData);

      if (result.status !== 200) {
        setError("Error al cargar la imagen");
        return;
      }

      const res = await updatePurchaseImageAction(
        productId,
        result.data.imageUrl
      );
      if (res?.status === 200) {
        if (onUpload) onUpload(result.data.imageUrl);
      } else {
        setError("Error al cargar la imagen");
      }
      // armar la logica para las imágenes secundarias
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
      1000,
      1000,
      "JPEG",
      90,
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  // Submit the image
  if (isSubmitting) {
    return (
      <div className="max-w-md space-y-4 my-4">
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
    <div className="max-w-md space-y-4 my-4 relative">
      <div
        {...getRootProps()}
        className={`w-[150px] h-[150px] border-2 ${
          isDragActive
            ? "border-blue-500"
            : "border-dashed border-gray-400 opacity-50 hover:opacity-1  hover:border-blue-500"
        } rounded-md flex items-center justify-center cursor-pointer`}
      >
        <input {...getInputProps()} />
        {isSubmitting && (
          <div className="relative inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <Spinner size={24} />
          </div>
        )}

        <p className={`text-xs ${error ? "text-red-400" : "text-gray-500"}`}>
          {error ? error : "Subir una imagen"}
        </p>
      </div>
    </div>
  );
};

export default UploadImage;
