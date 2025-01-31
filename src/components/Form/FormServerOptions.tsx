import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Selector from "react-select";
import styles from "./InputForm.module.css";
import { Controller, useController } from "react-hook-form";
import FormLabel from "./form-label.client";
import { useAuth0 } from "@auth0/auth0-react";
import { setLoading } from "../../Utils/modalMethods";
import { APIPostWithError } from "../../Services/authenticated";

type Option = {
  value: string;
  label: string;
};

type Props = {
  onChange?: (e: any) => void;
  defaultValue?: string;
  placeholder?: string;
  name: string;
  control: any;
  label?: string;
  sheetId?: string;
  smLabel?: boolean;
  required?: boolean;
  info?: string[] | "";
  setIsParentFocused?: any;
};

const FormServerOptions: React.FC<Props> = ({
  onChange,
  defaultValue,
  placeholder,
  name,
  control,
  label,
  sheetId,
  smLabel,
  required,
  info,
  setIsParentFocused,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isFocused, setIsFocused] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);

  const getAndSetOoptionsFromServer = async () => {
    try {
      setLoading(true);

      const accessToken = await getAccessTokenSilently();
      const data = await APIPostWithError(
        "/server-options/get-sheet-data",
        accessToken,
        { sheetId }
      );

      if (data?.options) {
        const serverOptions = data.options.map((opt: any) => ({
          value: opt.label,
          label: opt.label,
          ...opt,
        }));
        setOptions([...serverOptions]);
        setServerError(false);
      } else {
        setServerError(true);
      }
    } catch {
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAndSetOoptionsFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    fieldState: { error },
  } = useController({ name, control });

  const onFocus = () => {
    setIsFocused(true);
    setIsParentFocused && setIsParentFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
    setIsParentFocused && setIsParentFocused(false);
  };

  const getBackggroundColor = (state: any) => {
    if (state.isSelected) return "#a8bbfd";
    if (state.isFocused) return "#e8eeff";
    return "white";
  };

  const getBackggroundColor2 = (state: any) => {
    if (error) return "#fef7f6";
    if (state.isFocused) return "white";
    return "#e8eeff";
  };

  const getBorderColor = (state: any) => {
    if (error) return "3px solid red";

    if (state.isFocused) return "3px solid #b3fda8";
    return "solid 3px #a8bbfd";
  };

  const getColor = (state: any) => {
    if (state.isSelected) return "white";
    if (state.isFocused) return "#818181";
    return "#5b55a0";
  };

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      color: getColor(state),
      backgroundColor: getBackggroundColor(state),
    }),
    container: (provided: any, state: any) => ({
      ...provided,
      width: "100%",
      height: "35px",
      border: "none",
      marginBottom: 20,
      marginTop: 5,
      color: "#5b55a0",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      border: getBorderColor(state),
      borderRadius: "8px",
      // backgroundColor: "#ebeffb",
      fontSize: "1rem",
      backgroundColor: getBackggroundColor2(state),
      boxShadow: "none",
      paddingLeft: isFocused ? 6 : 0,
    }),
    input: (provided: any) => ({
      ...provided,
      minHeight: "1px",
      textAlign: "left",
      height: "35px",
      color: "#5b55a0",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      color: "#5b55a0",
      textAlign: "left",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#5b55a0",
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: "19px",
    }),
    menuList: (provided: any) => ({
      ...provided,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "rgba(163, 138, 255, 0.4)",
      textAlign: "left",
    }),
  };

  return (
    <>
      <FormLabel
        required={required}
        label={label}
        smLabel={smLabel}
        info={info}
        isFocused={isFocused}
      />
      <Box
        className={styles.wrapper}
        mb={2}
        sx={{
          "& .css-13duu6p-control:hover": {
            borderColor: "#b3fda8 !important",
          },
        }}
      >
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
            render={({ field, fieldState: { error } }) => (
              <>
                <Selector
                  required
                  options={options || []}
                  defaultValue={options.find(
                    (o) => o.value === field?.value?.value
                  )}
                  value={options.find((o) => o.value === field.value)}
                  isSearchable={true}
                  styles={{ ...customStyles }}
                  placeholder={placeholder || "Seleccionar"}
                  noOptionsMessage={() => "No hay opciones que coincidan"}
                  onChange={(e) => {
                    if (e) {
                      field.onChange({ ...e, type: "sheetsDataBase" });
                    }
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </>
            )}
          />
        )}
      </Box>
      <Box className="red" mt={-2} mb={2} ml={1} width="100%" textAlign="left">
        {error?.message && error.message}
        {serverError && (
          <Typography>
            En este momento no se pudieron cargar las opciones, por favor
            intentelo mas tarde.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default FormServerOptions;
