/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  currentIndex,
  setCurrentIndex,
  onClose,
}: ImageViewerProps) {
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, setCurrentIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    },
    [handleNext, handlePrev, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Prevent close when clicking on image container */}
      <div
        className="relative max-w-[100vw] max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={32} />
        </button>

        {/* Chevron left */}
        <button
          onClick={handlePrev}
          className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
        >
          <ChevronLeft size={48} />
        </button>

        {/* Image */}
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain mx-auto"
        />

        {/* Chevron right */}
        <button
          onClick={handleNext}
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
        >
          <ChevronRight size={48} />
        </button>
      </div>
    </div>
  );
}
