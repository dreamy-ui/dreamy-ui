"use client";

import {
    Menu as ArkMenu,
    type MenuRootProps as ArkMenuRootProps,
    useMenuContext as useArkMenuContext,
    useMenuItemContext as useArkMenuItemContext
} from "@ark-ui/react/menu";
import {
    ChevronRightIcon,
    type PositioningProps,
    dataAttr,
    runIfFn,
    useActionKey,
    useControllableState,
    useReducedMotion
} from "@dreamy-ui/react";
import {
    Children,
    type ReactElement,
    type ReactNode,
    cloneElement,
    useCallback,
    useId,
    useState
} from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { MenuVariantProps } from "styled-system/recipes";
import { menu } from "styled-system/recipes";
import { Kbd } from "../kbd";
import * as Popover from "../popover";
import type { PopoverContentProps, PopoverProps } from "../popover";
import { mapPositioningProps } from "../popover/map-positioning";

const { withProvider, withContext } = createStyleContext(menu);

export interface MenuProps
    extends Omit<ArkMenuRootProps, "positioning" | "closeOnSelect" | "lazyMount" | "unmountOnExit">,
        MenuVariantProps {
    /**
     * Positioning configuration for the menu dropdown.
     * @default { placement: "bottom" }
     */
    positioning?: PositioningProps;
    /**
     * Props forwarded to the internal `Popover.Root` (portal, motion, lazyMount, etc.).
     */
    popoverProps?: Omit<PopoverProps, "positioning" | "open" | "defaultOpen" | "onOpenChange">;
    children?: ReactNode;
    className?: string;
    /**
     * Whether to close the menu when an item is activated.
     * @default true
     */
    closeOnClick?: boolean;
    /**
     * If `true`, menu open/close animations are disabled.
     */
    reduceMotion?: boolean;
}

/**
 * Menu component — accessible dropdown menu with keyboard navigation.
 *
 * @see Docs https://dreamy-ui.com/docs/components/menu
 */
export const Root = withProvider(function MenuRoot({
    children,
    className,
    positioning,
    popoverProps,
    open,
    defaultOpen,
    onOpenChange,
    closeOnClick = true,
    reduceMotion: reduceMotionProp,
    ...arkRest
}: MenuProps) {
    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;

    const [menuOpen, setMenuOpen] = useControllableState({
        value: open,
        defaultValue: defaultOpen
    });

    const handleOpenChange = useCallback(
        (details: Parameters<NonNullable<ArkMenuRootProps["onOpenChange"]>>[0]) => {
            setMenuOpen(details.open);
            onOpenChange?.(details);
        },
        [onOpenChange, setMenuOpen]
    );

    const popoverPositioning = mapPositioningProps({ placement: "bottom", ...positioning });

    const arkRootProps: ArkMenuRootProps = {
        ...arkRest,
        closeOnSelect: closeOnClick,
        lazyMount: popoverProps?.lazyMount ?? true,
        onOpenChange: handleOpenChange,
        open: menuOpen,
        unmountOnExit: false
    };

    return (
        <ArkMenu.Root
            {...arkRootProps}
            data-slot="root"
        >
            <Popover.Root
                {...popoverProps}
                autoFocus={false}
                closeOnEscape={false}
                closeOnInteractOutside={false}
                open={menuOpen}
                onOpenChange={handleOpenChange}
                portalProps={{
                    zIndex: "var(--z-index-dropdown)",
                    ...popoverProps?.portalProps
                }}
                positioning={popoverPositioning as PositioningProps}
                reduceMotion={reduceMotion}
                restoreFocus={false}
            >
                {children}
            </Popover.Root>
        </ArkMenu.Root>
    );
}, "root");

export interface MenuContentProps extends Omit<PopoverContentProps, "children" | "transition"> {
    children?: ReactNode;
}

/**
 * Menu Content — dropdown panel containing menu items.
 */
export const Content = withContext(function MenuContent(props: MenuContentProps) {
    const { children, rootProps, motionProps, ...contentProps } = props;

    return (
        <Popover.Content
            motionProps={motionProps}
            rootProps={rootProps}
            {...contentProps}
        >
            <ArkMenu.Content>{children}</ArkMenu.Content>
        </Popover.Content>
    );
}, "content");

