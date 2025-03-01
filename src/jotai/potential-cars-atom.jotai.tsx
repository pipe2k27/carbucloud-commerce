import { PotentialCarPurchase } from "@/dynamo-db/potentialCarPurchases.db";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type PotentialCarPurchaseState = {
  potentialCarPurchases: PotentialCarPurchase[];
};

export const initialPotentialCarPurchaseState: PotentialCarPurchaseState = {
  potentialCarPurchases: [],
};

export const potentialCarsPurchaseAtom = atom<PotentialCarPurchaseState>(
  initialPotentialCarPurchaseState
);

export const setPotentialCarPurchaseState = (
  params: PotentialCarPurchaseState
) => {
  const potcars = store.get(potentialCarsPurchaseAtom).potentialCarPurchases;

  store.set(potentialCarsPurchaseAtom, { ...potcars, ...params });
};

export const addOnePotentialCarToAtom = (params: any) => {
  const potCars = store.get(potentialCarsPurchaseAtom).potentialCarPurchases;
  const newCars = [...potCars, params];

  store.set(potentialCarsPurchaseAtom, { potentialCarPurchases: newCars });
};

export const editPotentialCarByProductId = (
  productId: string,
  updatedCar: Partial<PotentialCarPurchase>
) => {
  const potState = store.get(potentialCarsPurchaseAtom).potentialCarPurchases;
  const updatedCars = potState.map((car) =>
    car.productId === productId ? { ...car, ...updatedCar } : car
  );

  store.set(potentialCarsPurchaseAtom, {
    potentialCarPurchases: updatedCars,
  });
};
