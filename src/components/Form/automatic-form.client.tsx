import React from "react";
import FormSelect, { Option } from "./form-select.client";
import FormInput from "./form-input.client";
import FormNumber from "./form-number.client";
import FormTextArea from "./form-text-area.client";
// import FormNumber from "./FormNumber";
// import { Stack } from "@mui/material";
// import FormDate from "./FormDate";
// import FormDatePlain from "./FormDatePlain";

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
};

type Props = {
  control: any;
  fields: Field[];
};

const AutomaticForm: React.FC<Props> = ({ control, fields }) => {
  // test
  return (
    <div className="w-full flex-col space-y-6">
      {fields.map((field: Field) => {
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
        // // if (field.type === "checkbox" && field.options) {
        // //   return (
        // //     <FormCheckbox
        // //       key={field.name}
        // //       options={field.options}
        // //       control={control}
        // //       name={field.name}
        // //       required={field.required || false}
        // //       label={field.label}
        // //     />
        // //   );
        // // }
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
        // if (field.type === "date") {
        //   return (
        //     <FormDate
        //       key={field.name}
        //       control={control}
        //       label={field.label}
        //       name={field.name}
        //       required={field.required || false}
        //       //   isInvalid={errors && errors[field.name]}
        //     />
        //   );
        // }
        // // if (field.type === "plainDate") {
        // //   return (
        // //     <FormDatePlain
        // //       key={field.name}
        // //       control={control}
        // //       label={field.label}
        // //       name={field.name}
        // //       required={field.required || false}
        // //       //   isInvalid={errors && errors[field.name]}
        // //     />
        // //   );
        // // }

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
      })}
    </div>
  );
};

export default AutomaticForm;
