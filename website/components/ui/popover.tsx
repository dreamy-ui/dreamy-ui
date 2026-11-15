"use client";

import {
    Popover as UiSdkPopover,
    PopoverArrow as UiSdkPopoverArrow,
    PopoverClose as UiSdkPopoverClose,
    PopoverContent as UiSdkPopoverContent,
    PopoverDescription as UiSdkPopoverDescription,
    PopoverTitle as UiSdkPopoverTitle,
    PopoverTrigger as UiSdkPopoverTrigger,
    type PopoverProps as UiSdkPopoverProps
} from "@ui-sdk/react/popover";
import { type PortalProps, type PositioningProps, useReducedMotion } from "@dreamy-ui/react";
import { Children, cloneElement, useCallback, useMemo, useState } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { PopoverVariantProps } from "styled-system/recipes";
import { popover } from "styled-system/recipes";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { mapUiSdkPositioning } from "./map-positioning";
import { PopoverUiProvider, usePopoverUi } from "./popover-ui-context";

const { withContext, withRootProvider } = createStyleContext(popover);

export interface PopoverProps
    extends PopoverVariantProps,
        Omit<UiSdkPopoverProps, "children"> {
    children?: React.ReactNode;
    /**
     * Positioning configuration for the popover content. Mapped onto UI SDK
     * `side`/`align`/offset props; prefer the matching props on
     * `Popover.Content` for new code.
     */
    positioning?: PositioningProps;
    /**
     * The `ref` of the element that should receive focus when the popover opens.
     * @deprecated Use `initialFocus` on `Popover.Content` instead.
     */
    initialFocusRef?: React.RefObject<{ focus(): void } | null>;
    /**
     * The size of the popover arrow
     */
    arrowSize?: number;
    /**
     * The `box-shadow` of the popover arrow
     */
    arrowShadowColor?: string;
    /**
     * The interaction that triggers the popover.
     * @default "click"
     * @deprecated Use `openOnHover` with `delay`/`closeDelay` instead.
     */
    trigger?: "click" | "hover";
    /**
     * Delay in milliseconds before the popover opens after a trigger event.
     * Only works when `trigger="hover"`.
     * @default 200
     * @deprecated Use `delay` instead.
     */
    openDelay?: number;
    /**
     * If `true`, popover open/close animations are disabled.
     */
    reduceMotion?: boolean;
    /**
     * If `true`, the popover will have an arrow pointing to the trigger
     * @default false
     */
    hasArrow?: boolean;
    /**
     * If `true`, the popover content will be rendered in a portal.
     * @default true
     * @deprecated UI SDK popups render in place and use the top layer.
     */
    usePortal?: boolean;
    /**
     * Props forwarded to the portal used by `Popover.Content`.
     * Only `containerRef` is honored (mapped to UI SDK `container`).
     * @deprecated Use `container` on `Popover.Content` instead.
     */
    portalProps?: Omit<PortalProps, "children">;
    /**
     * @deprecated Use `dismissible` and `onDismissAttempt` instead.
     */
    closeOnEscape?: boolean;
    /**
     * @deprecated Use `dismissible` and `onDismissAttempt` instead.
     */
    closeOnInteractOutside?: boolean;
    /**
     * @deprecated Use `finalFocus` on `Popover.Content` instead.
     */
    restoreFocus?: boolean;
    /**
     * @deprecated Use `initialFocus` on `Popover.Content` instead.
     */
    autoFocus?: boolean;
    /**
     * @deprecated UI SDK mounts content on open by default; `lazyMount={false}`
     * maps to `keepMounted` on `Popover.Content`.
     */
    lazyMount?: boolean;
}

