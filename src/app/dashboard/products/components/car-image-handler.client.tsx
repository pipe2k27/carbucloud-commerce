"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import { useDropzone } from "react-dropzone";

type UploadImageProps = {
  productId: string;
  onUpload?: (i: any) => void;
  index: number;
};

const UploadImage: React.FC<UploadImageProps> = ({
  productId,
  onUpload,
  index,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image upload and resize
  const handleImageUpload = (file: File) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      "JPEG",
      80,
      0,
      (uri) => {
        const resizedFile = uri as File;
        setOptimizedImage(resizedFile);
        setImagePreview(URL.createObjectURL(resizedFile));
      },
      "file"
    );
  };

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleImageUpload(acceptedFiles[0]);
      if (onUpload) onUpload(index);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  // Submit the image
  const handleSubmit = async () => {
    if (!optimizedImage) {
      alert("Please upload an image before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("image", optimizedImage);

      await axios.post("/update-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 my-4">
      {/* Drag-and-Drop Area */}
      <div
        {...getRootProps()}
        className={`w-[150px] h-[150px] border-2 ${
          isDragActive
            ? "border-blue-500"
            : "border-dashed border-gray-400 opacity-50 hover:opacity-1  hover:border-blue-500"
        } rounded-md flex items-center justify-center cursor-pointer`}
      >
        <input {...getInputProps()} />
        {!imagePreview && (
          <p className="text-xs text-gray-500">
            {isDragActive ? "Drop your image here" : "Drop your image here"}
          </p>
        )}
        {imagePreview && (
          <div className="relative w-full h-full overflow-hidden rounded-md">
            <Image
              src={imagePreview}
              alt="Image Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      {/* <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button> */}
    </div>
  );
};

export default UploadImage;
