"use client";

import {
    ChevronRightIcon,
    type DreamyHostProps,
    type PositioningProps,
    type UiSdkMotionController,
    UiSdkMotionSync,
    mergeMotionRefs,
    runIfFn,
    transformReducedMotion,
    useActionKey,
    useMotionVariants,
    useReducedMotion,
    useUiSdkMotion
} from "@dreamy-ui/react";
import {
    Menu as UiSdkMenu,
    MenuCheckboxItem as UiSdkMenuCheckboxItem,
    MenuContent as UiSdkMenuContent,
    MenuContextTrigger as UiSdkMenuContextTrigger,
    MenuGroup as UiSdkMenuGroup,
    MenuGroupLabel as UiSdkMenuGroupLabel,
    MenuItem as UiSdkMenuItem,
    MenuItemIcon as UiSdkMenuItemIcon,
    MenuItemIndicator as UiSdkMenuItemIndicator,
    type MenuProps as UiSdkMenuProps,
    MenuRadioGroup as UiSdkMenuRadioGroup,
    MenuRadioItem as UiSdkMenuRadioItem,
    MenuSeparator as UiSdkMenuSeparator,
    MenuSub as UiSdkMenuSub,
    MenuSubContent as UiSdkMenuSubContent,
    MenuSubTrigger as UiSdkMenuSubTrigger,
    MenuTrigger as UiSdkMenuTrigger
} from "@ui-sdk/react/menu";
import {
    Children,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    createContext,
    useContext,
    useId,
    useMemo
} from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, createStyleContext, splitCssProps } from "styled-system/jsx";
import { type MenuVariantProps, menu } from "styled-system/recipes";
import { Kbd } from "../kbd";
import { MotionBox } from "../motion";
import { mapUiSdkPositioning } from "../popover/map-positioning";

const { withProvider, withContext } = createStyleContext(menu);

interface MenuUiContextValue {
    positioning?: PositioningProps;
    reduceMotion: boolean;
    closeOnSelect?: boolean;
}

const MenuUiContext = createContext<MenuUiContextValue>({
    reduceMotion: false
});

const MenuMotionContext = createContext<UiSdkMotionController | null>(null);
const MenuSubContext = createContext<boolean>(false);

export interface MenuProps extends Omit<UiSdkMenuProps, "children">, MenuVariantProps {
    /**
     * Positioning configuration mapped onto UI SDK `side`/`align`/offset props.
     * @default { placement: "bottom-start" }
     */
    positioning?: PositioningProps;
    children?: ReactNode;
    className?: string;
    /**
     * Default `closeOnSelect` behavior for items inside this menu.
     * @default true
     */
    closeOnSelect?: boolean;
    /**
     * If `true`, menu open/close transitions are disabled.
     */
    reduceMotion?: boolean;
}

/**
 * Menu component — accessible dropdown menu with keyboard navigation.
 *
 * @see Docs https://dreamy-ui.com/docs/components/menu
 */
