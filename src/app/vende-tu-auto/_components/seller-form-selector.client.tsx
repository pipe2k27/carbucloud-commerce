"use client";
import { sellerFrom, sellerSchemas } from "@/utils/purchase-form";
import React, { useEffect, useState } from "react";
import SellerForm from "./seller-form.client";
import AppearDiv from "@/components/ui/appear-div";
import { Purchase } from "@/dynamo-db/purchases.db";
import { createPurchaseAction } from "@/service/actions/purchases.actions";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, X } from "lucide-react";
import UploadImage from "./upload-image.client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils/capitalize";
import { useSellerWord } from "@/jotai/seller-type-atom.jotai";

export function disableScroll() {
  document.body.style.overflow = "hidden";
}

export function enableScroll() {
  document.body.style.overflow = "";
}

const idsForVendemosTuAuto = ["0004"];

const SellerFormSelector = ({
  logoUrl,
  companyId,
}: {
  logoUrl?: string;
  companyId?: string;
}) => {
  const [currentForm, setCurrentForm] = useState<number>(0);
  const [currentFormData, setCurrentFormData] = useState<Partial<Purchase>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const sellerWord = useSellerWord();

  const message = idsForVendemosTuAuto.includes(companyId || "0000")
    ? "Vendemos tu Vehículo"
    : "Compramos tu Vehículo";

  const { toast } = useToast();

  useEffect(() => {
    disableScroll();
    return () => enableScroll(); // Re-enable scroll on unmount
  }, []);

  const router = useRouter();

  const onSubmit = async (data: Partial<Purchase>) => {
    if (currentForm < 3) {
      setCurrentFormData((prev) => ({ ...prev, ...data }));
      setCurrentForm((prev) => prev + 1);
    } else {
      try {
        setIsLoading(true);
        const newFormData = { ...currentFormData, ...data };
        const res = await createPurchaseAction(newFormData);
        if (res.status !== 200 || !res.data?.productId) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Inténtelo mas tarde.",
          });
          return;
        }
        setProductId(res.data.productId);
        setCurrentForm((prev) => prev + 1);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Inténtelo mas tarde.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex z-50 fixed top-0 left-0 bg-background   items-center justify-center w-[100vw] h-[100vh]">
      <X
        className="absolute top-4 right-4 text-muted-foreground cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      />
      <AppearDiv>
        <div className="w-[90vw] max-w-[600px] min-h-[600px] pt-20 md:pt-0">
          {currentForm < 4 && (
            <>
              <h1 className="font-semibold text-xl">{message}</h1>
              <div className="mb-8 text-muted-foreground">
                Respondé las siguientes preguntas y recibí una cotización en
                menos de 24hs
              </div>
            </>
          )}
          {currentForm === 0 && (
            <SellerForm
              schema={sellerSchemas[0]}
              form={sellerFrom[0]}
              onSubmit={onSubmit}
            />
          )}

          {currentForm === 1 && (
            <SellerForm
              schema={sellerSchemas[1]}
              form={sellerFrom[1]}
              onSubmit={onSubmit}
            />
          )}

          {currentForm === 2 && (
            <SellerForm
              schema={sellerSchemas[2]}
              form={sellerFrom[2]}
              onSubmit={onSubmit}
            />
          )}

          {currentForm === 3 && (
            <SellerForm
              schema={sellerSchemas[3]}
              form={sellerFrom[3]}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          )}
          {currentForm === 4 && productId && (
            <div className="w-full">
              <h1 className="font-semibold text-xl">
                Cargá una foto de tu {capitalize(sellerWord)}
              </h1>
              <div className="mb-2 text-muted-foreground">
                En la que se vea bien el modelo y el estado del vehículo
              </div>
              <div className="w-full flex items-start justify-start mb-2">
                <UploadImage
                  onUpload={() => {
                    setCurrentForm((prev) => prev + 1);
                  }}
                  productId={productId}
                />
              </div>
              <Button variant="secondary" disabled className="w-full mt-0">
                Finalizar <CheckCircle className="ml-1" />
              </Button>
            </div>
          )}
          {currentForm === 5 && (
            <div className="w-full">
              <CheckCircle className="text-green-300 w-12 h-12 my-4" />
              <h1 className="font-semibold text-xl">¡Listo!</h1>
              <div className="mb-8 text-muted-foreground">
                Te contactaremos en menos de 24hs
              </div>
              <div className="w-full flex justify-center items-center"></div>
              <Button
                onClick={() => {
                  router.push("/");
                }}
                variant="secondary"
                className="w-full mt-12"
              >
                Volver a la web
              </Button>
            </div>
          )}
          {currentForm < 4 && (
            <div className="w-full text-center mt-2 md:mt-8 text-muted-foreground opacity-60">
              {currentForm + 1}/4
            </div>
          )}
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="mx-auto mt-8 md:mt-24 w-36 md:w-48 grayscale opacity-20"
              src={logoUrl}
              alt="Logo"
            />
          )}
        </div>
      </AppearDiv>
    </div>
  );
};
export default SellerFormSelector;
