import { dreamy } from "@/components/factory";
import { useActionKey } from "@/hooks";
import { runIfFn } from "@/utils/run-if-fn";
import type React from "react";
import { forwardRef } from "react";
import { Kbd } from "../kbd";
import { type UseMenuItemProps, useMenuItem } from "./use-menu";

export interface MenuButtonProps extends UseMenuItemProps {
    /**
     * Icon to display on the left side of the menu item
     */
    icon?: React.ReactNode | React.ElementType;
    /**
     * Command to display on the right side of the menu item
     */
    command?: string;
}

const StyledButton = dreamy.button;

export const MenuButtonBase = forwardRef<HTMLDivElement, MenuButtonProps>(
    function MenuButton(props, ref) {
        const { icon, command, ...rest } = props;
        const buttonProps = useMenuItem(rest, ref);

        const actionKey = useActionKey();

        return (
            <StyledButton {...(buttonProps as any)}>
                <span>
                    {runIfFn(icon)}
                    {buttonProps.children}
                </span>
                {command && <Kbd size={"sm"}>{command.replaceAll("{actionKey}", actionKey)}</Kbd>}
            </StyledButton>
        );
    }
);

MenuButtonBase.displayName = "MenuButton";
