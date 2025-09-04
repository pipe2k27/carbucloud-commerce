const companiesWithOnlyMotos = ["0009"];

export const isMotos = (companyId?: string) => {
  if (companiesWithOnlyMotos.includes(String(companyId))) {
    return true;
  }
  return false;
};
