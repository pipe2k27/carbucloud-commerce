import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type CommonComponentAtomType = {
  showNewCarModal: boolean;
  editingCarId?: string;
  showEditCarModal: boolean;
  showEditCarImagesModal: boolean;
};

export const initialCommonComponentState: CommonComponentAtomType = {
  showNewCarModal: false,
  showEditCarModal: false,
  showEditCarImagesModal: false,
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
