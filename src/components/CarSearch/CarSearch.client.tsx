"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "../ui/card";
import { SearchCheck, Wand2, X } from "lucide-react";
import Image from "next/image";
import { carBrandsInArgentina } from "@/constants/car-constants";

export const carSearchSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().optional(),
  minYear: z.string().optional(),
});

export type CarSearchSchema = z.infer<typeof carSearchSchema>;

export function CarSearchForm({
  logoUrl,
  showClose,
  onClose,
}: {
  logoUrl?: string;
  showClose?: boolean;
  onClose?: () => void;
}) {
  const { register, handleSubmit, watch, setValue } = useForm<CarSearchSchema>({
    resolver: zodResolver(carSearchSchema),
    defaultValues: {
      brand: "",
      model: "",
      minYear: "",
    },
  });

  const router = useRouter();

  const onSubmit = (data: CarSearchSchema) => {
    const brand = encodeURIComponent(data.brand);
    const model = encodeURIComponent(data.model || "any");
    const minYear = encodeURIComponent(data.minYear || "any");
    router.push(`/explore/${brand}/${model}/${minYear}`);
  };

  const brand = watch("brand");

  return (
    <Card className="mt-12">
      <CardHeader>
        {logoUrl && (
          <div className="w-full flex justify-center  my-4">
            <Image src={logoUrl} alt="Logo" width={200} height={150} />
          </div>
        )}
        <h3 className="my-4 font-semibold text-xl flex w-full justify-start">
          <SearchCheck className="text-primary mr-2" /> Encontrá tu auto ideal
        </h3>
        {showClose && (
          <X
            className="absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              onValueChange={(val) => setValue("brand", val)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                {carBrandsInArgentina.map((brand: string) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}

                {/* Add more brands */}
              </SelectContent>
            </Select>

            <Input placeholder="Modelo" {...register("model")} />

            <Select
              onValueChange={(val) => setValue("minYear", val)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Año desde" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 25 }, (_, i) => {
                  const year = `${2000 + i}`;
                  return (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              disabled={brand === ""}
              type="submit"
              className="w-[440px] max-w-full"
            >
              Buscar <Wand2 />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
