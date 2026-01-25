import { Car } from "@/dynamo-db/cars.db";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type CommonComponentAtomType = {
  currentCar?: Car;
  showWhatsappModal: boolean;
  showAppointmentModal: boolean;
  confirmModal: {
    show: boolean;
    title?: string;
    description?: string;
    onConfirm?: () => void;
  };
};

export const initialCommonComponentState: CommonComponentAtomType = {
  showWhatsappModal: false,
  showAppointmentModal: false,
  confirmModal: {
    show: false,
  },
};

export const commonComponentAtom = atom<CommonComponentAtomType>(
  initialCommonComponentState
);

export const setCommonComponentAtom = (
  params: Partial<CommonComponentAtomType>
) => {
  store.set(commonComponentAtom, {
    ...initialCommonComponentState,
    ...params,
  });
};

export const resetCommonComponentAtom = () => {
  store.set(commonComponentAtom, initialCommonComponentState);
};
