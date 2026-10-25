"use client";

import {
    HoverCard as ArkHoverCard,
    type HoverCardRootProps as ArkHoverCardRootProps,
    useHoverCardContext as useArkHoverCardContext
} from "@ark-ui/react/hover-card";
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
import { Children, cloneElement, useEffect, useId } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import type { HoverCardVariantProps } from "styled-system/recipes";
import { hoverCard } from "styled-system/recipes";
import { Box, type BoxProps } from "../box";
import { Heading } from "../heading";
import { MotionBox, type MotionBoxProps } from "../motion";
import { mapPositioningProps } from "../popover/map-positioning";
import { HoverCardUiProvider, useHoverCardUi } from "./hover-card-ui-context";

const { withContext, withRootProvider } = createStyleContext(hoverCard, {
    forwardVariants: ["size"]
});

export interface HoverCardProps
    extends Omit<ArkHoverCardRootProps, "positioning" | "lazyMount" | "unmountOnExit">,
        HoverCardVariantProps {
    /**
     * The content of the hover card. Usually `HoverCard.Trigger` and `HoverCard.Content`.
     */
    children?: MaybeRenderProp<{
        open: boolean;
        setOpen: (open: boolean) => void;
    }>;
    /**
     * If `true`, the hover card will show an arrow pointing to the trigger.
     * @default true
     */
    hasArrow?: boolean;
    /**
     * If `true`, the hover card content will be rendered in a portal.
     * @default true
     */
    usePortal?: boolean;
    /**
     * Props forwarded to the `Portal` used by `HoverCard.Content`.
     */
    portalProps?: Omit<PortalProps, "children">;
    /**
     * Positioning configuration for the hover card floating element.
     */
    positioning?: PositioningProps;
    /**
     * If `true`, hover card open/close animations are disabled.
     */
    reduceMotion?: boolean;
}

function HoverCardRoot(props: HoverCardProps) {
    const {
        children,
        hasArrow = true,
        usePortal = true,
        portalProps,
        positioning,
        onOpenChange,
        reduceMotion: reduceMotionProp,
        openDelay = 300,
        closeDelay = 300,
        ...arkRest
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;

    const arkRootProps: ArkHoverCardRootProps = {
        ...arkRest,
        openDelay,
        closeDelay,
        positioning: mapPositioningProps(positioning),
        onOpenChange
    };

    return (
        <HoverCardUiProvider
            value={{
                hasArrow,
                usePortal,
                portalProps,
                reduceMotion
            }}
        >
            <ArkHoverCard.Root {...arkRootProps}>
                {typeof children === "function" ? (
                    <ArkHoverCard.Context>
                        {(api) =>
                            runIfFn(children, {
                                open: api.open,
                                setOpen: api.setOpen
                            })
                        }
                    </ArkHoverCard.Context>
                ) : (
                    children
                )}
            </ArkHoverCard.Root>
        </HoverCardUiProvider>
    );
}

/**
 * Hover Card component — rich preview panel shown on hover or focus.
 *
 * @see Docs https://dreamy-ui.com/docs/components/hover-card
 */
export const Root = withRootProvider(HoverCardRoot);

export interface HoverCardArrowProps extends HTMLDreamyProps<"div"> {}

/**
 * Hover Card Arrow — pointer indicating the trigger element.
 */
export function Arrow(props: HoverCardArrowProps) {
    const side = "bottom";
    const staticSide =
        ({ top: "bottom", right: "left", bottom: "top", left: "right" } as const)[side] ?? "bottom";

    return (
        <ArkHoverCard.Arrow
            data-popper-arrow=""
            style={{
                backgroundColor: "transparent",
                position: "absolute",
                [staticSide]: "calc(var(--popper-arrow-size, 8px) / -2 + 1px)",
                width: "var(--popper-arrow-size, 8px)",
                height: "var(--popper-arrow-size, 8px)",
                zIndex: -1
            }}
        >
            <Box
                data-popper-arrow-inner=""
                style={{
                    transform: "rotate(45deg)",
                    background: "var(--popper-arrow-bg, var(--popper-arrow-bg))",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    zIndex: "inherit"
                }}
                {...props}
            />
        </ArkHoverCard.Arrow>
    );
}

export interface HoverCardTransitionProps extends Omit<MotionBoxProps, "children"> {
    children?: React.ReactNode;
    arrowProps?: HoverCardArrowProps;
}

function Transition(props: HoverCardTransitionProps) {
    const { children, arrowProps, onKeyDown, ...rest } = props;
    const { hasArrow, reduceMotion, contentLabelId } = useHoverCardUi();
    const { open, setOpen } = useArkHoverCardContext();

    const { popover: motionVariants } = useMotionVariants();

    return (
        <MotionBox
            animate={open ? "initial" : "exit"}
            initial={false}
            variants={transformReducedMotion(motionVariants, reduceMotion)}
            role="dialog"
            aria-labelledby={contentLabelId}
            tabIndex={-1}
            onKeyDown={(event) => {
                onKeyDown?.(event);
                if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false);
                }
            }}
            {...rest}
        >
            {hasArrow && <Arrow {...arrowProps} />}
            {children}
        </MotionBox>
    );
}

