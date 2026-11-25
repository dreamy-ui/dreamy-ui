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
import {
    type DreamyHostProps,
    type PortalProps,
    type PositioningProps,
    type StyleContextSlotProps,
    UiSdkMotionSync,
    mergeMotionRefs,
    transformReducedMotion,
    useMotionVariants,
    useReducedMotion,
    useUiSdkMotion
} from "@dreamy-ui/react";
import { Children, cloneElement, useCallback, useMemo, useState } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { PopoverVariantProps } from "styled-system/recipes";
import { popover } from "styled-system/recipes";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "../close-button";
import { MotionBox, type MotionBoxProps } from "../motion";
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
    const motion = useUiSdkMotion({
        open: rest.open,
        defaultOpen: rest.defaultOpen,
        reduceMotion
    });
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const handleUserOpenChange = useCallback<NonNullable<UiSdkPopoverProps["onOpenChange"]>>(
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

    const handleOpenChange = motion.wrapOnOpenChange(handleUserOpenChange);

    const uiValue = useMemo(
        () => ({
            hasArrow: hasArrow ?? false,
            arrowSize,
            arrowShadowColor,
            trigger,
            reduceMotion,
            motion,
            positioning,
            initialFocus: initialFocusRef
                ? () => (initialFocusRef.current as HTMLElement | null)
                : autoFocus === false
                  ? "none"
                  : undefined,
            finalFocus: restoreFocus === false ? "none" : undefined,
            keepMounted: lazyMount === false ? true : undefined,
            containerRef: portalProps?.containerRef,
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
            motion,
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
                delay={delay ?? openDelay}
                onOpenChange={handleOpenChange}
                openOnHover={openOnHover ?? trigger === "hover"}
            >
                <UiSdkMotionSync
                    controller={motion}
                    open={rest.open}
                />
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

export interface PopoverArrowProps extends HTMLDreamyProps<"div">, StyleContextSlotProps {}

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

    const arrowStyle = {
        "--arrow-size": `${arrowSize ?? 8}px`,
        "--arrow-background": "var(--colors-bg-panel)",
        ...(arrowShadowColor ? { "--popper-arrow-shadow": arrowShadowColor } : {}),
        ...(style as React.CSSProperties | undefined)
    } as PopoverArrowStyle;

    return (
        <UiSdkPopoverArrow
            {...(arrowProps as unknown as React.ComponentProps<typeof UiSdkPopoverArrow>)}
            style={arrowStyle as React.CSSProperties}
        />
    );
}, "arrow");

type UiSdkPopoverContentProps = React.ComponentProps<typeof UiSdkPopoverContent>;
type UiSdkPopoverContentPickedProps = Pick<
    UiSdkPopoverContentProps,
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
>;

export interface PopoverContentProps
    extends DreamyHostProps<HTMLDreamyProps<"div">, UiSdkPopoverContentPickedProps, "children">,
        UiSdkPopoverContentPickedProps,
        StyleContextSlotProps {
    children?: React.ReactNode;
    rootProps?: {
        className?: string;
        style?: React.CSSProperties;
    };
    /**
     * Props forwarded to the internal `MotionBox` wrapper on `Popover.Content`.
     */
    motionProps?: Omit<MotionBoxProps, "children">;
    onAnimationComplete?: (definition: unknown) => void;
    arrowProps?: PopoverArrowProps;
}

/**
 * Popover Content — the floating panel rendered in a portal.
 */
export const Content: (props: PopoverContentProps) => React.JSX.Element = withContext(
    function PopoverContent(props: PopoverContentProps) {
    const {
        children,
        className,
        style,
        rootProps,
        motionProps,
        onAnimationComplete,
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
    const { popover: popoverVariants } = useMotionVariants();
    const mapped = mapUiSdkPositioning(ui.positioning);

    const resolvedStyle: React.CSSProperties = {
        ...(mapped.matchWidth ? { width: "var(--anchor-width)" } : {}),
        ...rootProps?.style,
        ...(style as React.CSSProperties | undefined)
    };

    return (
        <UiSdkPopoverContent
            {...(rest as unknown as React.ComponentProps<typeof UiSdkPopoverContent>)}
            align={align ?? mapped.align}
            alignOffset={alignOffset ?? mapped.alignOffset}
            anchor={anchor ?? ui.anchor ?? undefined}
            arrowPadding={arrowPadding ?? mapped.arrowPadding}
            className={className as string | undefined}
            collisionPadding={collisionPadding ?? mapped.collisionPadding}
            container={container ?? ui.containerRef?.current ?? undefined}
            data-reduce-motion={ui.reduceMotion ? "" : undefined}
            finalFocus={finalFocus ?? ui.finalFocus}
            initialFocus={initialFocus ?? ui.initialFocus}
            keepMounted={keepMounted ?? ui.keepMounted}
            render={(partProps, state) => {
                const {
                    ref: partRef,
                    style: partStyle,
                    children: partChildren,
                    ...restPartProps
                } = partProps as React.ComponentPropsWithRef<"div">;
                const isOpen = (state as { open?: boolean })?.open ?? ui.motion.isOpen;

                return (
                    <MotionBox
                        {...(restPartProps as Record<string, unknown>)}
                        animate={isOpen ? "initial" : "exit"}
                        initial={ui.reduceMotion ? false : "exit"}
                        ref={mergeMotionRefs(partRef, (el) => {
                            ui.motion.register("content", el as HTMLElement | null);
                        })}
                        style={partStyle as React.CSSProperties | undefined}
                        variants={transformReducedMotion(popoverVariants, ui.reduceMotion)}
                        {...motionProps}
                        onAnimationComplete={(definition) => {
                            if (!isOpen) {
                                ui.motion.notifyAnimationComplete("content");
                            }
                            onAnimationComplete?.(definition);
                            motionProps?.onAnimationComplete?.(definition);
                        }}
                    >
                        {partChildren}
                    </MotionBox>
                );
            }}
            side={side ?? mapped.side}
            sideOffset={sideOffset ?? mapped.sideOffset}
            style={resolvedStyle}
        >
            {ui.hasArrow ? <Arrow {...arrowProps} /> : null}
            {children}
        </UiSdkPopoverContent>
    );
}, "content", { forwardProps: ["container"] } as never) as (
    props: PopoverContentProps
) => React.JSX.Element;

export interface PopoverHeaderProps extends HTMLDreamyProps<"header">, StyleContextSlotProps {
    children?: React.ReactNode;
}

/**
 * Popover Header — title area at the top of the popover.
 */
export const Header = withContext(function PopoverHeader(props: PopoverHeaderProps) {
    const { children, "data-slot": _dataSlot, ...rest } = props;

    return (
        <UiSdkPopoverTitle
            {...(rest as unknown as React.ComponentProps<typeof UiSdkPopoverTitle>)}
            render={<header>{children}</header>}
        />
    );
}, "header");

export interface PopoverBodyProps extends HTMLDreamyProps<"div">, StyleContextSlotProps {
    children?: React.ReactNode;
}

/**
 * Popover Body — main content area of the popover.
 */
export const Body = withContext(function PopoverBody(props: PopoverBodyProps) {
    const { children, "data-slot": _dataSlot, ...rest } = props;

    return (
        <UiSdkPopoverDescription
            {...(rest as unknown as React.ComponentProps<typeof UiSdkPopoverDescription>)}
            render={<div>{children}</div>}
        />
    );
}, "body");

export interface PopoverFooterProps extends HTMLDreamyProps<"footer"> {
    children?: React.ReactNode;
}

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
            className={className as string | undefined}
            render={<CloseButtonComponent {...(rest as CloseButtonProps)} />}
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
