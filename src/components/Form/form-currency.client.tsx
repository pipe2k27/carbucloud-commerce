"use client";

import React from "react";
import { useAtomValue } from "jotai";
import { companyCountryAtom } from "@/jotai/company-country-atom.jotai";
import FormSelect from "./form-select.client";

type Props = {
  onChange?: (e: any) => void;
  placeholder?: string;
  name: string;
  control: any;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export const currencyOptions = [
  { value: "USD", label: "Dólares Estadounidenses" },
  { value: "ARS", label: "Pesos Argentinos" },
  { value: "UYU", label: "Pesos Uruguayos" },
];

export const getFilteredCurrencyOptions = (
  country: "AR" | "UY" | null
): typeof currencyOptions => {
  if (country === "UY") {
    return currencyOptions.filter((option) => option.value !== "ARS");
  }
  if (country === "AR") {
    return currencyOptions.filter((option) => option.value !== "UYU");
  }
  return currencyOptions;
};

const FormCurrency: React.FC<Props> = ({
  onChange,
  placeholder,
  name,
  control,
  label,
  helperText,
  required,
  disabled,
  icon,
}) => {
  const { country } = useAtomValue(companyCountryAtom);

  // Filter currency options based on country
  const filteredOptions = React.useMemo(() => {
    return getFilteredCurrencyOptions(country);
  }, [country]);

  // Use filtered options instead of the passed options
  return (
    <FormSelect
      options={filteredOptions}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      control={control}
      label={label}
      helperText={helperText}
      required={required}
      disabled={disabled}
      icon={icon}
    />
  );
};

export default FormCurrency;
