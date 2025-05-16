"use client";
import AutomaticForm, { Field } from "@/components/Form/automatic-form.client";
import AppearDiv from "@/components/ui/appear-div";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  form: Field[];
  schema: any;
  setCurrentForm: any;
};

const SellerForm: React.FC<Props> = ({ form, schema, setCurrentForm }) => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setCurrentForm((prev: number) => prev + 1);
  };

  return (
    <AppearDiv>
      <AutomaticForm fields={form} control={control} />
      <Button
        variant="secondary"
        className="w-full mt-8"
        onClick={handleSubmit(onSubmit)}
      >
        Siguiente <ArrowRight />
      </Button>
      {/* Add your form fields here */}
    </AppearDiv>
  );
};
export default SellerForm;
