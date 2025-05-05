"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  images: string[];
}

export default function ImageCarousel({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = backward
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleThumbnails = 5;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const swipeThreshold = 50;

  const updateIndex = (newIndex: number) => {
    if (newIndex > selectedIndex) setDirection(1);
    else if (newIndex < selectedIndex) setDirection(-1);
    setSelectedIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchEndX.current - touchStartX.current;

    if (deltaX > swipeThreshold && selectedIndex > 0) {
      setDirection(-1);
      setSelectedIndex((prev) => prev - 1);
    } else if (deltaX < -swipeThreshold && selectedIndex < images.length - 1) {
      setDirection(1);
      setSelectedIndex((prev) => prev + 1);
    }
  };

  const handlePrevThumbs = () => {
    if (scrollIndex > 0) setScrollIndex((prev) => prev - 1);
  };

  const handleNextThumbs = () => {
    if (scrollIndex < images.length - visibleThumbnails)
      setScrollIndex((prev) => prev + 1);
  };

  return (
    <CardContent className="pt-6 flex flex-col items-center">
      {/* Main Image with directional animation */}
      <div
        className="relative w-[550px] h-[550px] max-w-[88vw] max-h-[88vw] lg:max-w-[46vw] lg:max-h-[46vw] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[selectedIndex]}
              alt={`Image ${selectedIndex + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative flex items-center mt-4 w-[300px] max-w-[100vw]">
          {/* Left arrow */}
          <button
            onClick={handlePrevThumbs}
            disabled={scrollIndex === 0}
            className="absolute -left-4 z-10 p-2 disabled:opacity-10 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2 overflow-hidden mx-6">
            {images
              .slice(scrollIndex, scrollIndex + visibleThumbnails)
              .map((img, index) => {
                const realIndex = scrollIndex + index;
                return (
                  <div
                    key={realIndex}
                    className={`relative w-[50px] h-[50px] cursor-pointer border-2 ${
                      selectedIndex === realIndex
                        ? "border-primary"
                        : "border-transparent"
                    } rounded-md`}
                    onClick={() => updateIndex(realIndex)}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${realIndex}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                );
              })}
          </div>

          {/* Right arrow */}
          <button
            onClick={handleNextThumbs}
            disabled={scrollIndex >= images.length - visibleThumbnails}
            className="absolute -right-4 z-10 p-2 disabled:opacity-10 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}
    </CardContent>
  );
}
