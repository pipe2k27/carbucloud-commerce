"use client";

import { commonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useAtomValue } from "jotai";
import * as React from "react";
import ConfirmationModal from "../Modals/global/confimation-modal.client";
import WhatsappModal from "../Modals/transformation/new-contact-modal.client";

export const CommonComponentsProvider: React.FC<any> = () => {
  const commonComponentsState = useAtomValue(commonComponentAtom);

  return (
    <>
      {commonComponentsState.confirmModal.show && <ConfirmationModal />}
      {commonComponentsState.showWhatsappModal && <WhatsappModal />}
    </>
  );
};
