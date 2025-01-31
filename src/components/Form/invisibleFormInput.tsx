// src/form-component/FormInputText.tsx
import { Controller } from "react-hook-form";
import { Box, Stack } from "@mui/material";

type Props = {
  name: string;
  control: any;
  defaultValue?: string;
};

const InvisibleFormInput: React.FC<Props> = ({
  name,
  control,
  defaultValue,
}) => {
  return (
    <>
      <Box sx={{ opacity: 0, pointerEvents: "none" }} position={"absolute"}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({
            field: { onChange, value },
            fieldState: { error },
            formState,
          }) => (
            <Stack width={"100%"} textAlign={"left"}>
              <input
                value={value}
                style={
                  error && {
                    borderColor: "red",
                    backgroundColor: "#fef7f6",
                  }
                }
                maxLength={150}
                onChange={onChange}
                defaultValue={value}
                readOnly
                tabIndex={-1}
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

export default InvisibleFormInput;
