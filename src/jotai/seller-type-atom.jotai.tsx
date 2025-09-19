import { SellerType } from "@/dynamo-db/companies.db";
import { atom, getDefaultStore } from "jotai";
import { useAtomValue } from "jotai";

const store = getDefaultStore();

type CommonComponentAtomType = {
  sellerType: SellerType;
};

export const initialSellerTypetState: CommonComponentAtomType = {
  sellerType: "cars",
};

export const sellerTypeAtom = atom<CommonComponentAtomType>(
  initialSellerTypetState
);

export const getSellerType = () => {
  return store.get(sellerTypeAtom).sellerType;
};

export function useSellerWord() {
  const { sellerType } = useAtomValue(sellerTypeAtom);
  if (sellerType === "motorbikes") {
    return "moto";
  }
  if (sellerType === "cars") {
    return "auto";
  }
  if (sellerType === "multi") {
    return "vehículo";
  }
  return "auto";
}

export function useSellerWordCapitalized() {
  const { sellerType } = useAtomValue(sellerTypeAtom);
  if (sellerType === "motorbikes") {
    return "Moto";
  }
  if (sellerType === "cars") {
    return "Auto";
  }
  if (sellerType === "multi") {
    return "Vehículo";
  }
  return "Auto";
}

export function useSellerWordOrBoth() {
  const { sellerType } = useAtomValue(sellerTypeAtom);
  if (sellerType === "motorbikes") {
    return "moto";
  }
  if (sellerType === "cars") {
    return "auto";
  }
  if (sellerType === "multi") {
    return "auto o moto";
  }
  return "auto";
}
