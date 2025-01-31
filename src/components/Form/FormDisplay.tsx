// src/form-component/FormInputText.tsx
import styles from "./InputForm.module.css";
import { Box, Stack } from "@mui/material";
import FormLabel from "./form-label.client";

type Props = {
  label?: string;
  defaultValue?: string;
  width?: string;
  info?: string[] | "";
};

const FormDisplay: React.FC<Props> = ({ label, defaultValue, width, info }) => {
  return (
    <>
      <FormLabel
        required={false}
        label={label}
        smLabel={false}
        info={info}
        isFocused={false}
      />
      <Box className={styles.wrapper}>
        <Stack
          width={width || "100%"}
          textAlign={"left"}
          sx={{
            "& input": {
              opacity: 0.5,
              pointerEvents: "none",
            },
          }}
        >
          <input
            tabIndex={-1}
            value={defaultValue || ""}
            className={styles.input}
            defaultValue={defaultValue || ""}
          />
        </Stack>
      </Box>
    </>
  );
};

export default FormDisplay;
