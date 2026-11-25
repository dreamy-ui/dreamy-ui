"use client";

import {
    type DreamyHostProps,
    type StyleContextSlotProps,
    useReducedMotion
} from "@dreamy-ui/react";
import {
    Drawer as UiSdkDrawer,
    DrawerBackdrop as UiSdkDrawerBackdrop,
    DrawerClose as UiSdkDrawerClose,
    DrawerContent as UiSdkDrawerContent,
    DrawerDescription as UiSdkDrawerDescription,
    DrawerHandle as UiSdkDrawerHandle,
    DrawerOutlet as UiSdkDrawerOutlet,
    DrawerShortcut as UiSdkDrawerShortcut,
    DrawerTitle as UiSdkDrawerTitle,
    DrawerTrigger as UiSdkDrawerTrigger,
    type DrawerContentProps as UiSdkDrawerContentProps,
    type DrawerOptions,
    type DrawerOutletProps as UiSdkDrawerOutletProps,
    type DrawerSide,
    type DrawerTriggerProps as UiSdkDrawerTriggerProps,
    createDrawerController,
    sheetPhysics
} from "@ui-sdk/react/drawer";
import type React from "react";
import {
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    createContext,
    useContext,
    useMemo
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { type DrawerVariantProps, drawer } from "styled-system/recipes";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { Heading } from "./heading";
import { Text, type TextProps } from "./text";

const { withContext, withRootProvider } = createStyleContext(drawer, {
    forwardVariants: ["placement"]
});

export { createDrawerController, sheetPhysics };
export type { DrawerSide };
export type DrawerPlacement = "right" | "left" | "top" | "bottom";
export type DrawerScrollBehavior = "inside" | "outside";

interface DrawerUiContextValue {
    scrollBehavior: DrawerScrollBehavior;
    reduceMotion: boolean;
}

const DrawerUiContext = createContext<DrawerUiContextValue>({
    scrollBehavior: "inside",
    reduceMotion: false
});

function useDrawerUi() {
    return useContext(DrawerUiContext);
}

export interface DrawerProps extends DrawerOptions, DrawerVariantProps {
    children?: ReactNode;
    /**
     * Where scroll behavior should originate.
     * - If set to `inside`, scroll occurs within `Drawer.Body`.
     * - If set to `outside`, the drawer content scrolls within the viewport.
     *
     * @default "inside"
     */
    scrollBehavior?: DrawerScrollBehavior;
    /**
     * If `true`, drawer transitions are reduced.
     */
    reduceMotion?: boolean;
}

/**
 * Drawer component — accessible slide-over sheet powered by UI SDK `Drawer`.
 *
 * @see Docs https://dreamy-ui.com/docs/components/drawer
 */
export const Root = withRootProvider(function DrawerRoot(props: DrawerProps) {
    const {
        children,
        scrollBehavior = "inside",
        reduceMotion: reduceMotionProp,
        placement = "right",
        side,
        size: _size,
        variant: _variant,
        ...drawerOptions
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const resolvedSide: DrawerSide = side ?? placement ?? "right";
    const resolvedPhysics =
        reduceMotion && drawerOptions.physics?.response === undefined
            ? { ...drawerOptions.physics, response: 0.001, dampingRatio: 1 }
            : drawerOptions.physics;

    const uiValue = useMemo<DrawerUiContextValue>(
        () => ({ scrollBehavior, reduceMotion }),
        [reduceMotion, scrollBehavior]
    );

    return (
        <DrawerUiContext.Provider value={uiValue}>
            <UiSdkDrawer
                {...drawerOptions}
                physics={resolvedPhysics}
                side={resolvedSide}
            >
                {children}
            </UiSdkDrawer>
        </DrawerUiContext.Provider>
    );
});

export interface DrawerOverlayProps extends Omit<HTMLDreamyProps<"div">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Drawer Overlay — backdrop behind the sheet content.
 */
export const Overlay = withContext(function DrawerOverlay(props: DrawerOverlayProps) {
    const { className, style, children, "data-slot": _dataSlot, ...rest } = props;
    const { reduceMotion } = useDrawerUi();
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerBackdrop
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerBackdrop>)}
            className={cx(className as string | undefined, css(cssProps))}
            data-reduce-motion={reduceMotion ? "" : undefined}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerBackdrop>
    );
}, "overlay");

export interface DrawerContentProps
    extends UiSdkDrawerContentProps,
        DreamyHostProps<HTMLDreamyProps<"div">, UiSdkDrawerContentProps>,
        StyleContextSlotProps {
    render?: ReactElement;
    children?: ReactNode;
}

/**
 * Drawer Content — slide-over sheet surface, snap points, and focus scope.
 */
export const Content = withContext(function DrawerContent(props: DrawerContentProps) {
    const {
        className,
        style,
        children,
        initialFocus,
        finalFocus,
        keepMounted,
        container,
        render,
        "data-slot": _dataSlot,
        ...rest
    } = props;
    const { scrollBehavior, reduceMotion } = useDrawerUi();
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerContent
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerContent>)}
            className={cx(className as string | undefined, css(cssProps))}
            container={container}
            data-reduce-motion={reduceMotion ? "" : undefined}
            data-scroll-behavior={scrollBehavior}
            finalFocus={finalFocus}
            initialFocus={initialFocus}
            keepMounted={keepMounted}
            render={render}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerContent>
    );
}, "content");

export interface DrawerHeaderProps extends Omit<HTMLDreamyProps<"header">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Drawer Header — top section that provides the drawer's accessible title (`aria-labelledby`).
 */
