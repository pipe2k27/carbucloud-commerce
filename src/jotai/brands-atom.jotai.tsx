import { Brand } from "@/dynamo-db/brands.db";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type BrandsState = {
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
  lastFetchAttempt: number | null;
};

export const initialBrandsState: BrandsState = {
  brands: [],
  isLoading: false,
  error: null,
  lastFetchAttempt: null,
};

export const brandsAtom = atom<BrandsState>(initialBrandsState);

export const setBrandsState = (brands: Brand[]) => {
  store.set(brandsAtom, { brands, isLoading: false, error: null, lastFetchAttempt: Date.now() });
};

export const setBrandsLoading = (isLoading: boolean) => {
  const current = store.get(brandsAtom);
  store.set(brandsAtom, { ...current, isLoading });
};

export const setBrandsError = (error: string | null) => {
  const current = store.get(brandsAtom);
  store.set(brandsAtom, { ...current, error, isLoading: false });
};

