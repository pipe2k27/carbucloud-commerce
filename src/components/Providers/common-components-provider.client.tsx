"use client";

import { commonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useAtomValue, useSetAtom } from "jotai";
import * as React from "react";
import ConfirmationModal from "../Modals/global/confimation-modal.client";
import WhatsappModal from "../Modals/transformation/new-contact-modal.client";
import AppointmentModal from "../Modals/transformation/appointment-modal.client";
import { sellerTypeAtom } from "@/jotai/seller-type-atom.jotai";

export const CommonComponentsProvider: React.FC<any> = ({ sellerType }) => {
  const commonComponentsState = useAtomValue(commonComponentAtom);
  const setSellerType = useSetAtom(sellerTypeAtom);

  React.useEffect(() => {
    setSellerType({
      sellerType,
    });
  }, [sellerType, setSellerType]);

  return (
    <>
      {commonComponentsState.confirmModal.show && <ConfirmationModal />}
      {commonComponentsState.showWhatsappModal && <WhatsappModal />}
      {commonComponentsState.showAppointmentModal && <AppointmentModal />}
    </>
  );
};
