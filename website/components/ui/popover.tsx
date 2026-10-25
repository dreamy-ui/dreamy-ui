"use client";

import {
    Popover as ArkPopover,
    type PopoverRootProps as ArkPopoverRootProps,
    usePopoverContext as useArkPopoverContext
} from "@ark-ui/react/popover";
import {
    type MaybeRenderProp,
    Portal,
    type PortalProps,
    type PositioningProps,
    callAllHandlers,
    runIfFn,
    transformReducedMotion,
    useMotionVariants,
    useReducedMotion
} from "@dreamy-ui/react";
import {
    Children,
    cloneElement,
    useCallback,
    useMemo,
    useState,
    type CSSProperties
} from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import type { PopoverVariantProps } from "styled-system/recipes";
import { popover } from "styled-system/recipes";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { MotionBox, type MotionBoxProps } from "./motion";
import { mapPositioningProps } from "./map-positioning";
import { PopoverUiProvider, usePopoverUi } from "./popover-ui-context";
import { useFloatingPresent } from "./use-floating-present";
import { useHoverOpen } from "./use-hover-open";

const { withContext, withRootProvider } = createStyleContext(popover);

export interface PopoverProps
    extends Omit<
            ArkPopoverRootProps,
            "positioning" | "portalled" | "initialFocusEl" | "children" | "unmountOnExit"
        >,
        PopoverVariantProps {
    /**
     * The content of the popover. It is usually the `PopoverTrigger`,
     * and `PopoverContent`
     */
    children?: MaybeRenderProp<{
        open: boolean;
        setOpen: (open: boolean) => void;
    }>;
    /**
     * Positioning configuration for the popover floating element.
     */
    positioning?: PositioningProps;
    /**
     * The `ref` of the element that should receive focus when the popover opens.
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
     */
    trigger?: "click" | "hover";
    /**
     * Delay in milliseconds before the popover opens after a trigger event.
     * Only works when `trigger="hover"`
     * @default 200
     */
    openDelay?: number;
    /**
     * Delay in milliseconds before the popover closes after a trigger event.
     * Only works when `trigger="hover"`
     * @default 200
     */
    closeDelay?: number;
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
     * If `true`, the popover content will be rendered in a portal
     * @default true
     */
    usePortal?: boolean;
    /**
     * Props forwarded to the `Portal` used by `Popover.Content`.
     */
    portalProps?: Omit<PortalProps, "children">;
}

