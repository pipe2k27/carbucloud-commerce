"use client";
import { Badge } from "@/components/ui/badge";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const CleanupBadge = ({ showParams }: any) => {
  const router = useRouter();

  const handleClick = () => {
    window.localStorage.removeItem("car-filters");
    setTimeout(() => {
      router.push("/explore/any");
    }, 0);
  };

  if (!showParams) return <></>;
  return (
    <Badge
      variant="secondary"
      className="ml-[-4px] mb-2 cursor-pointer"
      onClick={handleClick}
    >
      Mostrar todos los autos <Trash2Icon className="ml-1 w-3 h-3" />
    </Badge>
  );
};

export default CleanupBadge;
