import { CarStatusType } from "@/dynamo-db/cars";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: "Automatica" | "Manual";
  type: "SUV" | "Sedan" | "Pick-Up" | "Hatchback" | "Coupe";
  price: number;
  imageUrl: string;
  status?: CarStatusType;
  km: number;
};

type CarsState = { cars: Car[]; filteredCars: Car[] };

// const carsMock: Car[] = [
//   {
//     id: "1",
//     brand: "Toyota",
//     model: "Corolla",
//     year: 2020,
//     transmission: "Automatica",
//     type: "Sedan",
//     price: 20000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "available",
//     km: 10000,
//   },
//   {
//     id: "2",
//     brand: "Ford",
//     model: "F-150",
//     year: 2019,
//     transmission: "Manual",
//     type: "Pick-Up",
//     price: 35000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "reserved",
//     km: 20000,
//   },
//   {
//     id: "3",
//     brand: "Honda",
//     model: "Civic",
//     year: 2021,
//     transmission: "Automatica",
//     type: "Sedan",
//     price: 22000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "reserved",
//     km: 15000,
//   },
//   {
//     id: "4",
//     brand: "Chevrolet",
//     model: "Tahoe",
//     year: 2018,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 40000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "reserved",
//     km: 30000,
//   },
//   {
//     id: "5",
//     brand: "Nissan",
//     model: "Altima",
//     year: 2022,
//     transmission: "Manual",
//     type: "Sedan",
//     price: 24000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 5000,
//   },
//   {
//     id: "6",
//     brand: "Jeep",
//     model: "Wrangler",
//     year: 2020,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 32000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 25000,
//   },
//   {
//     id: "7",
//     brand: "BMW",
//     model: "X5",
//     year: 2021,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 50000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 10000,
//   },
//   {
//     id: "8",
//     brand: "Mercedes-Benz",
//     model: "C-Class",
//     year: 2019,
//     transmission: "Manual",
//     type: "Sedan",
//     price: 45000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "paused",
//     km: 20000,
//   },
//   {
//     id: "9",
//     brand: "Subaru",
//     model: "Outback",
//     year: 2022,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 34000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "reserved",
//     km: 15000,
//   },
//   {
//     id: "10",
//     brand: "Hyundai",
//     model: "Elantra",
//     year: 2020,
//     transmission: "Manual",
//     type: "Sedan",
//     price: 20000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 5000,
//   },
//   {
//     id: "11",
//     brand: "Kia",
//     model: "Sorento",
//     year: 2021,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 30000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "available",
//     km: 10000,
//   },
//   {
//     id: "12",
//     brand: "Volkswagen",
//     model: "Jetta",
//     year: 2020,
//     transmission: "Automatica",
//     type: "Sedan",
//     price: 21000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "paused",
//     km: 20000,
//   },
//   {
//     id: "13",
//     brand: "Chevrolet",
//     model: "Silverado",
//     year: 2018,
//     transmission: "Manual",
//     type: "Pick-Up",
//     price: 37000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "available",
//     km: 30000,
//   },
//   {
//     id: "14",
//     brand: "Mazda",
//     model: "CX-5",
//     year: 2021,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 28000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "available",
//     km: 15000,
//   },
//   {
//     id: "15",
//     brand: "Tesla",
//     model: "Model 3",
//     year: 2022,
//     transmission: "Automatica",
//     type: "Sedan",
//     price: 55000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 5000,
//   },
//   {
//     id: "16",
//     brand: "Ford",
//     model: "Escape",
//     year: 2020,
//     transmission: "Manual",
//     type: "SUV",
//     price: 25000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 25000,
//   },
//   {
//     id: "17",
//     brand: "Toyota",
//     model: "RAV4",
//     year: 2021,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 27000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 10000,
//   },
//   {
//     id: "18",
//     brand: "Dodge",
//     model: "Ram 1500",
//     year: 2019,
//     transmission: "Manual",
//     type: "Pick-Up",
//     price: 42000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "paused",
//     km: 30000,
//   },
//   {
//     id: "19",
//     brand: "Lexus",
//     model: "RX 350",
//     year: 2022,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 47000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "sold",
//     km: 15000,
//   },
//   {
//     id: "20",
//     brand: "Honda",
//     model: "CR-V",
//     year: 2021,
//     transmission: "Automatica",
//     type: "SUV",
//     price: 31000,
//     imageUrl:
//       "https://http2.mlstatic.com/D_NQ_NP_2X_909044-MLA81304104973_122024-F.webp",
//     status: "reserved",
//     km: 20000,
//   },
// ];

const carsMock: Car[] = [];

export const initialCarsState: CarsState = {
  cars: carsMock,
  filteredCars: carsMock,
};

export const carsAtom = atom<CarsState>(initialCarsState);

export const setCarsState = (params: any) => {
  const cars = store.get(carsAtom).cars;

  store.set(carsAtom, { ...cars, ...params });
};

export const addOneCarToAtom = (params: any) => {
  const cars = store.get(carsAtom).cars;
  const newCars = [...cars, params];

  store.set(carsAtom, { cars: newCars, filteredCars: newCars });
};
