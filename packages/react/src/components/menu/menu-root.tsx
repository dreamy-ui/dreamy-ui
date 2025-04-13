import { Popover, type PopoverProps } from "@/components/popover";

import { Box } from "@/rsc";
import type { ReactNode } from "react";
import { MenuProvider } from "./menu-context";
import { type UseMenuProps, useMenu } from "./use-menu";

export interface MenuProps extends UseMenuProps {
    /**
     * The placement of the menu.
     * @default "bottom"
     */
    placement?: PopoverProps["placement"];
    children?: ReactNode;
    className?: string;
}

export function MenuRoot({ children, className, placement, ...props }: MenuProps) {
    const { rest, ...ctx } = useMenu(props);

    return (
        <MenuProvider value={ctx as any}>
            <Box {...ctx.getRootProps({ className })}>
                <Popover
                    placement={placement ?? "bottom"}
                    isOpen={ctx.isOpen}
                    onOpen={ctx.onOpen}
                    onClose={ctx.onClose}
                    hasArrow={false}
                    initialFocusRef={ctx.triggerRef}
                    lazyBehavior="keepMounted"
                    reduceMotion={ctx.reduceMotion}
                    {...props.popoverProps}
                >
                    {children}
                </Popover>
            </Box>
        </MenuProvider>
    );
}