export const Root = withProvider(function MenuRoot(props: MenuProps) {
    const {
        children,
        className: _className,
        positioning,
        closeOnSelect,
        reduceMotion: reduceMotionProp,
        open,
        defaultOpen,
        onOpenChange,
        ...rest
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const motion = useUiSdkMotion({ open, defaultOpen, reduceMotion });
    const handleOpenChange = motion.wrapOnOpenChange(onOpenChange);

    const uiValue = useMemo(
        () => ({
            positioning,
            reduceMotion,
            closeOnSelect
        }),
        [closeOnSelect, positioning, reduceMotion]
    );

    return (
        <MenuUiContext.Provider value={uiValue}>
            <MenuMotionContext.Provider value={motion}>
                <UiSdkMenu
                    {...rest}
                    defaultOpen={defaultOpen}
                    onOpenChange={handleOpenChange}
                    open={open}
                >
                    <UiSdkMotionSync
                        controller={motion}
                        open={open}
                    />
                    {children}
                </UiSdkMenu>
            </MenuMotionContext.Provider>
        </MenuUiContext.Provider>
    );
}, "root");

type UiSdkMenuContentProps = React.ComponentProps<typeof UiSdkMenuContent>;
type UiSdkMenuContentPickedProps = Pick<
    UiSdkMenuContentProps,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "arrowPadding"
    | "anchor"
    | "container"
    | "finalFocus"
    | "keepMounted"
>;

export interface MenuContentProps
    extends DreamyHostProps<HTMLDreamyProps<"div">, UiSdkMenuContentPickedProps, "children">,
        UiSdkMenuContentPickedProps {
    children?: ReactNode;
}

/**
 * Menu Content — dropdown panel containing menu items.
 */
export const Content = withContext(function MenuContent(props: MenuContentProps) {
    const {
        children,
        className,
        style,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        arrowPadding,
        anchor,
        container,
        finalFocus,
        keepMounted,
        ...rest
    } = props;

    const ui = useContext(MenuUiContext);
    const motion = useContext(MenuMotionContext);
    const { popover: popoverVariants } = useMotionVariants();
    const isSub = useContext(MenuSubContext);
    const mapped = mapUiSdkPositioning(ui.positioning);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    const contentRender: UiSdkMenuContentProps["render"] = (partProps, state) => {
        const {
            ref: partRef,
            style: partStyle,
            children: partChildren,
            ...restPartProps
        } = partProps as React.ComponentPropsWithRef<"div">;
        const isOpen = (state as { open?: boolean })?.open ?? motion?.isOpen ?? true;

        return (
            <MotionBox
                {...(restPartProps as Record<string, unknown>)}
                animate={isOpen ? "initial" : "exit"}
                initial={ui.reduceMotion ? false : "exit"}
                onAnimationComplete={() => {
                    if (!isOpen) {
                        motion?.notifyAnimationComplete("content");
                    }
                }}
                ref={mergeMotionRefs(partRef, (el) => {
                    motion?.register("content", el as HTMLElement | null);
                })}
                style={partStyle as CSSProperties | undefined}
                variants={transformReducedMotion(popoverVariants, ui.reduceMotion)}
            >
                {partChildren}
            </MotionBox>
        );
    };

    const contentProps = {
        ...(domProps as unknown as UiSdkMenuContentProps),
        align: align ?? mapped.align ?? "start",
        alignOffset: alignOffset ?? mapped.alignOffset,
        anchor,
        arrowPadding: arrowPadding ?? mapped.arrowPadding,
        className: mergedClassName,
        collisionPadding: collisionPadding ?? mapped.collisionPadding,
        container,
        "data-reduce-motion": ui.reduceMotion ? "" : undefined,
        finalFocus,
        keepMounted,
        render: contentRender,
        side: side ?? mapped.side ?? (isSub ? "right" : "bottom"),
        sideOffset: sideOffset ?? mapped.sideOffset ?? 6,
        style: style as CSSProperties | undefined
    };

    if (isSub) {
        return <UiSdkMenuSubContent {...contentProps}>{children}</UiSdkMenuSubContent>;
    }

    return <UiSdkMenuContent {...contentProps}>{children}</UiSdkMenuContent>;
}, "content");

type UiSdkMenuItemProps = React.ComponentProps<typeof UiSdkMenuItem>;

export interface MenuButtonProps
    extends Omit<HTMLDreamyProps<"div">, "children" | "onSelect">,
        Pick<
            UiSdkMenuItemProps,
            | "value"
            | "label"
            | "disabled"
            | "destructive"
            | "shortcut"
            | "closeOnSelect"
            | "onSelect"
            | "render"
        > {
    icon?: ReactNode | (() => ReactNode);
    command?: string;
    rightContent?: ReactNode | (() => ReactNode);
    children?: ReactNode;
}

export type MenuItemProps = MenuButtonProps;

/**
 * Menu Item — actionable option within the menu.
 */
export const Item = withContext(function MenuItem(props: MenuButtonProps) {
    const {
        icon,
        command,
        rightContent,
        children,
        className,
        style,
        value: valueProp,
        label,
        disabled,
        destructive,
        shortcut,
        closeOnSelect,
        onSelect,
        render,
        ...rest
    } = props;

    const actionKey = useActionKey();
    const ui = useContext(MenuUiContext);
    const generatedValue = useId();
    const value = valueProp ?? (typeof children === "string" ? children : generatedValue);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkMenuItem
            {...(domProps as unknown as UiSdkMenuItemProps)}
            className={mergedClassName}
            closeOnSelect={closeOnSelect ?? ui.closeOnSelect}
            destructive={destructive}
            disabled={disabled}
            label={label}
            onSelect={onSelect}
            render={render}
            shortcut={shortcut}
            style={style as CSSProperties | undefined}
            value={value}
        >
            <span>
                {icon ? <UiSdkMenuItemIcon>{runIfFn(icon)}</UiSdkMenuItemIcon> : null}
                {children}
            </span>
            {command ? <Kbd size="sm">{command.replaceAll("{actionKey}", actionKey)}</Kbd> : null}
            {rightContent ? runIfFn(rightContent) : null}
        </UiSdkMenuItem>
    );
}, "item");

