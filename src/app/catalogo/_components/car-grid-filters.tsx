"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "@/dynamo-db/cars.db";
import {
  BadgeDollarSign,
  CheckCircle,
  SearchCheck,
  ShoppingBag,
  Wand2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useSellerWord,
  useSellerWordCapitalized,
} from "@/jotai/seller-type-atom.jotai";
import { capitalize } from "@/utils/capitalize";
import { noSalesCompanies } from "@/constants/car-constants";

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
  vehicleType: string;
};

type Props = {
  cars: Car[];
  setFilteredCars: (cars: Car[]) => void;
  setShowSearchForm: any;
  companyId: string;
};

const FILTER_STORAGE_KEY = "car-filters";
const TWO_HOURS = 2 * 60 * 60 * 1000;

export const CarGridFilters = ({
  cars,
  setFilteredCars,
  setShowSearchForm,
  companyId,
}: Props) => {
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
      vehicleType: "todos",
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
  const vehicleType = watch("vehicleType");

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
    vehicleType,
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

      let matchVehicleType = true;
      if (vehicleType !== "todos") {
        if (vehicleType === "autos") {
          matchVehicleType =
            car.vehicleType === "car" || car.vehicleType === undefined;
        } else if (vehicleType === "motos") {
          matchVehicleType = car.vehicleType === "motorbike";
        }
      }

      return (
        matchKm &&
        matchYear &&
        matchStatus &&
        matchTransmission &&
        matchBrand &&
        matchPriceMin &&
        matchPriceMax &&
        matchCurrency &&
        matchVehicleType
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
    vehicleType,
    cars,
  ]);

  const sellerWordCapitalized = useSellerWordCapitalized();

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
            setShowSearchForm={setShowSearchForm}
            companyId={companyId}
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
              side="right"
              className="w-[85vw] max-w-sm p-4 overflow-auto"
            >
              <SheetTitle className="mb-6">Filtros</SheetTitle>
              <FiltersPanel
                control={control}
                setValue={setValue}
                watch={watch}
                brands={brands}
                statuses={statuses}
                transmissions={transmissions}
                reset={reset}
                companyId={companyId}
              />
              <SheetClose className="w-full mt-4" asChild>
                <Button className="w-full mt-4">
                  Aplicar filtros
                  <CheckCircle />{" "}
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
          <Button
            onClick={() => {
              setShowSearchForm((prev: boolean) => !prev);
            }}
            className="w-full  max-w-[498px] left-[50%] translate-x-[-50%] relative mb-4"
          >
            <SearchCheck className="mr-1" /> Buscar {sellerWordCapitalized}
          </Button>
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
  setShowSearchForm,
  companyId,
}: any) => {
  const currency = watch("currency");

  const kmSteps = [
    0, 10000, 20000, 30000, 40000, 50000, 75000, 100000, 125000, 150000, 175000,
    200000, 250000, 300000, 350000, 500000, 1000000,
  ];

  const yearSteps = Array.from(
    { length: new Date().getFullYear() - 1989 },
    (_, i) => 1990 + i
  );
  const pathname = usePathname();
  const isVendidosPage = pathname.includes("vendidos");
  const router = useRouter();

  const sellerWordCapitalized = useSellerWordCapitalized();
  const sellerWord = useSellerWord();

  return (
    <div>
      <Button
        onClick={() => {
          setShowSearchForm((prev: boolean) => !prev);
        }}
        className="w-full mb-4 hidden lg:flex"
      >
        <SearchCheck className="mr-1" /> Buscar {sellerWordCapitalized}
      </Button>

      <div className="space-y-8">
        {/* Brand */}

        <div>
          <label className="block mb-1 text-sm font-medium">Marca</label>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val) =>
                  field.onChange(val === "all" ? "" : val)
                }
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

        {/* Vehicle Type */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Tipo de Vehículo
          </label>
          <Controller
            name="vehicleType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="autos">Autos</SelectItem>
                  <SelectItem value="motos">Motos</SelectItem>
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

        {/* KM - FROM and TO */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Kilómetros
            <span className="text-[11px] text-muted-foreground ml-2">
              (Desde - Hasta)
            </span>
          </label>
          <div className="flex gap-2">
            <Controller
              name="km"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={(val) => {
                      const to = field.value[1];
                      field.onChange([Number(val), to]);
                    }}
                    value={String(field.value[0])}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Desde" />
                    </SelectTrigger>
                    <SelectContent>
                      {kmSteps.map((km) => (
                        <SelectItem
                          key={km}
                          value={String(km)}
                          className="text-xs"
                        >
                          {km.toLocaleString("es")} km
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(val) => {
                      const from = field.value[0];
                      field.onChange([from, Number(val)]);
                    }}
                    value={String(field.value[1])}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Hasta" />
                    </SelectTrigger>
                    <SelectContent>
                      {kmSteps.map((km) => (
                        <SelectItem
                          className="text-xs"
                          key={km}
                          value={String(km)}
                        >
                          {km.toLocaleString("es")} km
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
        </div>

        {/* Year - FROM and TO */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Año
            <span className="text-[11px] text-muted-foreground ml-2">
              (Desde - Hasta)
            </span>
          </label>
          <div className="flex gap-2">
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={(val) => {
                      const to = field.value[1];
                      field.onChange([Number(val), to]);
                    }}
                    value={String(field.value[0])}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Desde" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearSteps.map((year) => (
                        <SelectItem
                          className="text-xs"
                          key={year}
                          value={String(year)}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(val) => {
                      const from = field.value[0];
                      field.onChange([from, Number(val)]);
                    }}
                    value={String(field.value[1])}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Hasta" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearSteps.map((year) => (
                        <SelectItem
                          className="text-xs"
                          key={year}
                          value={String(year)}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
        </div>

        {/* Transmission */}
        <div>
          <label className="block mb-1 text-sm font-medium">Transmisión</label>
          <div className="flex flex-wrap gap-2">
            {transmissions.map((t: string, index: number) => (
              <Badge
                key={index}
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

        {/* Reset Button */}
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
              vehicleType: "todos",
            });
          }}
        >
          Limpiar Filtros <Wand2 />
        </Button>
        {!isVendidosPage && noSalesCompanies.includes(companyId) && (
          <Button
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
                vehicleType: "todos",
              });
              router.push("/vendidos/todos");
            }}
          >
            Ver Vendidos
            <BadgeDollarSign />
          </Button>
        )}
        {isVendidosPage && (
          <Button
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
                vehicleType: "todos",
              });
              router.push("/catalogo/todos");
            }}
          >
            Ver {capitalize(sellerWord)} en Stock <ShoppingBag />
          </Button>
        )}
      </div>
    </div>
  );
};
