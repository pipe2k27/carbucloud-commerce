"use client";

import { Button } from "../ui/button";
import Modal from "./modal.client";
import {
  commonComponentAtom,
  resetCommonComponentAtom,
} from "@/jotai/common-components-atom.jotai";
import { useAtomValue } from "jotai";

const ConfirmationModal = () => {
  const { onConfirm, title, description } =
    useAtomValue(commonComponentAtom).confirmModal;

  return (
    <Modal
      isOpen
      title={title || "Confirmar acción"}
      description={description || "No se podrán deshacer los cambios"}
      footer={
        <div className="flex justify-end space-x-4">
          <Button variant="ghost" onClick={resetCommonComponentAtom}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Si estoy seguro</Button>
        </div>
      }
    ></Modal>
  );
};

export default ConfirmationModal;