export const Header = withContext(function DrawerHeader(props: DrawerHeaderProps) {
    const { children, className, style, "data-slot": _dataSlot, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerTitle
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerTitle>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={<header />}
            style={style as CSSProperties | undefined}
        >
            {typeof children === "string" ? (
                <Heading
                    as="span"
                    size="lg"
                    variant="heading"
                >
                    {children}
                </Heading>
            ) : (
                children
            )}
        </UiSdkDrawerTitle>
    );
}, "header");

export interface DrawerBodyProps extends Omit<HTMLDreamyProps<"div">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Drawer Body — main content area wired as the drawer's `aria-describedby`.
 */
export const Body = withContext(function DrawerBody(props: DrawerBodyProps) {
    const { children, className, style, "data-slot": _dataSlot, ...rest } = props;
    const { scrollBehavior } = useDrawerUi();
    const [cssProps, domProps] = splitCssProps(rest);

    const resolvedStyle: CSSProperties = {
        overflow: scrollBehavior === "inside" ? "auto" : undefined,
        ...(style as CSSProperties | undefined)
    };

    return (
        <UiSdkDrawerDescription
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerDescription>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={<div />}
            style={resolvedStyle}
        >
            {children}
        </UiSdkDrawerDescription>
    );
}, "body");

export interface DrawerFooterProps extends HTMLDreamyProps<"footer"> {}

/**
 * Drawer Footer — bottom section for panel actions.
 */
export const Footer = withContext(dreamy.footer, "footer");

export interface DrawerCloseButtonProps extends CloseButtonProps, StyleContextSlotProps {
    action?: React.ComponentProps<typeof UiSdkDrawerClose>["action"];
    value?: string;
}

/**
 * Drawer Close Button — icon button that dismisses the panel.
 */
export const CloseButton = withContext(function DrawerCloseButton(props: DrawerCloseButtonProps) {
    const { className, action, value, "data-slot": _dataSlot, ...rest } = props;

    return (
        <UiSdkDrawerClose
            action={action}
            className={className as string | undefined}
            render={<CloseButtonComponent {...rest} />}
            value={value}
        />
    );
}, "close");

export interface DrawerCloseProps
    extends Omit<HTMLDreamyProps<"button">, "children" | "value"> {
    action?: React.ComponentProps<typeof UiSdkDrawerClose>["action"];
    value?: string;
    render?: ReactElement;
    children?: ReactNode;
}

/**
 * Drawer Close — action button that closes the drawer.
 */
export function Close(props: DrawerCloseProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerClose
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerClose>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerClose>
    );
}

export interface DrawerGrabberProps extends Omit<HTMLDreamyProps<"button">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Drawer Grabber / Handle — keyboard- and pointer-accessible resize handle for snap points.
 */
export const Grabber = withContext(function DrawerGrabber(props: DrawerGrabberProps) {
    const {
        className,
        style,
        children,
        "aria-label": ariaLabel = "Resize drawer",
        "data-slot": _dataSlot,
        ...rest
    } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerHandle
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerHandle>)}
            aria-label={ariaLabel}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerHandle>
    );
}, "grabber");

export const Handle = Grabber;

export interface DrawerGrabberIndicatorProps extends HTMLDreamyProps<"div"> {}

/**
 * Drawer Grabber Indicator — visual pill inside the grabber.
 */
export const GrabberIndicator = withContext(function DrawerGrabberIndicator(
    props: DrawerGrabberIndicatorProps
) {
    return (
        <dreamy.div
            aria-hidden="true"
            {...props}
        />
    );
}, "grabberIndicator");

export interface DrawerTriggerProps
    extends UiSdkDrawerTriggerProps,
        DreamyHostProps<
            HTMLDreamyProps<"button">,
            UiSdkDrawerTriggerProps,
            "disabled" | "value" | "defaultValue" | "onChange"
        >,
        StyleContextSlotProps {
    render?: ReactElement;
    children?: ReactNode;
}

/**
 * Drawer Trigger — opens the drawer when activated.
 */
export const Trigger = withContext(function DrawerTrigger(props: DrawerTriggerProps) {
    const { className, style, children, "data-slot": _dataSlot, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerTrigger
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerTrigger>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerTrigger>
    );
}, "trigger");

export interface DrawerTitleProps extends Omit<HTMLDreamyProps<"h2">, "children">, StyleContextSlotProps {
    children?: ReactNode;
}

/**
 * Drawer Title — accessible heading wired to UI SDK drawer semantics.
 */
export const Title = withContext(function DrawerTitle(props: DrawerTitleProps) {
    const { children, className, style, "data-slot": _dataSlot, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerTitle
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerTitle>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={
                <Heading
                    as="h2"
                    size="lg"
                    variant="heading"
                />
            }
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerTitle>
    );
}, "title");

export interface DrawerDescriptionProps extends TextProps, StyleContextSlotProps {}

/**
 * Drawer Description — optional accessible description for the panel.
 */
export const Description = withContext(function DrawerDescription(props: DrawerDescriptionProps) {
    const { children, className, style, "data-slot": _dataSlot, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerDescription
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerDescription>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={<Text as="p" />}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerDescription>
    );
}, "description");

export interface DrawerOutletProps
    extends UiSdkDrawerOutletProps,
        Omit<HTMLDreamyProps<"div">, "children"> {
    children?: ReactNode;
}

/**
 * Drawer Outlet — element that animates its keyframes in sync with the drawer's progress.
 */
export function Outlet(props: DrawerOutletProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerOutlet
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerOutlet>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerOutlet>
    );
}

export interface DrawerShortcutProps extends Omit<HTMLDreamyProps<"span">, "children"> {
    shortcut?: string;
    children?: ReactNode;
}

/**
 * Drawer Shortcut — displays a trigger's keyboard shortcut.
 */
export function Shortcut(props: DrawerShortcutProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkDrawerShortcut
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkDrawerShortcut>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkDrawerShortcut>
    );
}
