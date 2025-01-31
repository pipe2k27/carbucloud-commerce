"use client";

import React from "react";
import { Controller, useController } from "react-hook-form";
import FormLabel from "./form-label.client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type Option = {
  value: string | boolean;
  label: string;
};

type Props = {
  options: Option[];
  onChange?: (e: any) => void;
  placeholder?: string;
  name: string;
  control: any;
  label?: string;
  required?: boolean;
};

const FormSelect: React.FC<Props> = ({
  options,
  onChange,
  placeholder,
  name,
  control,
  label,
  required,
}) => {
  const [isPlaceholder, setIsPlaceholder] = React.useState(true);

  const {
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div>
      {/* Label */}
      {label && <FormLabel required={required} label={label} />}

      {/* Select Component */}
      {options.length > 0 && (
        <Controller
          name={name}
          control={control}
          rules={{
            required: {
              value: required || false,
              message: "Por favor, complete este campo",
            },
          }}
          render={({ field }) => (
            <div>
              <Select
                value={
                  options
                    .find((o) => o.value === field.value)
                    ?.value.toString() || ""
                }
                onValueChange={(value) => {
                  if (onChange) onChange(value);
                  field.onChange(value);
                  setIsPlaceholder(false);
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    isPlaceholder ? "text-[rgba(147,147,147,0.4)]" : ""
                  } ${error && "border-red-400"} `}
                >
                  <SelectValue placeholder={placeholder || "Seleccionar"} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value.toString()}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Error Message */}
              {error?.message && (
                <p className="mt-1 text-xs text-red-400">{error.message}</p>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default FormSelect;
