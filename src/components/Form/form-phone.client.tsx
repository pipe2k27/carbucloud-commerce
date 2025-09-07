"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import FormLabel from "./form-label.client";

type Props = {
  name: string;
  control: any;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  width?: string;
  maxLength?: number;
  rules?: any;
};

const FormPhone: React.FC<Props> = ({
  name,
  control,
  label,
  required,
  defaultValue = "+549",
  width,
  maxLength = 15,
  rules,
}) => {
  const customRules = rules || {};
  const PHONE_PREFIX = "+549";

  return (
    <div className="">
      {label && <FormLabel required={required} label={label} />}
      <Controller
        name={name}
        control={control}
        rules={{
          required: {
            value: required || false,
            message: "Por favor, complete este campo",
          },
          ...customRules,
        }}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          // Ensure the value always starts with the prefix
          const displayValue =
            value && value.startsWith(PHONE_PREFIX)
              ? value
              : PHONE_PREFIX + (value || "");

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            // If user tries to delete the prefix, prevent it
            if (inputValue.length < PHONE_PREFIX.length) {
              return;
            }

            // If the input doesn't start with the prefix, add it
            if (!inputValue.startsWith(PHONE_PREFIX)) {
              const cleanValue = inputValue.replace(/\D/g, ""); // Remove non-digits
              const newValue = PHONE_PREFIX + cleanValue;
              onChange(newValue);
              return;
            }

            // Remove any non-digit characters except the + at the beginning
            const cleanValue = inputValue.replace(/[^\d+]/g, "");
            onChange(cleanValue);
          };

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            const input = e.target as HTMLInputElement;
            const cursorPosition = input.selectionStart || 0;

            // Prevent deletion of the prefix
            if (
              (e.key === "Backspace" || e.key === "Delete") &&
              cursorPosition <= PHONE_PREFIX.length
            ) {
              e.preventDefault();
              return;
            }

            // Allow only digits and control keys
            if (
              !/[0-9]/.test(e.key) &&
              ![
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
                "Delete",
                "Tab",
                "Home",
                "End",
              ].includes(e.key)
            ) {
              e.preventDefault();
            }
          };

          const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            // Move cursor to the end of the prefix if it's at the beginning
            const input = e.target;
            if (
              input.selectionStart &&
              input.selectionStart < PHONE_PREFIX.length
            ) {
              input.setSelectionRange(PHONE_PREFIX.length, PHONE_PREFIX.length);
            }
          };

          return (
            <>
              <Input
                value={displayValue}
                type="text"
                className={`${width || "w-full"} ${
                  error && "border-red-400 focus:ring-red-400"
                }`}
                maxLength={maxLength}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                placeholder={`${PHONE_PREFIX}123456789`}
              />
              {error?.message && (
                <p className="mt-1 text-xs text-red-400">{error.message}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default FormPhone;
