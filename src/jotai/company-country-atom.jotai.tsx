import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type CompanyCountryState = {
  country: "AR" | "UY" | null;
  isLoading: boolean;
  error: string | null;
  lastFetchAttempt: number | null;
};

export const initialCompanyCountryState: CompanyCountryState = {
  country: null,
  isLoading: false,
  error: null,
  lastFetchAttempt: null,
};

export const companyCountryAtom = atom<CompanyCountryState>(
  initialCompanyCountryState
);

export const setCompanyCountryState = (country: "AR" | "UY") => {
  store.set(companyCountryAtom, {
    country,
    isLoading: false,
    error: null,
    lastFetchAttempt: Date.now(),
  });
};

export const setCompanyCountryLoading = (isLoading: boolean) => {
  const current = store.get(companyCountryAtom);
  store.set(companyCountryAtom, { ...current, isLoading });
};

export const setCompanyCountryError = (error: string | null) => {
  const current = store.get(companyCountryAtom);
  store.set(companyCountryAtom, { ...current, error, isLoading: false });
};
