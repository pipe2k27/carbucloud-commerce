"use client";

import { statusConfig } from "@/components/Common/car-status-badge";
import { Car } from "@/dynamo-db/cars.db";

type CarSpecsProps = { car: Car };

const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
  return (
    <>
      <div className="w-full h-[1px] bg-gray-300 mt-8 mb-8" />
      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="Marca" value={car.brand} />
        <DetailItem label="Modelo y versión" value={car.model} />
        <DetailItem label="Año" value={car.year} />
        <DetailItem label="Tipo" value={car.carType} />
        <DetailItem label="Transmisión" value={car.transmission} />
        <DetailItem label="Motor" value={car.engine} />
        <DetailItem label="Tracción" value={car.traction} />
        <DetailItem
          label="Kilometraje"
          value={`${Number(car.km).toLocaleString("es")} km`}
        />
        <DetailItem
          icon={statusConfig[car.status]?.icon}
          label="Estado"
          value={statusConfig[car.status]?.label}
          className={statusConfig[car.status]?.color || "text-gray-500"}
        />
        <div className="">
          <DetailItem
            label="Precio"
            value={`${car.currency} $${car.price?.toLocaleString("es") || 0}`}
            className="text-primary"
          />
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-300 mt-8" />
      <div className="lg:min-h-[100px]">
        <DetailText label="Descripción" value={car.description} />
      </div>
    </>
  );
};

interface DetailItemProps {
  label: string;
  value: string | number;
  className?: string;
  icon?: React.ElementType;
}

const DetailItem = ({
  label,
  value,
  className,
  icon: StatusIcon,
}: DetailItemProps) => (
  <div>
    <p className="text-[12px] text-gray-500">{label}</p>
    <p className={`text-sm font-semibold ${className} flex items-center`}>
      {StatusIcon && <StatusIcon className="w-4 h-4 mr-1" />}
      {value || "Sin Especificar"}
    </p>
  </div>
);

const DetailText = ({ label, value }: DetailItemProps) => (
  <div className="my-4 min-h-14">
    <p className="font-semibold text-gray-500">{label}</p>
    <p className="text-[12px]">{value || "Sin Especificar"} </p>
  </div>
);

export default CarSpecs;
