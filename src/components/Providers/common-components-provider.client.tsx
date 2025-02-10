"use client";

import { commonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { useAtomValue } from "jotai";
import * as React from "react";
import NewCarModal from "../Modals/new-car-modal.client";
import EditCarImagesModal from "../Modals/edit-car-images-modal.client";

export const CommonComponentsProvider: React.FC<any> = () => {
  const commonComponentsState = useAtomValue(commonComponentAtom);

  return (
    <>
      {commonComponentsState.showNewCarModal && <NewCarModal />}
      {commonComponentsState.showEditCarImagesModal && <EditCarImagesModal />}
    </>
  );
};
