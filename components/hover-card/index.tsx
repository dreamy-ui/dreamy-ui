"use client";

import {
    type DreamyHostProps,
    type PositioningProps,
    UiSdkMotionSync,
    mergeMotionRefs,
    transformReducedMotion,
    useMotionVariants,
    useReducedMotion,
    useUiSdkMotion
} from "@dreamy-ui/react";
import {
    HoverCard as UiSdkHoverCard,
    HoverCardArrow as UiSdkHoverCardArrow,
    HoverCardContent as UiSdkHoverCardContent,
    type HoverCardProps as UiSdkHoverCardProps,
    HoverCardTrigger as UiSdkHoverCardTrigger
} from "@ui-sdk/react/hover-card";
import type React from "react";
import { Children, type CSSProperties, type ReactElement, type ReactNode, useMemo } from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { type HoverCardVariantProps, hoverCard } from "styled-system/recipes";
import { Heading } from "../heading";
import { MotionBox } from "../motion";
import { mapUiSdkPositioning } from "../popover/map-positioning";
import { HoverCardUiProvider, useHoverCardUi } from "./hover-card-ui-context";

const { withContext, withRootProvider } = createStyleContext(hoverCard, {
    forwardVariants: ["size"]
});

export interface HoverCardProps
    extends Omit<UiSdkHoverCardProps, "children">,
        HoverCardVariantProps {
    /**
     * The content of the hover card. Usually `HoverCard.Trigger` and `HoverCard.Content`.
     */
    children?: ReactNode;
    /**
     * If `true`, the hover card will show an arrow pointing to the trigger.
     * @default true
     */
    hasArrow?: boolean;
    /**
     * Size of the hover card arrow in pixels.
     * @default 8
     */
    arrowSize?: number;
    /**
     * Positioning configuration mapped onto UI SDK `side`/`align`/offset props.
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
        arrowSize,
        positioning,
        reduceMotion: reduceMotionProp,
        delay = 300,
        closeDelay = 300,
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
            hasArrow,
            arrowSize,
            reduceMotion,
            motion,
            positioning
        }),
        [arrowSize, hasArrow, motion, positioning, reduceMotion]
    );

    return (
        <HoverCardUiProvider value={uiValue}>
            <UiSdkHoverCard
                {...rest}
                closeDelay={closeDelay}
                defaultOpen={defaultOpen}
                delay={delay}
                onOpenChange={handleOpenChange}
                open={open}
            >
                <UiSdkMotionSync
                    controller={motion}
                    open={open}
                />
                {children}
            </UiSdkHoverCard>
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

interface HoverCardArrowStyle extends CSSProperties {
    "--arrow-size"?: string;
    "--arrow-background"?: string;
}

/**
 * Hover Card Arrow — pointer indicating the trigger element.
 */
export const Arrow = withContext(function HoverCardArrow(props: HoverCardArrowProps) {
    const { arrowSize } = useHoverCardUi();
    const { className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    const arrowStyle: HoverCardArrowStyle = {
        "--arrow-size": `${arrowSize ?? 8}px`,
        "--arrow-background": "var(--colors-bg-panel)",
        ...(style as CSSProperties | undefined)
    };

    return (
        <UiSdkHoverCardArrow
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkHoverCardArrow>)}
            className={mergedClassName}
            style={arrowStyle}
        />
    );
}, "arrow");

type UiSdkHoverCardContentProps = React.ComponentProps<typeof UiSdkHoverCardContent>;
type UiSdkHoverCardContentPickedProps = Pick<
    UiSdkHoverCardContentProps,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "arrowPadding"
    | "anchor"
    | "container"
    | "keepMounted"
>;

export interface HoverCardContentProps
    extends DreamyHostProps<HTMLDreamyProps<"div">, UiSdkHoverCardContentPickedProps, "children">,
        UiSdkHoverCardContentPickedProps {
    children?: ReactNode;
    arrowProps?: HoverCardArrowProps;
}

/**
 * Hover Card Content — positioned panel revealed on hover or focus.
 */
export const Content = withContext(function HoverCardContent(props: HoverCardContentProps) {
    const {
        children,
        className,
        style,
        arrowProps,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        arrowPadding,
        anchor,
        container,
        keepMounted,
        ...rest
    } = props;

    const ui = useHoverCardUi();
    const { popover: popoverVariants } = useMotionVariants();
    const mapped = mapUiSdkPositioning(ui.positioning);
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkHoverCardContent
            {...(domProps as unknown as UiSdkHoverCardContentProps)}
            align={align ?? mapped.align}
            alignOffset={alignOffset ?? mapped.alignOffset}
            anchor={anchor}
            arrowPadding={arrowPadding ?? mapped.arrowPadding}
            className={mergedClassName}
            collisionPadding={collisionPadding ?? mapped.collisionPadding}
            container={container}
            data-reduce-motion={ui.reduceMotion ? "" : undefined}
            keepMounted={keepMounted}
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
                        onAnimationComplete={() => {
                            if (!isOpen) {
                                ui.motion.notifyAnimationComplete("content");
                            }
                        }}
                        ref={mergeMotionRefs(partRef, (el) => {
                            ui.motion.register("content", el as HTMLElement | null);
                        })}
                        style={partStyle as CSSProperties | undefined}
                        variants={transformReducedMotion(popoverVariants, ui.reduceMotion)}
                    >
                        {partChildren}
                    </MotionBox>
                );
            }}
            side={side ?? mapped.side ?? "bottom"}
            sideOffset={sideOffset ?? mapped.sideOffset ?? 8}
            style={style as CSSProperties | undefined}
        >
            {ui.hasArrow ? <Arrow {...arrowProps} /> : null}
            {children}
        </UiSdkHoverCardContent>
    );
}, "content");

export interface HoverCardHeaderProps extends HTMLDreamyProps<"header"> {}

/**
 * Hover Card Header — top section for title or summary content.
 */
export const Header = withContext(function HoverCardHeader(props: HoverCardHeaderProps) {
    const { children, ...rest } = props;

    return (
        <dreamy.header {...rest}>
            {typeof children === "string" ? <Heading size="md">{children}</Heading> : children}
        </dreamy.header>
    );
}, "header");

export interface HoverCardBodyProps extends HTMLDreamyProps<"div"> {}

/**
 * Hover Card Body — main content area of the hover card.
 */
export const Body = withContext(dreamy.div, "body");

export interface HoverCardFooterProps extends HTMLDreamyProps<"footer"> {}

/**
 * Hover Card Footer — bottom section for actions or metadata.
 */
export const Footer = withContext(dreamy.footer, "footer");

export interface HoverCardTriggerProps
    extends Omit<React.ComponentProps<typeof UiSdkHoverCardTrigger>, "render" | "children"> {
    children: ReactNode;
}

/**
 * Hover Card Trigger — interactive element that opens the hover card.
 */
export function Trigger(props: HoverCardTriggerProps) {
    const { children, ...rest } = props;
    const child = Children.only(children) as ReactElement<Record<string, unknown>>;

    return (
        <UiSdkHoverCardTrigger
            {...rest}
            render={child}
        />
    );
}
