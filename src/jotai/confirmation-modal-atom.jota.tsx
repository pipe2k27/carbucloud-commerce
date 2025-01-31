import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type ConfirmationModalType = {
  disclaimer?: string | null;
  title: string;
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  show: boolean;
};

export const initialConfirmationModalState: ConfirmationModalType = {
  title: "",
  message: "",
  show: false,
};

export const confirmationModalAtom = atom<ConfirmationModalType>(
  initialConfirmationModalState
);

export const setConfirmationModalAtom = (params: ConfirmationModalType) => {
  store.set(confirmationModalAtom, {
    ...initialConfirmationModalState,
    ...params,
  });
};
