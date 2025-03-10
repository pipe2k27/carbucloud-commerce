import { Sale } from "@/dynamo-db/sales.db";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

type SalesState = { sales: Sale[]; filteredSales: Sale[] };

export const initialSalesState: SalesState = {
  sales: [],
  filteredSales: [],
};

export const salesAtom = atom<SalesState>(initialSalesState);

export const setSalesState = (params: Partial<SalesState>) => {
  const currentState = store.get(salesAtom);

  store.set(salesAtom, { ...currentState, ...params });
};

export const addOneSaleToAtom = (sale: Sale) => {
  const sales = store.get(salesAtom).sales;
  const newSales = [...sales, sale];

  store.set(salesAtom, { sales: newSales, filteredSales: newSales });
};

export const editSaleByProductId = (
  productId: string,
  updatedSale: Partial<Sale>
) => {
  const salesState = store.get(salesAtom).sales;
  const updatedSales = salesState.map((sale) =>
    sale.productId === productId ? { ...sale, ...updatedSale } : sale
  );

  const filteredSalesState = store.get(salesAtom).filteredSales;
  const updatedFilteredSales = filteredSalesState.map((sale) =>
    sale.productId === productId ? { ...sale, ...updatedSale } : sale
  );

  store.set(salesAtom, {
    sales: updatedSales,
    filteredSales: updatedFilteredSales,
  });
};

export const deleteOneSaleFromAtom = (productId: string) => {
  const sales = store.get(salesAtom).sales;
  const newSales = sales.filter((sale) => sale.productId !== productId);

  store.set(salesAtom, { sales: newSales, filteredSales: newSales });
};
