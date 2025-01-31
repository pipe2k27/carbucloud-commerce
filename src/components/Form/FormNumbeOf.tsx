// src/form-component/FormInputText.tsx
import { Controller } from "react-hook-form";
import styles from "./InputForm.module.css";
import { Box, Stack } from "@mui/material";
import { Question } from "../../Types/Question.types";
import FormLabel from "./form-label.client";
import { useState } from "react";

type Props = {
  name: string;
  control: any;
  label?: string;
  smLabel?: boolean;
  required?: boolean;
  defaultValue?: string;
  question: Question;
  info?: string[] | "";
};

const FormNumberOf: React.FC<Props> = ({
  name,
  control,
  label,
  smLabel,
  required,
  defaultValue,
  question,
  info,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getAnswerWithoutText = (value: string) => {
    let valueNormalized = typeof value === "string" ? value.split("") : [];
    let newValue = valueNormalized
      .filter((val) => /[\d|\\,.]/.test(val))
      .join("");
    return newValue;
  };

  const addFixedValueText = (value: number | string) => {
    if (isNaN(Number(value))) {
      return "";
    }
    if (String(value) === "1") {
      return `${value} ${question.fixedValueSingular}`;
    } else if (String(value).trim() !== "") {
      return `${value} ${question.fixedValue}`;
    }
    return "";
  };

  const checkError = (error: any) => {
    if (error && !isFocused) {
      return true;
    }
    return false;
  };

  return (
    <>
      <FormLabel
        required={required}
        label={`${label} (Número de ${question.fixedValue})`}
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
              <input
                value={value}
                className={styles.input}
                style={
                  checkError(error)
                    ? {
                        borderColor: "red",
                        backgroundColor: "#fef7f6",
                      }
                    : {}
                }
                maxLength={150}
                onChange={(e) => {
                  let valueNormalized =
                    typeof e.target.value === "string"
                      ? e.target.value.split("")
                      : [];
                  let newValue = valueNormalized
                    .filter((val) => /[\d|\\,.]/.test(val))
                    .join("");

                  onChange(newValue);
                }}
                defaultValue={value}
                onBlur={() => {
                  setIsFocused(false);
                  onChange(addFixedValueText(value));
                }}
                onFocus={() => {
                  setIsFocused(true);
                  onChange(getAnswerWithoutText(value));
                }}
              />
              <Box className="red" mt={-2} mb={2} ml={1}>
                {error?.message && !isFocused && error.message}
              </Box>
            </Stack>
          )}
        />
      </Box>
    </>
  );
};

export default FormNumberOf;
