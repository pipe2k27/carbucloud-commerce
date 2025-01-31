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

const FormInput: React.FC<Props> = ({
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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Input
              value={value}
              type="text"
              className={`${width || "w-full"} ${
                error && "border-red-400 focus:ring-red-400"
              }`}
              maxLength={maxLength || 150}
              onChange={onChange}
              // defaultValue={value}
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

export default FormInput;
