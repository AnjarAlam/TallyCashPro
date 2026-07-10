"use client";

import React, { useState, type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Children can optionally receive onClose
interface ModalChildProps {
  onClose?: () => void;
}

interface ModalLayoutProps {
  trigger: ReactElement;
  children: ReactElement<ModalChildProps>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ModalLayout({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
}: ModalLayoutProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange! : setUncontrolledOpen;

  const handleClose = () => {
    setOpen(false);
  };

  const childrenWithProps = React.cloneElement(children, {
    onClose: handleClose,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-transparent p-0 border-none shadow-none"
      >
        <DialogTitle />
        {childrenWithProps}
      </DialogContent>
    </Dialog>
  );
}
