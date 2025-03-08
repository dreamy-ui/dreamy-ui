import { PopoverContent, type PopoverContentProps } from "@/components/popover";
import { forwardRef } from "react";
import { useMenuContext } from "./menu-context";
import { MenuDescendantsProvider } from "./use-menu";

export interface MenuContentProps extends PopoverContentProps {}

export const MenuContentBase = forwardRef<HTMLDivElement, MenuContentProps>(
    function MenuContent(props, ref) {
        const { children, ...rest } = props;

        const { getContentProps, descendants } = useMenuContext();

        return (
            <PopoverContent {...getContentProps(rest, ref)}>
                <MenuDescendantsProvider value={descendants}>{children}</MenuDescendantsProvider>
            </PopoverContent>
        );
    }
);

MenuContentBase.displayName = "MenuContent";
