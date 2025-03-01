import { Car } from "@/dynamo-db/cars.db";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type CarsState = { cars: Car[]; filteredCars: Car[] };

export const initialCarsState: CarsState = {
  cars: [],
  filteredCars: [],
};

export const carsAtom = atom<CarsState>(initialCarsState);

export const setCarsState = (params: any) => {
  const cars = store.get(carsAtom).cars;

  store.set(carsAtom, { ...cars, ...params });
};

export const addOneCarToAtom = (params: any) => {
  const cars = store.get(carsAtom).cars;
  const newCars = [...cars, params];

  store.set(carsAtom, { cars: newCars, filteredCars: newCars });
};

export const editCarByProductId = (
  productId: string,
  updatedCar: Partial<Car>
) => {
  const carsState = store.get(carsAtom).cars;
  const updatedCars = carsState.map((car) =>
    car.productId === productId ? { ...car, ...updatedCar } : car
  );

  const filteredCarsState = store.get(carsAtom).filteredCars;
  const updatedFilteredCars = filteredCarsState.map((car) =>
    car.productId === productId ? { ...car, ...updatedCar } : car
  );

  store.set(carsAtom, { cars: updatedCars, filteredCars: updatedFilteredCars });
};

export const deleteOneCarFromAtom = (productId: string) => {
  const cars = store.get(carsAtom).cars;
  const newCars = cars.filter((car) => car.productId !== productId);

  store.set(carsAtom, { cars: newCars, filteredCars: newCars });
};
