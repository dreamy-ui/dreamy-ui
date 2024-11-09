import { CloseButton, type CloseButtonProps } from "@/components/button";
import { usePopoverContext } from "@/components/popover/popover-context";
import { callAllHandlers } from "@/utils";
import { forwardRef } from "react";

export interface PopoverCloseButtonProps extends CloseButtonProps {}

export const PopoverCloseButtonBase = forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(
    function PopoverCloseButton(props, ref) {
        const { onClose } = usePopoverContext();

        return (
            <CloseButton {...props} onClick={callAllHandlers(props.onClick, onClose)} ref={ref} />
        );
    }
);

PopoverCloseButtonBase.displayName = "PopoverCloseButton";
