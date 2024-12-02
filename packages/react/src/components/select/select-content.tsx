import { PopoverContent, type PopoverContentProps } from "@/components/popover";
import { useSelectContext } from "@/components/select/select-context";
import { forwardRef } from "react";

export interface SelectContentProps extends PopoverContentProps {}

export const SelectContentBase = forwardRef<HTMLDivElement, SelectContentProps>(
    function SelectContent(props, ref) {
        const { children, ...rest } = props;

        const { getContentProps } = useSelectContext();

        return <PopoverContent {...getContentProps(rest, ref)}>{children}</PopoverContent>;
    }
);

SelectContentBase.displayName = "SelectContent";
