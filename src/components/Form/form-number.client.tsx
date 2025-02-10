import { Controller } from "react-hook-form";
import FormLabel from "./form-label.client";
import { Input } from "@/components/ui/input";

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

const FormNumber: React.FC<Props> = ({
  name,
  control,
  label,
  required,
  defaultValue,
  width,
  maxLength,
  rules,
}) => {
  const customRules = rules || {};

  // Helper function to format a number with thousand separators in Spanish
  const formatWithSeparator = (value: string) => {
    const numericValue = value.replace(/\D/g, ""); // Remove all non-numeric characters
    return new Intl.NumberFormat("es-ES").format(Number(numericValue) || 0);
  };

  return (
    <div>
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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Input
              value={formatWithSeparator(value || "")} // Automatically format value
              type="text"
              className={`${width || "w-full"} ${
                error && "border-red-400 focus:ring-red-400"
              }`}
              maxLength={maxLength || 150}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters
                onChange(inputValue); // Pass the raw numeric value to react-hook-form
              }}
              onKeyDown={(e) => {
                // Allow only numeric characters and special control keys
                if (
                  !/[0-9]/.test(e.key) &&
                  ![
                    "Backspace",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                    "Tab",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
            />
            {error?.message && (
              <p className="mt-1 text-xs text-red-400">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default FormNumber;
