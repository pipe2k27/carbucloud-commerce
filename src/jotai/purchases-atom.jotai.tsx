import { Purchase } from "@/dynamo-db/purchases.db";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type PurchaseState = {
  Purchases: Purchase[];
};

export const initialPurchaseState: PurchaseState = {
  Purchases: [],
};

export const purchaseAtom = atom<PurchaseState>(initialPurchaseState);

export const setPurchaseState = (params: PurchaseState) => {
  const potcars = store.get(purchaseAtom).Purchases;

  store.set(purchaseAtom, { ...potcars, ...params });
};

export const addOnePurchaseToAtom = (params: any) => {
  const potCars = store.get(purchaseAtom).Purchases;
  const newCars = [...potCars, params];

  store.set(purchaseAtom, { Purchases: newCars });
};

export const editPurchaseByProductId = (
  productId: string,
  updatedCar: Partial<Purchase>
) => {
  const potState = store.get(purchaseAtom).Purchases;
  const updatedCars = potState.map((car) =>
    car.productId === productId ? { ...car, ...updatedCar } : car
  );

  store.set(purchaseAtom, {
    Purchases: updatedCars,
  });
};

export const deleteOnePurchaseFromAtom = (productId: string) => {
  const purchases = store.get(purchaseAtom).Purchases;
  const newPurchases = purchases.filter((pur) => pur.productId !== productId);

  store.set(purchaseAtom, {
    Purchases: newPurchases,
  });
};
