"use client";

import { useState } from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
}

export default function ImageCarousel({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // State for scrolling thumbnails
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleThumbnails = 5; // Number of thumbnails shown at once

  const handlePrev = () => {
    if (scrollIndex > 0) setScrollIndex(scrollIndex - 1);
  };

  const handleNext = () => {
    if (scrollIndex < images.length - visibleThumbnails)
      setScrollIndex(scrollIndex + 1);
  };

  return (
    <CardContent className="pt-6 flex flex-col items-center">
      {/* Main Image */}
      {selectedImage && (
        <div className="relative w-[550px] h-[550px] max-w-[88vw] max-h-[88vw] lg:max-w-[46vw] lg:max-h-[46vw]">
          <Image
            src={selectedImage}
            alt="Selected Product Image"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Thumbnails with Navigation */}
      {images.length > 1 && (
        <div className="relative flex items-center mt-4 w-[300px] max-w-[100vw]">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            className="absolute -left-4 z-10 p-2 disabled:opacity-10  hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-hidden mx-6">
            {images
              .slice(scrollIndex, scrollIndex + visibleThumbnails)
              .map((img, index) => (
                <div
                  key={index}
                  className={`relative w-[50px] h-[50px] cursor-pointer border-2 ${
                    selectedImage === img
                      ? "border-primary"
                      : "border-transparent"
                  } rounded-md`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={scrollIndex >= images.length - visibleThumbnails}
            className="absolute -right-4 z-10 p-2   disabled:opacity-10 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}
    </CardContent>
  );
}
