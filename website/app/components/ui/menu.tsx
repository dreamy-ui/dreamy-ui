"use client";

import {
    MenuDescendantsProvider,
    MenuProvider,
    type UseMenuItemProps,
    type UseMenuProps,
    runIfFn,
    useActionKey,
    useMenu,
    useMenuContext,
    useMenuItem
} from "@dreamy-ui/react";
import { Children, type ReactNode, cloneElement, forwardRef } from "react";
import { createStyleContext } from "styled-system/jsx";
import { menu } from "styled-system/recipes";
import { Box } from "./box";
import { type HTMLDreamyProps, dreamy } from "./factory";
import { Kbd } from "./kbd";
import { Popover, type PopoverContentProps, type PopoverProps } from "./popover";

const { withProvider, withContext } = createStyleContext(menu);

export interface MenuProps extends UseMenuProps<PopoverProps> {
    /**
     * The placement of the menu.
     * @default "bottom"
     */
    placement?: PopoverProps["placement"];
    children?: ReactNode;
    className?: string;
}

/**
 * Menu component
 *
 * @See Docs https://dreamy-ui.com/docs/components/menu
 */
const MenuRoot = withProvider(function MenuRoot({
    children,
    className,
    placement,
    ...props
}: MenuProps) {
    const { rest, ...ctx } = useMenu(props);

    return (
        <MenuProvider value={ctx as any}>
            <Box {...ctx.getRootProps({ className })}>
                <Popover.Root
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
                </Popover.Root>
            </Box>
        </MenuProvider>
    );
}, "root");

export interface MenuContentProps extends PopoverContentProps {}

const MenuContent = withContext(
    forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(props, ref) {
        const { children, ...rest } = props;

        const { getContentProps, descendants } = useMenuContext();

        return (
            <Popover.Content {...getContentProps(rest, ref)}>
                <MenuDescendantsProvider value={descendants}>{children}</MenuDescendantsProvider>
            </Popover.Content>
        );
    }),
    "content"
);

export interface MenuButtonProps extends UseMenuItemProps {
    /**
     * Icon to display on the left side of the menu item
     */
    icon?: React.ReactNode | React.ElementType;
    /**
     * Command to display on the right side of the menu item
     */
    command?: string;
    /**
     * The content to display on the right side of the menu item
     */
    rightContent?: React.ReactNode | React.ElementType;
}

const MenuItem = withContext(
    forwardRef<HTMLDivElement, MenuButtonProps>(function MenuButton(props, ref) {
        const { icon, command, rightContent, ...rest } = props;
        console.log("menu button");
        const buttonProps = useMenuItem(rest, ref);

        const actionKey = useActionKey();

        return (
            <dreamy.button {...(buttonProps as any)}>
                <span>
                    {runIfFn(icon as any)}
                    {buttonProps.children}
                </span>
                {command && <Kbd size={"sm"}>{command.replaceAll("{actionKey}", actionKey)}</Kbd>}
                {rightContent && runIfFn(rightContent as any)}
            </dreamy.button>
        );
    }),
    "item"
);

export interface MenuTriggerProps extends HTMLDreamyProps<"button"> {
    placeholder?: string;
}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger(
    { children, placeholder, ...rest },
    ref
) {
    const { getTriggerProps } = useMenuContext();

    const child = Children.only(children) as any;
    const trigger = cloneElement(child, getTriggerProps(rest, ref));

    return <Popover.Trigger {...rest}>{trigger}</Popover.Trigger>;
});

export namespace Menu {
    export const Root = MenuRoot;
    export const Content = MenuContent;
    export const Item = MenuItem;
    export const Trigger = MenuTrigger;
}
