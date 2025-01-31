// src/form-component/FormInputText.tsx
import styles from "./InputForm.module.css";
import { Box } from "@mui/material";
import FormNumber from "./form-number.client";
import FormSelect from "./form-select.client";
import currency from "../../data/currency";
import InvisibleFormInput from "./invisibleFormInput";
import FormLabel from "./form-label.client";
import { useState } from "react";

type Props = {
  name: string;
  control: any;
  label?: string;
  smLabel?: boolean;
  required?: boolean;
  pesosOnly?: boolean;
  info?: string[] | "";
};

const FormMoney: React.FC<Props> = ({
  name,
  label,
  smLabel,
  required,
  control,
  pesosOnly,
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
        <Box mr={1} width={"34%"}>
          <InvisibleFormInput
            name={`${name}.type`}
            defaultValue="money"
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
        <Box mr={1} width={"16%"}>
          <FormNumber
            name={`${name}.decimals`}
            control={control}
            integers
            placeholder="Decimales"
            setIsParentFocused={setIsFocused}
          />
        </Box>
        <Box width={"50%"}>
          <FormSelect
            name={`${name}.currency`}
            control={control}
            options={currency
              .filter((cur) => {
                if (!pesosOnly) {
                  return true;
                }
                return cur === "Pesos Argentinos";
              })
              .map((cur) => ({ value: cur, label: cur }))}
            required={required}
            placeholder="Moneda"
            setIsParentFocused={setIsFocused}
          />
        </Box>
      </Box>
    </>
  );
};

export default FormMoney;
