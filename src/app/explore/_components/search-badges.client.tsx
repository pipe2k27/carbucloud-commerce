"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const processParam = (param?: string) => {
  if (!param) return "";
  if (param === "any") return "";
  return decodeURIComponent(param);
};

export default function SearchBadges({ searchParams }: any) {
  const router = useRouter();

  const handleDelete = (param: string) => {
    const newParams = searchParams.map((p: string) => {
      if (p !== param) return p;
      return "any";
    });
    router.push(`/explore/${newParams.join("/")}`);
  };

  return (
    <div className="mb-8 flex">
      {searchParams.map((param: string, index: number) => {
        const tag = processParam(param);
        if (tag === "") return;
        return (
          <Badge key={tag} className="mr-2 z-10">
            {tag}{" "}
            {index !== 0 && (
              <X
                onClick={() => handleDelete(param)}
                className="w-3 h-3 ml-1 cursor-pointer"
              />
            )}
          </Badge>
        );
      })}
    </div>
  );
}
