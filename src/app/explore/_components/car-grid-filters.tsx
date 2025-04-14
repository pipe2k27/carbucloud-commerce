"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "@/dynamo-db/cars.db";
import { Wand2 } from "lucide-react";

// Filter form type
type FilterForm = {
  km: number[];
  year: number[];
  status: string[];
  brand: string;
  transmission: string[];
  priceMin: string;
  priceMax: string;
  currency: string;
};

type Props = {
  cars: Car[];
  setFilteredCars: (cars: Car[]) => void;
};

const FILTER_STORAGE_KEY = "car-filters";
const TWO_HOURS = 2 * 60 * 60 * 1000;

export const CarGridFilters = ({ cars, setFilteredCars }: Props) => {
  const { control, watch, setValue, reset, getValues } = useForm<FilterForm>({
    defaultValues: {
      km: [0, 350000],
      year: [1990, new Date().getFullYear()],
      status: [],
      brand: "all",
      transmission: [],
      priceMin: "",
      priceMax: "",
      currency: "none",
    },
  });

  const kmRange = watch("km");
  const yearRange = watch("year");
  const selectedStatuses = watch("status");
  const selectedTransmissions = watch("transmission");
  const brand = watch("brand");
  const priceMin = watch("priceMin");
  const priceMax = watch("priceMax");
  const currency = watch("currency");

  const statuses = useMemo(
    () => Array.from(new Set(cars.map((c) => c.status))),
    [cars]
  );
  const transmissions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.transmission))),
    [cars]
  );
  const brands = useMemo(
    () => Array.from(new Set(cars.map((c) => c.brand))),
    [cars]
  );

  // Load filters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Date.now() - parsed.timestamp < TWO_HOURS) {
        reset(parsed.values);
      } else {
        localStorage.removeItem(FILTER_STORAGE_KEY);
      }
    }
  }, [reset]);

  // Save filters to localStorage when any value changes
  useEffect(() => {
    const values = getValues();
    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify({ values, timestamp: Date.now() })
    );
  }, [
    kmRange,
    yearRange,
    selectedStatuses,
    selectedTransmissions,
    brand,
    priceMin,
    priceMax,
    currency,
    getValues,
  ]);

  useEffect(() => {
    const results = cars.filter((car) => {
      const km = typeof car.km === "string" ? parseInt(car.km) : car.km;
      const year = parseInt(car.year);
      const price =
        typeof car.price === "string" ? parseFloat(car.price) : car.price;

      const matchKm = km >= kmRange[0] && km <= kmRange[1];
      const matchYear = year >= yearRange[0] && year <= yearRange[1];
      const matchStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(car.status);
      const matchTransmission =
        selectedTransmissions.length === 0 ||
        selectedTransmissions.includes(car.transmission);
      let matchBrand = true;
      if (brand !== "all") {
        matchBrand = brand === "" || car.brand === brand;
      }
      let matchPriceMin = true;
      let matchPriceMax = true;
      let matchCurrency = true;

      if (currency === "USD" || currency === "ARS") {
        matchPriceMin = !priceMin || price >= parseFloat(priceMin);
        matchPriceMax = !priceMax || price <= parseFloat(priceMax);
        matchCurrency = car.currency === currency;
      }

      return (
        matchKm &&
        matchYear &&
        matchStatus &&
        matchTransmission &&
        matchBrand &&
        matchPriceMin &&
        matchPriceMax &&
        matchCurrency
      );
    });

    setFilteredCars(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    kmRange,
    yearRange,
    selectedStatuses,
    selectedTransmissions,
    brand,
    priceMin,
    priceMax,
    currency,
    cars,
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Sidebar / Sheet for Filters */}
      <div className="lg:w-72">
        <div className="hidden lg:block space-y-6 border rounded-lg p-4">
          <FiltersPanel
            control={control}
            setValue={setValue}
            watch={watch}
            brands={brands}
            statuses={statuses}
            transmissions={transmissions}
            reset={reset}
          />
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full  max-w-[498px] left-[50%] translate-x-[-50%] relative mb-4"
              >
                Abrir filtros
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85vw] max-w-sm p-4 overflow-auto"
            >
              <FiltersPanel
                control={control}
                setValue={setValue}
                watch={watch}
                brands={brands}
                statuses={statuses}
                transmissions={transmissions}
                reset={reset}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

const FiltersPanel = ({
  control,
  watch,
  setValue,
  brands,
  transmissions,
  reset,
}: any) => {
  const kmRange = watch("km");
  const yearRange = watch("year");
  const currency = watch("currency");

  return (
    <div className="space-y-8">
      {/* Brand */}
      <div>
        <label className="block mb-1 text-sm font-medium">Marca</label>
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(val) => field.onChange(val === "all" ? "" : val)}
              value={field.value || "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las marcas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {brands.map((b: string) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Currency */}
      <div>
        <label className="block mb-1 text-sm font-medium">Moneda</label>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Todas las Monedas</SelectItem>
                <SelectItem value="USD">Dólar estadounidense</SelectItem>
                <SelectItem value="ARS">Peso argentino</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Price */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">
            Precio mínimo
          </label>
          <Controller
            name="priceMin"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={currency === "none" ? "" : field.value}
                disabled={currency === "none"}
                placeholder="Ej. 5000"
              />
            )}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">
            Precio máximo
          </label>
          <Controller
            name="priceMax"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={currency === "none" ? "" : field.value}
                onChange={field.onChange}
                disabled={currency === "none"}
                placeholder="Ej. 20000"
              />
            )}
          />
        </div>
      </div>

      {/* KM */}
      <div>
        <label className="block mb-1 text-sm font-medium">Kilómetros</label>
        <Controller
          name="km"
          control={control}
          render={({ field }) => (
            <Slider
              min={0}
              max={300000}
              step={1000}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {kmRange[0]} km - {kmRange[1]} km
        </div>
      </div>

      {/* Year */}
      <div>
        <label className="block mb-1 text-sm font-medium">Año</label>
        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <Slider
              min={1990}
              max={new Date().getFullYear()}
              step={1}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {yearRange[0]} - {yearRange[1]}
        </div>
      </div>

      {/* Transmissions */}
      <div>
        <label className="block mb-1 text-sm font-medium">Transmisión</label>
        <div className="flex flex-wrap gap-2">
          {transmissions.map((t: string) => (
            <Badge
              key={t}
              onClick={() => {
                const current = watch("transmission");
                const isSelected = current.includes(t);
                setValue(
                  "transmission",
                  isSelected
                    ? current.filter((s: string) => s !== t)
                    : [...current, t]
                );
              }}
              variant={
                watch("transmission").includes(t) ? "default" : "outline"
              }
              className="cursor-pointer"
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          localStorage.removeItem(FILTER_STORAGE_KEY);
          reset({
            km: [0, 350000],
            year: [1990, new Date().getFullYear()],
            status: [],
            brand: "all",
            transmission: [],
            priceMin: "",
            priceMax: "",
            currency: "none",
          });
        }}
      >
        Limpiar Filtros <Wand2 />
      </Button>
    </div>
  );
};
