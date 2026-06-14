"use client";

import {
    MenuDescendantsProvider,
    MenuProvider,
    type UseMenuItemProps,
    type UseMenuProps,
    callAllHandlers,
    runIfFn,
    useActionKey,
    useMenu,
    useMenuContext,
    useMenuItem
} from "@dreamy-ui/react";
import {
    Children,
    type ReactElement,
    type ReactNode,
    cloneElement,
    forwardRef,
    useEffect
} from "react";
import { BiChevronRight } from "react-icons/bi";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { menu } from "styled-system/recipes";
import { Box } from "./box";
import { Kbd } from "./kbd";
import {
    Anchor as PopoverAnchor,
    Content as PopoverContent,
    type PopoverContentProps,
    type PopoverProps,
    Root as PopoverRoot,
    Trigger as PopoverTrigger
} from "./popover";

function mergeRefs<T>(...refs: (React.Ref<T> | undefined | null)[]): React.RefCallback<T> {
    return (value: T | null) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}

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

export interface MenuButtonProps extends HTMLDreamyProps<"button"> {
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
    /**
     * Children to render in the menu item
     */
    children?: React.ReactNode;
}

export const Item = withContext(
    forwardRef<HTMLButtonElement, MenuButtonProps>(function MenuButton(props, ref) {
        const { icon, command, rightContent, children, ...rest } = props;

        const buttonProps = useMenuItem(rest, ref);
        const actionKey = useActionKey();

        return (
            <dreamy.button {...buttonProps}>
                <span>
                    {runIfFn(icon)}
                    {children}
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

export interface MenuTriggerItemProps extends Omit<MenuButtonProps, "children"> {
    /**
     * The placement of the sub-menu.
     * @default "right-start"
     */
    placement?: PopoverProps["placement"];
    /**
     * The label to display inside the trigger button.
     */
    label?: React.ReactNode;
    /**
     * The sub-menu content. Should contain a `Menu.Content` component.
     */
    children?: React.ReactNode;
}

/**
 * A menu item that opens a nested sub-menu when clicked.
 * It is registered as a regular item in the parent menu's keyboard navigation.
 *
 * Usage:
 * ```tsx
 * <Menu.TriggerItem label="More options" placement="right-start">
 *   <Menu.Content>
 *     <Menu.Item>Sub item</Menu.Item>
 *   </Menu.Content>
 * </Menu.TriggerItem>
 * ```
 */
export const TriggerItem = withContext(
    forwardRef<HTMLButtonElement, MenuTriggerItemProps>(function MenuTriggerItem(props, ref) {
        const {
            icon,
            command,
            rightContent,
            label,
            children,
            placement = "right-start",
            onClick: userOnClick,
            ...rest
        } = props;

        // All hooks below read from the PARENT menu context (called before any nested context
        // is rendered), so this button is correctly registered in the parent menu's descendants
        // list and participates in its keyboard navigation (ArrowUp/Down/Enter).
        const { isOpen: parentIsOpen, triggerRef: parentTriggerRef } = useMenuContext();
        const buttonProps = useMenuItem(rest, ref);
        const actionKey = useActionKey();

        const { rest: _unused, ...nestedCtx } = useMenu({});
        const { onKeyDown: nestedOnKeyDown } = nestedCtx.getTriggerProps();

        // Close nested menu when the parent menu closes.
        useEffect(() => {
            if (!parentIsOpen) nestedCtx.onClose();
        }, [parentIsOpen, nestedCtx.onClose]);

        // Close nested menu when this item loses virtual focus in the parent menu
        // (e.g. user navigates to a different item with ArrowDown).
        const isFocusedAttr = (buttonProps as any)["data-focused"];
        useEffect(() => {
            if (isFocusedAttr === undefined) nestedCtx.onClose();
        }, [isFocusedAttr, nestedCtx.onClose]);

        // ArrowRight while this item is virtually focused opens the sub-menu. The real DOM focus
        // is on the parent trigger at this point, so we listen at the document level.
        useEffect(() => {
            function handleArrowRight(e: KeyboardEvent) {
                if (e.key !== "ArrowRight") return;
                const btn = nestedCtx.triggerRef.current;
                if (!btn?.hasAttribute("data-focused")) return;
                e.preventDefault();
                nestedCtx.onOpen();
            }
            document.addEventListener("keydown", handleArrowRight);
            return () => document.removeEventListener("keydown", handleArrowRight);
        }, [nestedCtx.triggerRef, nestedCtx.onOpen]);

        // ArrowLeft or Escape while the sub-menu is open closes it and returns real DOM
        // focus to the parent menu trigger so ArrowUp/Down navigation continues there.
        function handleButtonKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
            if (!nestedCtx.isOpen) return;
            if (e.key === "ArrowLeft" || e.key === "Escape") {
                e.preventDefault();
                nestedCtx.onClose();
                parentTriggerRef.current?.focus();
            }
        }

        return (
            <MenuProvider value={nestedCtx}>
                {/*
                 * returnFocusOnClose={false} so we control focus ourselves — when the sub-menu
                 * closes via ArrowLeft/Escape we focus the parent trigger, not the button.
                 * initialFocusRef={nestedCtx.triggerRef} moves DOM focus to this button when
                 * the sub-menu opens (via ArrowRight or click), enabling nested keyboard nav.
                 */}
                <PopoverRoot
                    hasArrow={false}
                    initialFocusRef={nestedCtx.triggerRef}
                    isOpen={nestedCtx.isOpen}
                    lazyBehavior="keepMounted"
                    onClose={nestedCtx.onClose}
                    onOpen={nestedCtx.onOpen}
                    placement={placement}
                    reduceMotion={nestedCtx.reduceMotion}
                    returnFocusOnClose={false}
                >
                    <PopoverAnchor>
                        <dreamy.button
                            {...buttonProps}
                            ref={mergeRefs(buttonProps.ref, nestedCtx.triggerRef)}
                            onClick={callAllHandlers(userOnClick as any, nestedCtx.onToggle)}
                            onKeyDown={callAllHandlers(
                                buttonProps.onKeyDown as any,
                                nestedOnKeyDown as any,
                                handleButtonKeyDown as any
                            )}
                            onPointerEnter={callAllHandlers(
                                buttonProps.onPointerEnter as any,
                                nestedCtx.onOpen
                            )}
                        >
                            <span>
                                {runIfFn(icon)}
                                {label}
                            </span>
                            {command && (
                                <Kbd size={"sm"}>
                                    {command.replaceAll("{actionKey}", actionKey)}
                                </Kbd>
                            )}
                            {rightContent && runIfFn(rightContent)}
                            <BiChevronRight />
                        </dreamy.button>
                    </PopoverAnchor>
                    {children}
                </PopoverRoot>
            </MenuProvider>
        );
    }),
    "item"
);
