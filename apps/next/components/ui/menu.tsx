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
import { Children, type ReactElement, type ReactNode, cloneElement, forwardRef } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { menu } from "styled-system/recipes";
import { Box } from "./box";
import { Kbd } from "./kbd";
import {
    Content as PopoverContent,
    type PopoverContentProps,
    type PopoverProps,
    Root as PopoverRoot,
    Trigger as PopoverTrigger
} from "./popover";

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
export const Root = withProvider(function MenuRoot({
    children,
    className,
    placement,
    ...props
}: MenuProps) {
    const { rest, ...ctx } = useMenu(props);

    return (
        <MenuProvider value={ctx}>
            <Box {...ctx.getRootProps({ className })}>
                <PopoverRoot
                    hasArrow={false}
                    initialFocusRef={ctx.triggerRef}
                    isOpen={ctx.isOpen}
                    lazyBehavior="keepMounted"
                    onClose={ctx.onClose}
                    onOpen={ctx.onOpen}
                    placement={placement ?? "bottom"}
                    reduceMotion={ctx.reduceMotion}
                    {...props.popoverProps}
                >
                    {children}
                </PopoverRoot>
            </Box>
        </MenuProvider>
    );
}, "root");

export interface MenuContentProps extends PopoverContentProps {}

export const Content = withContext(
    forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(props, ref) {
        const { children, ...rest } = props;

        const { getContentProps, descendants } = useMenuContext();

        return (
            <PopoverContent {...getContentProps(rest, ref)}>
                <MenuDescendantsProvider value={descendants}>{children}</MenuDescendantsProvider>
            </PopoverContent>
        );
    }),
    "content"
);

export interface MenuButtonProps extends UseMenuItemProps {
    /**
     * Icon to display on the left side of the menu item
     */
    icon?: React.ReactNode | (() => React.ReactNode);
    /**
     * Command to display on the right side of the menu item
     */
    command?: string;
    /**
     * The content to display on the right side of the menu item
     */
    rightContent?: React.ReactNode | (() => React.ReactNode);
}

export const Item = withContext(
    forwardRef<HTMLButtonElement, MenuButtonProps>(function MenuButton(props, ref) {
        const { icon, command, rightContent, ...rest } = props;

        const buttonProps = useMenuItem(rest, ref);
        const actionKey = useActionKey();

        return (
            <dreamy.button {...buttonProps}>
                <span>
                    {runIfFn(icon)}
                    {buttonProps.children}
                </span>
                {command && <Kbd size={"sm"}>{command.replaceAll("{actionKey}", actionKey)}</Kbd>}
                {rightContent && runIfFn(rightContent)}
            </dreamy.button>
        );
    }),
    "item"
);

export interface MenuTriggerProps extends HTMLDreamyProps<"button"> {
    placeholder?: string;
}

export const Trigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger(
    { children, placeholder, ...rest },
    ref
) {
    const { getTriggerProps } = useMenuContext();

    const child = Children.only(children) as ReactElement;
    const trigger = cloneElement(child, getTriggerProps(rest, ref));

    return <PopoverTrigger {...rest}>{trigger}</PopoverTrigger>;
});
