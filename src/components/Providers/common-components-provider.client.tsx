"use client";

import { commonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useAtomValue } from "jotai";
import * as React from "react";
import NewCarModal from "../Modals/creation/new-car-modal.client";
import EditCarModal from "../Modals/editiing/edit-car-modal.client";
import EditCarImagesModal from "../Modals/image-upload/edit-car-images-modal.client";
import NewPurchaseModal from "../Modals/creation/new-purchase-modal.client";
import EditPurchaseModal from "../Modals/editiing/edit-purchase-modal.client";
import PurchaseToStockModal from "../Modals/transformation/purchase-to-stock-modal.client";
import CarToSaleModal from "../Modals/transformation/car-to-sale-modal.client";
import ConfirmationModal from "../Modals/global/confimation-modal.client";
import EditPurchaseImagesModal from "../Modals/image-upload/edit-purchase-images-modal.client";

export const CommonComponentsProvider: React.FC<any> = () => {
  const commonComponentsState = useAtomValue(commonComponentAtom);

  return (
    <>
      {commonComponentsState.showNewCarModal && <NewCarModal />}
      {commonComponentsState.showEditCarModal && <EditCarModal />}
      {commonComponentsState.showEditCarImagesModal && <EditCarImagesModal />}
      {commonComponentsState.showNewCarPurchaseModal && <NewPurchaseModal />}
      {commonComponentsState.showEditPurchaseModal && <EditPurchaseModal />}
      {commonComponentsState.showPurchaseToStockModal && (
        <PurchaseToStockModal />
      )}
      {commonComponentsState.showCarToSaleModal && <CarToSaleModal />}
      {commonComponentsState.confirmModal.show && <ConfirmationModal />}
      {commonComponentsState.showEditPurchaseImages && (
        <EditPurchaseImagesModal />
      )}
    </>
  );
};
