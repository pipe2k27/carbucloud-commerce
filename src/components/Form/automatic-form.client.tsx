import React from "react";
import FormSelect, { Option } from "./form-select.client";
import FormInput from "./form-input.client";
import FormNumber from "./form-number.client";
import FormTextArea from "./form-text-area.client";

export type Field = {
  name: string;
  label: string;
  type?:
    | "number"
    | "options"
    | "checkbox"
    | "text"
    | "textarea"
    | "email"
    | "date"
    | "plainDate";
  required?: boolean;
  options?: Option[];
  checkboxOptions?: string[];
  validation?: any;
  depndency?: {
    field: string;
    value: string;
  };
};

type Props = {
  control: any;
  fields: Field[];
  dualColumn?: boolean;
  watch?: any;
};

const FormFields = ({ control, field }: any) => {
  if (field.type === "options" && field.options) {
    return (
      <FormSelect
        key={field.name}
        options={field.options}
        control={control}
        label={field.label}
        name={field.name}
        required={field.required || false}
        //   isInvalid={errors && errors[field.name]}
      />
    );
  }
  if (field.type === "number") {
    return (
      <FormNumber
        key={field.name}
        control={control}
        label={field.label}
        name={field.name}
        required={field.required || false}
        //   isInvalid={errors && errors[field.name]}
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <FormTextArea
        key={field.name}
        control={control}
        label={field.label}
        name={field.name}
        required={field.required || false}
        //   isInvalid={errors && errors[field.name]}
      />
    );
  }

  return (
    <FormInput
      control={control}
      key={field.name}
      label={field.label}
      name={field.name}
      required={field.required || false}
      rules={field.validation}
    />
  );
};

const AutomaticForm: React.FC<Props> = ({
  control,
  fields,
  dualColumn,
  watch,
}) => {
  const renderUponDependency = (field: Field) => {
    if (field.depndency) {
      return watch(field.depndency.field) === field.depndency.value;
    }
    return false;
  };

  // test
  return (
    <div
      className={`w-full flex-col space-y-6 ${
        dualColumn ? "md:grid md:grid-cols-2 md:space-y-0 md:gap-x-8" : ""
      }`}
    >
      {fields.map((field: Field) => {
        if (watch && field.depndency && !renderUponDependency(field)) {
          return null;
        }
        return (
          <div
            key={field.name}
            className={`${dualColumn ? "md:h-[100px]" : ""}`}
          >
            <FormFields key={field.name} control={control} field={field} />
          </div>
        );
      })}
    </div>
  );
};

export default AutomaticForm;
