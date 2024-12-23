import { PopoverContent, type PopoverContentProps } from "@/components/popover";
import { forwardRef } from "react";
import { useMenuContext } from "./menu-context";

export interface MenuContentProps extends PopoverContentProps {}

export const MenuContentBase = forwardRef<HTMLDivElement, MenuContentProps>(
    function MenuContent(props, ref) {
        const { children, ...rest } = props;

        const { getContentProps } = useMenuContext();

        return <PopoverContent {...getContentProps(rest, ref)}>{children}</PopoverContent>;
    }
);

MenuContentBase.displayName = "MenuContent";