export interface MenuButtonProps extends HTMLDreamyProps<"button"> {
    icon?: React.ReactNode | (() => React.ReactNode);
    command?: string;
    rightContent?: React.ReactNode | (() => React.ReactNode);
    children?: React.ReactNode;
    isDisabled?: boolean;
}

/**
 * Menu Item — actionable option within the menu.
 */
function MenuItemButton({
    icon,
    command,
    rightContent,
    children,
    isDisabled,
    disabled,
    ...rest
}: MenuButtonProps) {
    const actionKey = useActionKey();
    const isItemDisabled = isDisabled || disabled;
    const { highlighted } = useArkMenuItemContext();

    return (
        <dreamy.button
            data-focused={dataAttr(highlighted)}
            data-highlighted={dataAttr(highlighted)}
            disabled={isItemDisabled}
            type="button"
            {...rest}
        >
            <span>
                {runIfFn(icon)}
                {children}
            </span>
            {command && <Kbd size="sm">{command.replaceAll("{actionKey}", actionKey)}</Kbd>}
            {rightContent && runIfFn(rightContent)}
        </dreamy.button>
    );
}

export const Item = withContext(function MenuButton(props: MenuButtonProps) {
    const { children, isDisabled, disabled } = props;
    const isItemDisabled = isDisabled || disabled;
    const generatedValue = useId();
    const value = typeof children === "string" ? children : generatedValue;

    return (
        <ArkMenu.Item
            asChild
            disabled={isItemDisabled}
            value={value}
            valueText={typeof children === "string" ? children : undefined}
        >
            <MenuItemButton {...props} />
        </ArkMenu.Item>
    );
}, "item");

export interface MenuTriggerProps extends HTMLDreamyProps<"button"> {
    placeholder?: string;
}

/**
 * Menu Trigger — element that opens and closes the menu.
 */
export function Trigger({ children, ...rest }: MenuTriggerProps) {
    const child = Children.only(children) as ReactElement<Record<string, unknown>>;

    return (
        <Popover.Anchor>
            <ArkMenu.Trigger asChild>
                {cloneElement(child, {
                    ...rest,
                    ...(child.props as Record<string, unknown>)
                })}
            </ArkMenu.Trigger>
        </Popover.Anchor>
    );
}

export interface MenuTriggerItemProps extends Omit<MenuButtonProps, "children"> {
    positioning?: PositioningProps;
    label?: React.ReactNode;
    children?: React.ReactNode;
}

/**
 * Menu Trigger Item — menu item that opens a nested sub-menu.
 */
export const TriggerItem = withContext(function MenuTriggerItem(props: MenuTriggerItemProps) {
    const {
        icon,
        command,
        rightContent,
        label,
        children,
        positioning,
        isDisabled,
        disabled,
        ...rest
    } = props;

    const actionKey = useActionKey();
    const globalReduceMotion = useReducedMotion();
    const reduceMotion = globalReduceMotion ?? false;

    const [subOpen, setSubOpen] = useState(false);

    const handleSubOpenChange = useCallback(
        (details: { open: boolean }) => {
            setSubOpen(details.open);
        },
        []
    );

    const popoverPositioning = mapPositioningProps({ placement: "right-start", ...positioning });

    return (
        <ArkMenu.Root
            lazyMount
            onOpenChange={handleSubOpenChange}
            open={subOpen}
            unmountOnExit={false}
        >
            <Popover.Root
                autoFocus={false}
                closeOnEscape={false}
                closeOnInteractOutside={false}
                open={subOpen}
                onOpenChange={handleSubOpenChange}
                portalProps={{
                    zIndex: "var(--z-index-dropdown)"
                }}
                positioning={popoverPositioning as PositioningProps}
                reduceMotion={reduceMotion}
                restoreFocus={false}
            >
                <Popover.Anchor>
                    <ArkMenu.TriggerItem asChild>
                        <dreamy.button
                            disabled={isDisabled || disabled}
                            type="button"
                            {...rest}
                        >
                            <span>
                                {runIfFn(icon)}
                                {label}
                            </span>
                            {command && (
                                <Kbd size="sm">{command.replaceAll("{actionKey}", actionKey)}</Kbd>
                            )}
                            {rightContent && runIfFn(rightContent)}
                            <ChevronRightIcon />
                        </dreamy.button>
                    </ArkMenu.TriggerItem>
                </Popover.Anchor>
                {children}
            </Popover.Root>
        </ArkMenu.Root>
    );
}, "item");
