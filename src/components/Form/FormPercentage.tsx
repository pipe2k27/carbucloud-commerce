// src/form-component/FormInputText.tsx
import styles from "./InputForm.module.css";
import { Box } from "@mui/material";
import FormNumber from "./form-number.client";
import InvisibleFormInput from "./invisibleFormInput";
import FormLabel from "./form-label.client";
import { useState } from "react";

type Props = {
  name: string;
  control: any;
  label?: string;
  smLabel?: boolean;
  required?: boolean;
  info?: string[] | "";
};

const FormPercentage: React.FC<Props> = ({
  name,
  label,
  smLabel,
  required,
  control,
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

      {label && smLabel && <Box className={styles.textSm}>{label}</Box>}

      <Box className={styles.wrapper}>
        <Box mr={1} width={"54%"}>
          <InvisibleFormInput
            name={`${name}.type`}
            defaultValue="percentage"
            control={control}
          />
          <FormNumber
            name={`${name}.number`}
            control={control}
            integers
            placeholder="Numero entero"
            required={required}
            setIsParentFocused={setIsFocused}
          />
        </Box>
        <Box mr={1} width={"26%"}>
          <FormNumber
            name={`${name}.decimals`}
            control={control}
            integers
            placeholder="Decimales"
            setIsParentFocused={setIsFocused}
          />
        </Box>
        <Box
          width={"20%"}
          sx={{ fontSize: "0.9rem", transform: "translateY(-6px)" }}
          display="flex"
          alignItems="center"
        >
          % (Por Ciento)
        </Box>
      </Box>
    </>
  );
};

export default FormPercentage;
