"use client";

import { commonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useAtomValue } from "jotai";
import * as React from "react";
import NewCarModal from "../Modals/new-car-modal.client";
import EditCarImagesModal from "../Modals/edit-car-images-modal.client";
import EditCarModal from "../Modals/edit-car-modal.client";
import NewPurchaseModal from "../Modals/new-purchase-modal.client";
import EditPurchaseModal from "../Modals/edit-purchase-modal.client";
import ConfirmationModal from "../Modals/confimation-modal.client";
import EditPurchaseImagesModal from "../Modals/edit-purchase-images.client";

export const CommonComponentsProvider: React.FC<any> = () => {
  const commonComponentsState = useAtomValue(commonComponentAtom);

  return (
    <>
      {commonComponentsState.showNewCarModal && <NewCarModal />}
      {commonComponentsState.showEditCarModal && <EditCarModal />}
      {commonComponentsState.showEditCarImagesModal && <EditCarImagesModal />}
      {commonComponentsState.showNewCarPurchaseModal && <NewPurchaseModal />}
      {commonComponentsState.showEditPurchaseModal && <EditPurchaseModal />}
      {commonComponentsState.confirmModal.show && <ConfirmationModal />}
      {commonComponentsState.showEditPurchaseImages && (
        <EditPurchaseImagesModal />
      )}
    </>
  );
};
