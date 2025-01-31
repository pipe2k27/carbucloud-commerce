// src/form-component/FormInputText.tsx
import { Controller } from "react-hook-form";
import styles from "./InputForm.module.css";
import { Box, Stack } from "@mui/material";
import ReactDatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import FormLabel from "./form-label.client";
import { useState } from "react";

type Props = {
  name: string;
  control: any;
  label?: string;
  smLabel?: boolean;
  required?: boolean;
  defaultValue?: string;
  info?: string[] | "";
};

const FormDatePlain: React.FC<Props> = ({
  name,
  control,
  label,
  smLabel,
  required,
  defaultValue,
  info,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <FormLabel
        required={required}
        label={label}
        smLabel={smLabel}
        info={info}
        isFocused={isFocused}
      />
      <Box className={styles.wrapper}>
        <Controller
          name={name}
          control={control}
          rules={{
            required: {
              value: required || false,
              message: "Por favor, complete este campo",
            },
          }}
          defaultValue={defaultValue}
          render={({
            field: { onChange, value },
            fieldState: { error },
            formState,
          }) => (
            <Stack width={"100%"} textAlign={"left"}>
              <ReactDatePicker
                className={styles.input}
                placeholderText="Seleccionar fecha"
                locale={es}
                dateFormat={"dd/MM/yyyy"}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e: Date) => {
                  onChange(e);
                }}
                selected={value}
              />
              <Box className="red" mt={-2} mb={2} ml={1}>
                {error?.message && error.message}
              </Box>
            </Stack>
          )}
        />
      </Box>
    </>
  );
};

export default FormDatePlain;
