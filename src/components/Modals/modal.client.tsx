"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resetCommonComponentAtom } from "@/jotai/common-components-atom.jotai";
import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      resetCommonComponentAtom();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="max-h-[82vh] overflow-y-auto pr-4 -mr-4 pl-2 -ml-2">
          {children}
          {footer && <DialogFooter className="mt-6">{footer}</DialogFooter>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