function PopoverRoot(props: PopoverProps) {
    const {
        children,
        hasArrow,
        portalProps,
        positioning,
        initialFocusRef,
        arrowSize,
        arrowShadowColor,
        trigger = "click",
        openDelay = 200,
        reduceMotion: reduceMotionProp,
        lazyMount,
        closeOnEscape = true,
        closeOnInteractOutside = true,
        restoreFocus = true,
        autoFocus = true,
        onOpenChange,
        openOnHover,
        delay,
        usePortal: _usePortal,
        ...rest
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const handleOpenChange = useCallback<NonNullable<UiSdkPopoverProps["onOpenChange"]>>(
        (nextOpen, details) => {
            if (!nextOpen) {
                if (details.reason === "escape-key" && !closeOnEscape) {
                    details.cancel();
                    return;
                }
                if (details.reason === "outside-press" && !closeOnInteractOutside) {
                    details.cancel();
                    return;
                }
            }
            onOpenChange?.(nextOpen, details);
        },
        [closeOnEscape, closeOnInteractOutside, onOpenChange]
    );

    const uiValue = useMemo(
        () => ({
            hasArrow: hasArrow ?? false,
            arrowSize,
            arrowShadowColor,
            trigger,
            reduceMotion,
            positioning,
            initialFocus: initialFocusRef
                ? () => (initialFocusRef.current as HTMLElement | null)
                : autoFocus === false
                  ? "none"
                  : undefined,
            finalFocus: restoreFocus === false ? "none" : undefined,
            keepMounted: lazyMount === false ? true : undefined,
            container: portalProps?.containerRef?.current ?? undefined,
            anchor,
            setAnchor
        }),
        [
            anchor,
            arrowShadowColor,
            arrowSize,
            autoFocus,
            hasArrow,
            initialFocusRef,
            lazyMount,
            portalProps?.containerRef,
            positioning,
            reduceMotion,
            restoreFocus,
            trigger
        ]
    );

    return (
        <PopoverUiProvider value={uiValue}>
            <UiSdkPopover
                {...rest}
                openOnHover={openOnHover ?? trigger === "hover"}
                delay={delay ?? openDelay}
                onOpenChange={handleOpenChange}
            >
                {children}
            </UiSdkPopover>
        </PopoverUiProvider>
    );
}

/**
 * Popover component — floating content anchored to a trigger element.
 *
 * @see Docs https://dreamy-ui.com/docs/components/popover
 */
export const Root = withRootProvider(PopoverRoot);

export interface PopoverArrowProps extends HTMLDreamyProps<"div"> {}

interface PopoverArrowStyle extends React.CSSProperties {
    "--arrow-size"?: string;
    "--arrow-background"?: string;
    "--popper-arrow-shadow"?: string;
}

/**
 * Popover Arrow — pointer connecting the popover to its anchor.
 */
export const Arrow = withContext(function PopoverArrow(props: PopoverArrowProps) {
    const { arrowSize, arrowShadowColor } = usePopoverUi();
    const { "data-slot": _dataSlot, style, ...arrowProps } = props;

    const arrowStyle: PopoverArrowStyle = {
        "--arrow-size": `${arrowSize ?? 8}px`,
        "--arrow-background": "var(--colors-bg-panel)",
        ...(arrowShadowColor ? { "--popper-arrow-shadow": arrowShadowColor } : {}),
        ...style
    };

    return <UiSdkPopoverArrow {...arrowProps} style={arrowStyle} />;
}, "arrow");

export interface PopoverContentProps
    extends HTMLDreamyProps<"div">,
        Pick<
            React.ComponentProps<typeof UiSdkPopoverContent>,
            | "side"
            | "align"
            | "sideOffset"
            | "alignOffset"
            | "collisionPadding"
            | "arrowPadding"
            | "anchor"
            | "container"
            | "initialFocus"
            | "finalFocus"
            | "keepMounted"
        > {
    rootProps?: {
        className?: string;
        style?: React.CSSProperties;
    };
    /**
     * @deprecated Motion is handled by CSS transitions on `data-starting-style`/`data-ending-style`.
     */
    motionProps?: Record<string, unknown>;
    arrowProps?: PopoverArrowProps;
}

/**
 * Popover Content — the floating panel rendered in a portal.
 */
export const Content = withContext(function PopoverContent(props: PopoverContentProps) {
    const {
        children,
        className,
        style,
        rootProps,
        motionProps: _motionProps,
        arrowProps,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        arrowPadding,
        anchor,
        container,
        initialFocus,
        finalFocus,
        keepMounted,
        "data-slot": _dataSlot,
        ...rest
    } = props;

    const ui = usePopoverUi();
    const mapped = mapUiSdkPositioning(ui.positioning);

    const resolvedStyle: React.CSSProperties = {
        ...(mapped.matchWidth ? { width: "var(--anchor-width)" } : {}),
        ...rootProps?.style,
        ...style
    };

    return (
        <UiSdkPopoverContent
            {...rest}
            align={align ?? mapped.align}
            alignOffset={alignOffset ?? mapped.alignOffset}
            anchor={anchor ?? ui.anchor ?? undefined}
            arrowPadding={arrowPadding ?? mapped.arrowPadding}
            className={className}
            collisionPadding={collisionPadding ?? mapped.collisionPadding}
            container={container ?? ui.container}
            finalFocus={finalFocus ?? ui.finalFocus}
            initialFocus={initialFocus ?? ui.initialFocus}
            keepMounted={keepMounted ?? ui.keepMounted}
            side={side ?? mapped.side}
            sideOffset={sideOffset ?? mapped.sideOffset}
            style={resolvedStyle}
        >
            {ui.hasArrow ? <Arrow {...arrowProps} /> : null}
            {children}
        </UiSdkPopoverContent>
    );
}, "content");

export interface PopoverHeaderProps extends HTMLDreamyProps<"header"> {}

/**
 * Popover Header — title area at the top of the popover.
 */
export const Header = withContext(function PopoverHeader(props: PopoverHeaderProps) {
    const { children, "data-slot": _dataSlot, ...rest } = props;

    return (
        <UiSdkPopoverTitle
            {...rest}
            render={<header>{children}</header>}
        />
    );
}, "header");

export interface PopoverBodyProps extends HTMLDreamyProps<"div"> {}

/**
 * Popover Body — main content area of the popover.
 */
export const Body = withContext(function PopoverBody(props: PopoverBodyProps) {
    const { children, "data-slot": _dataSlot, ...rest } = props;

    return (
        <UiSdkPopoverDescription
            {...rest}
            render={<div>{children}</div>}
        />
    );
}, "body");

export interface PopoverFooterProps extends HTMLDreamyProps<"footer"> {}

/**
 * Popover Footer — action area at the bottom of the popover.
 */
export const Footer = withContext(function PopoverFooter(props: PopoverFooterProps) {
    return <dreamy.footer {...props} />;
}, "footer");

export interface PopoverCloseButtonProps extends CloseButtonProps {}

/**
 * Popover Close Button — dismisses the popover.
 */
export const CloseButton = withContext(function PopoverCloseButton(props: PopoverCloseButtonProps) {
    const { className, ...rest } = props;

    return (
        <UiSdkPopoverClose
            className={className}
            render={<CloseButtonComponent {...rest} />}
        />
    );
}, "close");

/**
 * Popover Anchor — positioning reference element for the popover.
 */
export function Anchor(props: React.PropsWithChildren) {
    const { setAnchor } = usePopoverUi();
    const child = Children.only(props.children) as React.ReactElement<
        Record<string, unknown>
    > & { ref?: React.Ref<Element> };
    const childRef = child.ref;

    const anchorRef = useCallback(
        (element: Element | null) => {
            setAnchor(element instanceof HTMLElement ? element : null);
            if (typeof childRef === "function") {
                childRef(element);
            } else if (childRef) {
                (childRef as React.MutableRefObject<Element | null>).current = element;
            }
        },
        [childRef, setAnchor]
    );

    return cloneElement(child, { ref: anchorRef });
}

/**
 * Popover Trigger — opens the popover when activated.
 */
export function Trigger(props: {
    children: React.ReactNode;
} & Omit<React.ComponentProps<typeof UiSdkPopoverTrigger>, "render" | "children">) {
    const { children, ...rest } = props;
    const child = Children.only(children) as React.ReactElement<Record<string, unknown>>;

    return <UiSdkPopoverTrigger {...rest} render={child} />;
}
