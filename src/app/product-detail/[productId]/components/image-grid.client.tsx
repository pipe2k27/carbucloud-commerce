/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageCarouselGrid from "./image-carousel-grid.client";
import { Zap } from "lucide-react";

type ImageGridProps = {
  images: string[];
  logoUrl?: string;
  openImageViewer: (index: number) => void;
};

export default function ImageGrid({
  images,
  logoUrl,
  openImageViewer,
}: ImageGridProps) {
  const displayedImages = images.slice(1, 5);

  return (
    <div className="flex">
      <ImageCarouselGrid images={images} openImageViewer={openImageViewer} />

      <div className="grid grid-cols-2 gap-y-[16px] gap-x-[16px] max-w-fit ml-[16px] h-fit">
        {[...Array(4)].map((_, index) => {
          const isTopRight = index === 1;
          const isBottomRight = index === 3;
          const hasImage = index < displayedImages.length;

          return (
            <div
              key={index}
              className={cn(
                " cursor-pointer hover:scale-[0.995] relative h-[20vw] w-[22vw] max-h-[210px] max-w-[252px] overflow-hidden",
                {
                  "rounded-tr-[1.5rem]": isTopRight,
                  "rounded-br-[1.5rem]": isBottomRight,
                  "bg-muted": !hasImage,
                }
              )}
              onClick={() => {
                if (hasImage) openImageViewer(index + 1);
              }}
            >
              {hasImage && (
                <Image
                  src={displayedImages[index]}
                  alt={`Car image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
              )}
              {!hasImage && (
                <div className="flex items-center justify-center h-full">
                  <span className="text-muted-foreground">
                    {logoUrl && (
                      <img
                        className="w-24 grayscale opacity-20"
                        src={logoUrl}
                        alt="Logo"
                      />
                    )}
                    {!logoUrl && (
                      <Zap className="w-12 h-12 text-muted-foreground opacity-25" />
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
