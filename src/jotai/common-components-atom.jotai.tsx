import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type CommonComponentAtomType = {
  showNewCarModal: boolean;
};

export const initialCommonComponentState: CommonComponentAtomType = {
  showNewCarModal: false,
};

export const commonComponentAtom = atom<CommonComponentAtomType>(
  initialCommonComponentState
);

export const setCommonComponentAtom = (params: CommonComponentAtomType) => {
  store.set(commonComponentAtom, {
    ...initialCommonComponentState,
    ...params,
  });
};

export const resetCommonComponentAtom = () => {
  store.set(commonComponentAtom, initialCommonComponentState);
};
