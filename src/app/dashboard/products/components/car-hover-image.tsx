"use client";

import { useEffect, useState } from "react";
import { Car } from "lucide-react";
// import { Tooltip } from "@/components/ui/tooltip"; // Ensure you have a Tooltip component from ShadCN UI or similar
import { cn } from "@/lib/utils"; // Ensure you have a utility for conditional class names (optional)
import { createPortal } from "react-dom";

interface HoverCarProps {
  imageUrl: string; // URL of the image to display
}

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  // Ensure the root div exists
  const rootElement = document.getElementById("__next") || document.body;

  // Render children into the root element
  return createPortal(children, rootElement);
};

const CarHoverImage: React.FC<HoverCarProps> = ({ imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (isHovered) {
      const timeout = setTimeout(() => setIsVisible(true), 100); // Delay to trigger transition
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
      <Car className="cursor-pointer text-primary hover:opacity-50" />

      {isHovered && (
        <Portal>
          <div
            onMouseEnter={(e) => setIsHovered(false)}
            style={{
              transition: "all 0.1s ease-in",
              top: position?.y ? position.y - 248 : 100, // Offset by 10px below the mouse
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
            <img
              src={imageUrl}
              alt="Car Preview"
              className="rounded-2xl object-cover w-full h-full"
            />
          </div>
        </Portal>
      )}
    </div>
  );
};

export default CarHoverImage;
