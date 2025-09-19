"use client";
import AutomaticForm, { Field } from "@/components/Form/automatic-form.client";
import AppearDiv from "@/components/ui/appear-div";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Purchase } from "@/dynamo-db/purchases.db";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  form: Field[];
  schema: any;
  onSubmit?: any;
  isLoading?: boolean;
};

const SellerForm: React.FC<Props> = ({ form, schema, onSubmit, isLoading }) => {
  const defaultValues = form.reduce((acc: any, field: any) => {
    acc[field.name] = "";
    return acc;
  }, {} as Partial<Purchase>);

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = (data: any) => {
    if (onSubmit) onSubmit(data);
  };

  return (
    <AppearDiv>
      <AutomaticForm watch={watch} fields={form} control={control} />
      <Button
        variant="secondary"
        className="w-full mt-8"
        onClick={handleSubmit(submit)}
        disabled={isLoading}
      >
        {!isLoading && (
          <>
            Siguiente <ArrowRight />
          </>
        )}
        {isLoading && (
          <div className="scale-90 translate-y-1">
            <Spinner />
          </div>
        )}
      </Button>
      {/* Add your form fields here */}
    </AppearDiv>
  );
};
export default SellerForm;
