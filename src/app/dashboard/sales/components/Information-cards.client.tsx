"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { carsAtom } from "@/jotai/cars-atom.jotai";
import { useAtomValue } from "jotai";
import { Car, CheckCircle2, CircleDollarSign, CirclePause } from "lucide-react";

export interface CardData {
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
}

const InformationCard: React.FC<CardData> = ({
  title,
  icon,
  value,
  description,
}) => {
  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-primary">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export const InformationCards: React.FC = () => {
  const { cars } = useAtomValue(carsAtom);

  const cardData: CardData[] = [
    {
      title: "Total Productos",
      icon: <Car className="h-4 w-4" />,
      value: cars.length.toString(),
      description: "+Todos los productos en la base de datos",
    },
    {
      title: "Productos Activos",
      icon: <CheckCircle2 className="h-4 w-4" />,
      value: cars
        .filter((car: any) => car.status === "available")
        .length.toString(),
      description: "+Productos que figuran en la web con precio",
    },
    {
      title: "Productos Reservados",
      icon: <CircleDollarSign className="h-4 w-4" />,
      value: cars
        .filter((car: any) => car.status === "reserved")
        .length.toString(),
      description:
        "+Productos que figuran en la web como reservados y sin precio",
    },
    {
      title: "Productos Vendidos",
      icon: <CirclePause className="h-4 w-4" />,
      value: cars.filter((car: any) => car.status === "sold").length.toString(),
      description: "+Productos que NO figuran en la web",
    },
  ];

  return (
    <>
      {cardData.map((card, index) => (
        <InformationCard
          key={index}
          title={card.title}
          icon={card.icon}
          value={card.value}
          description={card.description}
        />
      ))}
    </>
  );
};
