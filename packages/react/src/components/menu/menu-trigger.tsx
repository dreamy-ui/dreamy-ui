import { PopoverTrigger } from "@/components/popover";
import type { HTMLDreamProps } from "@/utils/types";
import React, { forwardRef } from "react";
import { useMenuContext } from "./menu-context";

export interface MenuTriggerProps extends HTMLDreamProps<"button"> {
    placeholder?: string;
}

export const MenuTriggerBase = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger(
    { children, placeholder, ...rest },
    ref
) {
    const { getTriggerProps } = useMenuContext();

    const child = React.Children.only(children) as any;
    const trigger = React.cloneElement(child, getTriggerProps(rest, ref));

    return <PopoverTrigger {...rest}>{trigger}</PopoverTrigger>;
});

MenuTriggerBase.displayName = "MenuTrigger";