export interface MenuTriggerProps
    extends Omit<React.ComponentProps<typeof UiSdkMenuTrigger>, "render" | "children"> {
    children: ReactNode;
}

/**
 * Menu Trigger — element that opens and closes the menu.
 */
export function Trigger({ children, ...rest }: MenuTriggerProps) {
    const child = Children.only(children) as ReactElement<Record<string, unknown>>;

    return (
        <UiSdkMenuTrigger
            {...rest}
            render={child}
        />
    );
}

export interface MenuTriggerItemProps
    extends Omit<
        MenuButtonProps,
        "children" | "onSelect" | "closeOnSelect" | "value" | "destructive" | "label" | "render"
    > {
    positioning?: PositioningProps;
    label?: ReactNode;
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: React.ComponentProps<typeof UiSdkMenuSub>["onOpenChange"];
    delay?: number;
    render?: React.ComponentProps<typeof UiSdkMenuSubTrigger>["render"];
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
        disabled,
        open,
        defaultOpen,
        onOpenChange,
        delay,
        className,
        style,
        render,
        ...rest
    } = props;

    const actionKey = useActionKey();
    const parentUi = useContext(MenuUiContext);
    const subMotion = useUiSdkMotion({
        open,
        defaultOpen,
        reduceMotion: parentUi.reduceMotion
    });
    const handleSubOpenChange = subMotion.wrapOnOpenChange(onOpenChange);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    const subUi = useMemo(
        () => ({
            ...parentUi,
            positioning: { placement: "right-start" as const, ...positioning }
        }),
        [parentUi, positioning]
    );

    return (
        <UiSdkMenuSub
            defaultOpen={defaultOpen}
            delay={delay}
            onOpenChange={handleSubOpenChange}
            open={open}
        >
            <UiSdkMotionSync
                controller={subMotion}
                open={open}
            />
            <UiSdkMenuSubTrigger
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkMenuSubTrigger>)}
                className={mergedClassName}
                disabled={disabled}
                render={render}
                style={style as CSSProperties | undefined}
            >
                <span>
                    {icon ? <UiSdkMenuItemIcon>{runIfFn(icon)}</UiSdkMenuItemIcon> : null}
                    {label}
                </span>
                {command ? (
                    <Kbd size="sm">{command.replaceAll("{actionKey}", actionKey)}</Kbd>
                ) : null}
                {rightContent ? runIfFn(rightContent) : null}
                <ChevronRightIcon />
            </UiSdkMenuSubTrigger>
            <MenuUiContext.Provider value={subUi}>
                <MenuMotionContext.Provider value={subMotion}>
                    <MenuSubContext.Provider value={true}>{children}</MenuSubContext.Provider>
                </MenuMotionContext.Provider>
            </MenuUiContext.Provider>
        </UiSdkMenuSub>
    );
}, "item");

export const Separator = UiSdkMenuSeparator;
export const Group = UiSdkMenuGroup;
export const GroupLabel = UiSdkMenuGroupLabel;
export const CheckboxItem = UiSdkMenuCheckboxItem;
export const RadioGroup = UiSdkMenuRadioGroup;
export const RadioItem = UiSdkMenuRadioItem;
export const ItemIndicator = UiSdkMenuItemIndicator;
export const ContextTrigger = UiSdkMenuContextTrigger;
