import { CloseButton, type CloseButtonProps } from "@/components/button";
import { useModalContext } from "@/components/modal/modal-root";
import { forwardRef } from "react";

export interface ModalCloseButtonProps extends CloseButtonProps {}

export const ModalCloseButtonBase = forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
    ({ ...props }, ref) => {
        const { onClose } = useModalContext();

        return <CloseButton ref={ref} onClick={onClose} {...props} />;
    }
);
