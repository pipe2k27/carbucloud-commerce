"use client";

import React, { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils"; // Ensure you have a utility for conditional class names (optional)

interface HoverImageProps {
  imageUrl: string;
  className?: string; // Accepts any string as a class name
  icon: ReactNode; // Accepts any ReactNode as the icon
}

interface PortalProps {
  children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const rootElement = document.getElementById("__next") || document.body;
  return createPortal(children, rootElement);
};

const PictureIcon: React.FC<HoverImageProps> = ({
  imageUrl,
  icon,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (isHovered) {
      const timeout = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [isHovered]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    setPosition({ x: clientX, y: clientY });
    setIsHovered(true);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={(e) => handleMouseEnter(e)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ensure the provided icon keeps the fixed class */}
      <div className="cursor-pointer text-primary hover:opacity-50">
        {React.cloneElement(icon as React.ReactElement<any>, {
          className: `cursor-pointer text-primary hover:opacity-50 ${className}`,
        })}
      </div>

      {isHovered && (
        <Portal>
          <div
            onMouseEnter={() => setIsHovered(false)}
            style={{
              transition: "all 0.1s ease-in",
              top: position?.y ? position.y - 248 : 100,
              left: position?.x ? position.x - 130 : 100,
              borderWidth: 2,
            }}
            className={cn(
              "fixed z-50 mt-2 w-[220px] h-[220px] rounded-2xl border border-gray-200 bg-gray-200 shadow-lg",
              `${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-[20px] scale-[0.9]"
              } `
            )}
          >
            <Image
              src={imageUrl}
              alt="Car Preview"
              className="rounded-2xl object-cover w-full h-full"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Portal>
      )}
    </div>
  );
};

export default PictureIcon;
