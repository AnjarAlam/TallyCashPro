"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, type ReactElement } from "react";

// Define a type for the props that children passed to AlertModalLayout might receive
interface ModalChildProps {
  onClose?: () => void;
}

export default function AlertModalLayout({
  trigger,
  children,
}: {
  trigger: ReactElement;
  // Children is now expected to be a single ReactElement that can accept ModalChildProps
  children: ReactElement<ModalChildProps>;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Clone the child element and inject the onClose prop
  const childrenWithProps = React.cloneElement(children, {
    onClose: handleClose,
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-transparent p-0 border-none shadow-none">
        {/* <AlertDialogTitle /> */}
        {childrenWithProps}
      </AlertDialogContent>
    </AlertDialog>
  );
}
