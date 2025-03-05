import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type CommonComponentAtomType = {
  showNewCarModal: boolean;
  currentElementId?: string;
  showEditCarModal: boolean;
  showEditCarImagesModal: boolean;
  showNewCarPurchaseModal: boolean;
  showEditPurchaseModal: boolean;
  shouldRefreshRouter: boolean;
  showEditPurchaseImages: boolean;
  confirmModal: {
    show: boolean;
    title?: string;
    description?: string;
    onConfirm?: () => void;
  };
};

export const initialCommonComponentState: CommonComponentAtomType = {
  showNewCarModal: false,
  showEditCarModal: false,
  showEditCarImagesModal: false,
  showNewCarPurchaseModal: false,
  showEditPurchaseModal: false,
  currentElementId: undefined,
  shouldRefreshRouter: false,
  showEditPurchaseImages: false,
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