export interface HoverCardContentProps extends HoverCardTransitionProps {
    rootProps?: HTMLDreamyProps<"div">;
    motionProps?: Omit<MotionBoxProps, "children">;
}

/**
 * Hover Card Content — positioned panel revealed on hover or focus.
 */
export const Content = withContext(function HoverCardContent(props: HoverCardContentProps) {
    const { rootProps, motionProps, arrowProps, children, ...contentProps } = props;
    const { usePortal, portalProps, setContentId } = useHoverCardUi();
    const { open } = useArkHoverCardContext();
    const contentId = useId();

    useEffect(() => {
        setContentId(contentId);
    }, [contentId, setContentId]);

    if (typeof document === "undefined") return null;

    const rendered = (
        <ArkHoverCard.Positioner {...rootProps}>
            <ArkHoverCard.Content asChild>
                <Transition
                    id={contentId}
                    {...motionProps}
                    {...contentProps}
                    arrowProps={arrowProps}
                >
                    {children}
                </Transition>
            </ArkHoverCard.Content>
        </ArkHoverCard.Positioner>
    );

    return usePortal ? (
        <Portal
            isActive={open}
            zIndex="var(--z-index-popover)"
            {...portalProps}
        >
            {rendered}
        </Portal>
    ) : (
        rendered
    );
}, "content");

export interface HoverCardHeaderProps extends HTMLDreamyProps<"header"> {}

/**
 * Hover Card Header — top section for title or summary content.
 */
export const Header = withContext(function HoverCardHeader(props: HoverCardHeaderProps) {
    const { children, ...rest } = props;
    const labelId = useId();
    const { setContentLabelId } = useHoverCardUi();

    useEffect(() => {
        setContentLabelId(labelId);
    }, [labelId, setContentLabelId]);

    return (
        <Box
            as="header"
            id={labelId}
            {...rest}
        >
            {typeof children === "string" ? (
                <Heading size="md">{children}</Heading>
            ) : (
                children
            )}
        </Box>
    );
}, "header");

export interface HoverCardBodyProps extends HTMLDreamyProps<"div"> {}

/**
 * Hover Card Body — main content area of the hover card.
 */
export const Body = withContext(function HoverCardBody(props: HoverCardBodyProps) {
    return <Box {...props} />;
}, "body");

export interface HoverCardFooterProps extends BoxProps {}

/**
 * Hover Card Footer — bottom section for actions or metadata.
 */
export const Footer = withContext(function HoverCardFooter(props: HoverCardFooterProps) {
    return (
        <Box
            as="footer"
            {...props}
        />
    );
}, "footer");

/**
 * Hover Card Trigger — interactive element that opens the hover card.
 */
export function Trigger(props: { children: React.ReactNode }) {
    const child = Children.only(props.children) as React.ReactElement<Record<string, unknown>> & {
        ref?: React.Ref<Element>;
    };
    const { open, setOpen } = useArkHoverCardContext();
    const { contentId } = useHoverCardUi();

    return (
        <ArkHoverCard.Trigger asChild>
            {cloneElement(child, {
                ...child.props,
                ref: child.ref,
                ...(open && contentId
                    ? {
                          "aria-controls": contentId,
                          "aria-expanded": true
                      }
                    : { "aria-expanded": false }),
                onKeyDown: callAllHandlers(
                    child.props.onKeyDown as React.KeyboardEventHandler<HTMLElement> | undefined,
                    (event: React.KeyboardEvent<HTMLElement>) => {
                        if (event.key === "Escape" && open) {
                            event.preventDefault();
                            setOpen(false);
                        }
                    }
                )
            })}
        </ArkHoverCard.Trigger>
    );
}
