import React, { useState } from "react";
import styles from "./MultipleOtions.module.css";
import FormLabel from "./form-label.client";
import FromCheckboxOption from "./FormCheckboxOption";
import InvisibleFormInput from "./invisibleFormInput";

type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  name: string;
  control: any;
  label?: string;
  smLabel?: boolean;
  info?: string[] | "";
  required?: boolean;
};

const FormMultipleOptions: React.FC<Props> = ({
  options,
  name,
  control,
  label,
  smLabel,
  info,
  required,
}) => {
  const [isParentFocused, setIsParentFocused] = useState(false);
  //this state checks wether answers are already set to previous answers or not

  // this sets redux and session state answers

  //this method handles clicks

  return (
    <div>
      <FormLabel
        required={required}
        label={label}
        smLabel={smLabel}
        info={info}
        isFocused={isParentFocused}
      />
      <InvisibleFormInput
        name={`${name}.type`}
        defaultValue="multipleOptions"
        control={control}
      />
      {options.map((option: Option) => {
        return (
          <FromCheckboxOption
            label={option.label}
            name={`${name}.${option.value}`}
            control={control}
            setIsParentFocused={setIsParentFocused}
            key={option.value}
          />
        );
      })}
    </div>
  );
};

export default FormMultipleOptions;
