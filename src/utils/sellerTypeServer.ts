import { getCompanyByCompanyId, SellerType } from "@/dynamo-db/companies.db";

export const getSellerTypeServer = async (companyId?: string) => {
  if (!companyId) return "cars";

  const company = await getCompanyByCompanyId(companyId);

  if (company.status === 200 && company.data?.sellerType) {
    return company.data?.sellerType;
  }

  return "cars";
};

export const getSellerWordServer = async (word: SellerType) => {
  if (word === "motorbikes") {
    return "moto";
  }
  if (word === "cars") {
    return "auto";
  }
  if (word === "multi") {
    return "vehículo";
  }
  return "auto";
};

export const getSellerWordServerCapitalized = async (word: SellerType) => {
  if (word === "motorbikes") {
    return "Moto";
  }
  if (word === "cars") {
    return "Auto";
  }
  if (word === "multi") {
    return "Vehículo";
  }
  return "Auto";
};

export const getSellerWordServerOrBoth = async (word: SellerType) => {
  if (word === "motorbikes") {
    return "moto";
  }
  if (word === "cars") {
    return "auto";
  }
  if (word === "multi") {
    return "auto o moto";
  }
  return "auto";
};
