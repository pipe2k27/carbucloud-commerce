/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import ImageCarouselGrid from "./image-carousel-grid.client";
import { Zap } from "lucide-react";

type ImageGridProps = {
  images: string[];
  logoUrl?: string;
};

export default function ImageGrid({ images, logoUrl }: ImageGridProps) {
  const displayedImages = images.slice(1, 5);

  return (
    <div className="flex">
      <ImageCarouselGrid images={images} />

      <div className="grid grid-cols-2 gap-y-[16px] gap-x-[16px] max-w-fit ml-[16px] h-fit">
        {[...Array(4)].map((_, index) => {
          const isTopRight = index === 1;
          const isBottomRight = index === 3;
          const hasImage = index < displayedImages.length;

          return (
            <div
              key={index}
              className={cn(
                "relative aspect-square w-[20vw] max-h-[360px] max-w-[360px] overflow-hidden",
                {
                  "rounded-tr-[1.5rem]": isTopRight,
                  "rounded-br-[1.5rem]": isBottomRight,
                  "bg-muted": !hasImage,
                }
              )}
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