function PopoverRoot(props: PopoverProps) {
    const {
        children,
        hasArrow,
        usePortal = true,
        portalProps,
        positioning,
        open: openProp,
        defaultOpen,
        onOpenChange,
        initialFocusRef,
        restoreFocus = true,
        autoFocus = true,
        closeOnInteractOutside = true,
        closeOnEscape = true,
        arrowSize,
        arrowShadowColor,
        trigger = "click",
        openDelay = 200,
        closeDelay = 200,
        lazyMount,
        reduceMotion: reduceMotionProp,
        ...arkRest
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const [trackedOpen, setTrackedOpen] = useState(defaultOpen ?? false);

    const hover = useHoverOpen({
        enabled: trigger === "hover",
        open: openProp,
        defaultOpen,
        openDelay,
        closeDelay,
        onOpenChange
    });

    const handleOpenChange = useCallback(
        (details: { open: boolean }) => {
            if (openProp === undefined) {
                setTrackedOpen(details.open);
            }
            onOpenChange?.(details);
            if (trigger === "hover") {
                hover.setOpen(details.open);
            }
        },
        [hover, onOpenChange, openProp, trigger]
    );

    const rootOpen =
        trigger === "hover"
            ? (openProp ?? hover.open ?? trackedOpen)
            : (openProp ?? trackedOpen);

    const { present, handleExitComplete } = useFloatingPresent(rootOpen, reduceMotion);

    const arkRootProps: ArkPopoverRootProps = {
        ...arkRest,
        positioning: mapPositioningProps(positioning),
        ...(rootOpen !== undefined ? { open: rootOpen } : {}),
        ...(trigger !== "hover" && openProp === undefined ? { defaultOpen } : {}),
        onOpenChange: handleOpenChange,
        closeOnEscape,
        closeOnInteractOutside,
        restoreFocus,
        autoFocus,
        lazyMount,
        present,
        onExitComplete: handleExitComplete,
        unmountOnExit: false,
        portalled: false,
        initialFocusEl: initialFocusRef
            ? () => (initialFocusRef.current as HTMLElement | null)
            : undefined
    };

    const dismiss = useCallback(() => {
        if (trigger === "hover") {
            hover.setOpen(false);
        }
    }, [hover, trigger]);

    const uiValue = useMemo(
        () => ({
            hasArrow: hasArrow ?? false,
            usePortal,
            portalProps,
            reduceMotion,
            arrowSize,
            arrowShadowColor,
            trigger,
            contentHoverProps: hover.contentHoverProps,
            triggerHoverProps: hover.triggerHoverProps,
            onClose: dismiss,
            onExitComplete: handleExitComplete,
            present
        }),
        [
            arrowShadowColor,
            arrowSize,
            dismiss,
            handleExitComplete,
            hasArrow,
            present,
            hover.contentHoverProps,
            hover.triggerHoverProps,
            portalProps,
            reduceMotion,
            trigger,
            usePortal
        ]
    );

    return (
        <PopoverUiProvider value={uiValue}>
            <ArkPopover.Root {...arkRootProps}>
                {typeof children === "function" ? (
                    <ArkPopover.Context>
                        {(api) =>
                            runIfFn(children, {
                                open: api.open,
                                setOpen: api.setOpen
                            })
                        }
                    </ArkPopover.Context>
                ) : (
                    children
                )}
            </ArkPopover.Root>
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

/**
 * Popover Arrow — pointer connecting the popover to its anchor.
 */
export const Arrow = withContext(function PopoverArrow(props: PopoverArrowProps) {
    const { arrowSize, arrowShadowColor } = usePopoverUi();

    const arrowStyle = {
        "--arrow-size": `${arrowSize ?? 8}px`,
        "--arrow-background": "var(--colors-bg-panel)",
        ...(arrowShadowColor ? { "--popper-arrow-shadow": arrowShadowColor } : {})
    } satisfies CSSProperties;

    return (
        <ArkPopover.Arrow
            {...props}
            style={{ ...arrowStyle, ...props.style }}
        >
            <ArkPopover.ArrowTip />
        </ArkPopover.Arrow>
    );
}, "arrow");

export interface PopoverTransitionProps extends Omit<MotionBoxProps, "children"> {
    children?: React.ReactNode;
    arrowProps?: PopoverArrowProps;
}

export interface PopoverPositionerProps {
    className?: string;
    style?: React.CSSProperties;
}

export interface PopoverContentProps extends PopoverTransitionProps {
    rootProps?: PopoverPositionerProps;
    motionProps?: Omit<MotionBoxProps, "children">;
}

/**
 * Popover Content — the floating panel rendered in a portal.
 */
function PopoverTransition(props: PopoverTransitionProps) {
    const { children, arrowProps, onAnimationComplete, ...rest } = props;
    const { hasArrow, reduceMotion, contentHoverProps, arrowSize, onExitComplete } =
        usePopoverUi();
    const { open } = useArkPopoverContext();
    const { popover: motionVariants } = useMotionVariants();

    const motionStyle: CSSProperties = {
        "--arrow-size": `${arrowSize ?? 8}px`,
        "--arrow-background": "var(--colors-bg-panel)",
        ...rest.style
    };

    return (
        <MotionBox
            animate={open ? "initial" : "exit"}
            exit="exit"
            initial={reduceMotion ? false : "exit"}
            variants={transformReducedMotion(motionVariants, reduceMotion)}
            onAnimationComplete={(definition) => {
                onAnimationComplete?.(definition);
                if (!open && !reduceMotion) {
                    onExitComplete();
                }
            }}
            {...contentHoverProps}
            {...rest}
            {...(reduceMotion ? {} : { hidden: false })}
            style={motionStyle}
        >
            {hasArrow && <Arrow {...arrowProps} />}
            {children}
        </MotionBox>
    );
}

export const Content = withContext(function PopoverContent(props: PopoverContentProps) {
    const { rootProps, motionProps, arrowProps, onAnimationComplete, children, ...contentProps } =
        props;

    const { usePortal, portalProps, trigger, present } = usePopoverUi();
    const { open } = useArkPopoverContext();

    if (typeof document === "undefined") {
        return null;
    }

    const resolvedRole =
        trigger === "hover" ? "tooltip" : (contentProps.role as string | undefined);

    const { style: rootStyle, ...restRootProps } = rootProps ?? {};

    const rendered = (
        <ArkPopover.Positioner
            {...restRootProps}
            style={{
                pointerEvents: open ? undefined : "none",
                ...rootStyle
            }}
        >
            <ArkPopover.Content asChild>
                <PopoverTransition
                    {...motionProps}
                    {...contentProps}
                    arrowProps={arrowProps}
                    onAnimationComplete={onAnimationComplete}
                    role={resolvedRole}
                    tabIndex={contentProps.tabIndex}
                >
                    {children}
                </PopoverTransition>
            </ArkPopover.Content>
        </ArkPopover.Positioner>
    );

    return usePortal ? (
        <Portal
            isActive={present}
            zIndex="var(--z-index-popover)"
            {...portalProps}
        >
            {rendered}
        </Portal>
    ) : (
        rendered
    );
}, "content");

export interface PopoverHeaderProps extends HTMLDreamyProps<"header"> {}

/**
 * Popover Header — title area at the top of the popover.
 */
export const Header = withContext(function PopoverHeader(props: PopoverHeaderProps) {
    const { children, ...rest } = props;

    return (
        <ArkPopover.Title asChild>
            <dreamy.header {...rest}>{children}</dreamy.header>
        </ArkPopover.Title>
    );
}, "header");

export interface PopoverBodyProps extends HTMLDreamyProps<"div"> {}

/**
 * Popover Body — main content area of the popover.
 */
export const Body = withContext(function PopoverBody(props: PopoverBodyProps) {
    return (
        <ArkPopover.Description asChild>
            <dreamy.div {...props} />
        </ArkPopover.Description>
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
    const api = useArkPopoverContext();

    return (
        <CloseButtonComponent
            {...props}
            onClick={callAllHandlers(props.onClick, () => api.setOpen(false))}
            size="sm"
        />
    );
}, "close");

/**
 * Popover Anchor — positioning reference element for the popover.
 */
export function Anchor(props: React.PropsWithChildren) {
    const child = Children.only(props.children) as React.ReactElement<Record<string, unknown>> & {
        ref?: React.Ref<Element>;
    };

    return (
        <ArkPopover.Anchor asChild>
            {cloneElement(child, { ...child.props, ref: child.ref })}
        </ArkPopover.Anchor>
    );
}

/**
 * Popover Trigger — opens the popover when activated.
 */
export function Trigger(props: { children: React.ReactNode }) {
    const child = Children.only(props.children) as React.ReactElement<Record<string, unknown>> & {
        ref?: React.Ref<Element>;
    };
    const { triggerHoverProps, trigger } = usePopoverUi();

    if (trigger === "hover" && triggerHoverProps) {
        return (
            <ArkPopover.Trigger asChild>
                {cloneElement(child, {
                    ...child.props,
                    ...triggerHoverProps,
                    onClick: callAllHandlers(
                        child.props.onClick as React.MouseEventHandler<HTMLElement> | undefined,
                        (event: React.MouseEvent<HTMLElement>) => {
                            event.preventDefault();
                        }
                    ),
                    ref: child.ref
                })}
            </ArkPopover.Trigger>
        );
    }

    return (
        <ArkPopover.Trigger asChild>
            {cloneElement(child, { ...child.props, ref: child.ref })}
        </ArkPopover.Trigger>
    );
}
