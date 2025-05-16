"use client";
import { sellerFrom, sellerSchemas } from "@/utils/purchase-form";
import React, { useState } from "react";
import SellerForm from "./seller-form.client";
import AppearDiv from "@/components/ui/appear-div";

const SellerFormSelector = ({ logoUrl }: { logoUrl?: string }) => {
  const [currentForm, setCurrentForm] = useState<number>(0);

  return (
    <div className="flex z-50 fixed top-0 left-0 bg-background items-center justify-center w-[100vw] h-[100vh]">
      <AppearDiv>
        <div className="w-[90vw] max-w-[600px]">
          <h1 className="font-semibold text-xl">Compramos tu auto</h1>
          <div className="mb-8 text-muted-foreground">
            Respondé las siguientes preguntas y recibí una cotización en menos
            de 24hs
          </div>
          {currentForm === 0 && (
            <SellerForm
              schema={sellerSchemas[0]}
              form={sellerFrom[0]}
              setCurrentForm={setCurrentForm}
            />
          )}

          {currentForm === 1 && (
            <SellerForm
              schema={sellerSchemas[1]}
              form={sellerFrom[1]}
              setCurrentForm={setCurrentForm}
            />
          )}

          {currentForm === 2 && (
            <SellerForm
              schema={sellerSchemas[2]}
              form={sellerFrom[2]}
              setCurrentForm={setCurrentForm}
            />
          )}

          {currentForm === 3 && (
            <SellerForm
              schema={sellerSchemas[3]}
              form={sellerFrom[3]}
              setCurrentForm={setCurrentForm}
            />
          )}
          <div className="w-full text-center mt-8 text-muted-foreground opacity-60">
            {currentForm + 1}/4
          </div>
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="mx-auto mt-24 w-48 grayscale opacity-20"
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
