"use client";

import {
    type DreamyHostProps,
    type PositioningProps,
    type UiSdkMotionController,
    UiSdkMotionSync,
    mergeMotionRefs,
    transformReducedMotion,
    useMotionVariants,
    useReducedMotion,
    useUiSdkMotion
} from "@dreamy-ui/react";
import {
    Tooltip as UiSdkTooltip,
    TooltipArrow as UiSdkTooltipArrow,
    TooltipContent as UiSdkTooltipContent,
    type TooltipProps as UiSdkTooltipProps,
    TooltipTrigger as UiSdkTooltipTrigger
} from "@ui-sdk/react/tooltip";
import { Children, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { tooltip } from "styled-system/recipes";
import { MotionBox } from "../motion";
import { mapUiSdkPositioning } from "../popover/map-positioning";

type UiSdkTooltipContentProps = React.ComponentProps<typeof UiSdkTooltipContent>;
type UiSdkTooltipPositionProps = Pick<
    UiSdkTooltipContentProps,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "arrowPadding"
    | "anchor"
    | "container"
>;

export interface TooltipProps
    extends Omit<UiSdkTooltipProps, "children" | "container">,
        UiSdkTooltipPositionProps,
        DreamyHostProps<
            HTMLDreamyProps<"div">,
            Omit<UiSdkTooltipProps, "children" | "container"> & UiSdkTooltipPositionProps,
            "content" | "children"
        > {
    /**
     * The React element or text to use as the trigger for the tooltip.
     */
    children: ReactNode;
    /**
     * The content rendered inside the tooltip. When empty, children render directly.
     */
    content?: ReactNode;
    /**
     * Accessible label override for the tooltip content.
     */
    "aria-label"?: string;
    /**
     * If `true`, wraps non-interactive children in a focusable `<span>` trigger.
     * @default false
     */
    shouldWrapChildren?: boolean;
    /**
     * If `true`, the tooltip displays an arrow pointing to the trigger.
     * @default true
     */
    hasArrow?: boolean;
    /**
     * Size of the tooltip arrow in pixels.
     * @default 8
     */
    arrowSize?: number;
    /**
     * Positioning configuration mapped onto UI SDK `side`/`align`/offset props.
     */
    positioning?: PositioningProps;
    /**
     * If `true`, tooltip open/close transitions are disabled.
     */
    reduceMotion?: boolean;
}

const { withRootProvider, withContext } = createStyleContext(tooltip);

const TooltipStyleRoot = withRootProvider(function TooltipStyleRootBase({
    children
}: {
    children: ReactNode;
}) {
    return children;
});

const TooltipTriggerSpan = withContext(dreamy.span, "trigger");

interface TooltipArrowStyle extends CSSProperties {
    "--arrow-size"?: string;
    "--arrow-background"?: string;
}

export interface TooltipArrowProps extends HTMLDreamyProps<"div"> {}

const TooltipArrow = withContext(function TooltipArrowBase(props: TooltipArrowProps) {
    const { className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkTooltipArrow
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkTooltipArrow>)}
            className={mergedClassName}
            style={style as CSSProperties | undefined}
        />
    );
}, "arrow");

interface StyledTooltipContentProps
    extends DreamyHostProps<HTMLDreamyProps<"div">, UiSdkTooltipPositionProps, "children" | "content">,
        UiSdkTooltipPositionProps {
    children?: ReactNode;
    reduceMotion: boolean;
    motion: UiSdkMotionController;
    hasArrow: boolean;
    arrowSize: number;
}

const TooltipContentSlot: (props: StyledTooltipContentProps) => ReactElement = withContext(
    function TooltipContentSlotBase(
        props: StyledTooltipContentProps
    ) {
    const {
        children,
        className,
        style,
        reduceMotion,
        motion,
        hasArrow,
        arrowSize,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        arrowPadding,
        anchor,
        container,
        ...rest
    } = props;
    const { tooltip: tooltipVariants } = useMotionVariants();
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    const contentStyle: TooltipArrowStyle = {
        "--arrow-size": `${arrowSize}px`,
        "--arrow-background": "var(--tooltip-bg)",
        ...(style as CSSProperties | undefined)
    };

    return (
        <UiSdkTooltipContent
            {...(domProps as unknown as UiSdkTooltipContentProps)}
            align={align}
            alignOffset={alignOffset}
            anchor={anchor}
            arrowPadding={arrowPadding}
            className={mergedClassName}
            collisionPadding={collisionPadding}
            container={container}
            data-reduce-motion={reduceMotion ? "" : undefined}
            render={(partProps, state) => {
                const {
                    ref: partRef,
                    style: partStyle,
                    children: partChildren,
                    ...restPartProps
                } = partProps as React.ComponentPropsWithRef<"div">;
                const tooltipState = state as { open?: boolean; instant?: boolean };
                const isOpen = tooltipState?.open ?? motion.isOpen;
                const skipMotion = reduceMotion || Boolean(tooltipState?.instant);

                return (
                    <MotionBox
                        {...(restPartProps as Record<string, unknown>)}
                        animate={isOpen ? "initial" : "exit"}
                        initial={skipMotion ? false : "exit"}
                        onAnimationComplete={() => {
                            if (!isOpen) {
                                motion.notifyAnimationComplete("content");
                            }
                        }}
                        ref={mergeMotionRefs(partRef, (el) => {
                            motion.register("content", el as HTMLElement | null);
                        })}
                        style={partStyle as CSSProperties | undefined}
                        variants={transformReducedMotion(tooltipVariants, skipMotion)}
                    >
                        {partChildren}
                    </MotionBox>
                );
            }}
            side={side}
            sideOffset={sideOffset}
            style={contentStyle}
        >
            {hasArrow ? (
                <TooltipArrow
                    style={
                        {
                            "--arrow-size": `${arrowSize}px`,
                            "--arrow-background": "var(--tooltip-bg)"
                        } as TooltipArrowStyle
                    }
                />
            ) : null}
            {children}
        </UiSdkTooltipContent>
    );
}, "content", { forwardProps: ["container"] } as never) as (
    props: StyledTooltipContentProps
) => ReactElement;

/**
 * Tooltip component — informative text on hover or keyboard focus.
 *
 * @see Docs https://dreamy-ui.com/docs/components/tooltip
 */
export function Tooltip(props: TooltipProps) {
    const {
        children,
        content,
        "aria-label": ariaLabel,
        shouldWrapChildren = false,
        hasArrow = true,
        arrowSize = 8,
        positioning,
        reduceMotion: reduceMotionProp,
        open,
        defaultOpen,
        onOpenChange,
        onOpenChangeComplete,
        onPayloadChange,
        delay,
        closeDelay,
        disabled,
        toggleable,
        closeOnPress,
        type,
        shortcut,
        controller,
        debug,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
        arrowPadding,
        anchor,
        container,
        ...contentRest
    } = props;

    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;
    const motion = useUiSdkMotion({ open, defaultOpen, reduceMotion });
    const handleOpenChange = motion.wrapOnOpenChange(onOpenChange);
    const mapped = mapUiSdkPositioning(positioning);

    if (content === null || content === undefined || content === false) {
        return <>{children}</>;
    }

    const shouldWrap = shouldWrapChildren || typeof children === "string";

    const trigger = shouldWrap ? (
        <UiSdkTooltipTrigger
            render={<TooltipTriggerSpan tabIndex={0}>{children}</TooltipTriggerSpan>}
        />
    ) : (
        <UiSdkTooltipTrigger
            render={Children.only(children) as ReactElement<Record<string, unknown>>}
        />
    );

    const { "data-slot": _dataSlot, ...forwardContentProps } =
        contentRest as typeof contentRest & { "data-slot"?: string };

    return (
        <TooltipStyleRoot>
            <UiSdkTooltip
                closeDelay={closeDelay}
                closeOnPress={closeOnPress}
                container={container}
                controller={controller}
                debug={debug}
                defaultOpen={defaultOpen}
                delay={delay}
                disabled={disabled}
                onOpenChange={handleOpenChange}
                onOpenChangeComplete={onOpenChangeComplete}
                onPayloadChange={onPayloadChange}
                open={open}
                shortcut={shortcut}
                toggleable={toggleable}
                type={type}
            >
                <UiSdkMotionSync
                    controller={motion}
                    open={open}
                />
                {trigger}
                <TooltipContentSlot
                    {...forwardContentProps}
                    align={align ?? mapped.align}
                    alignOffset={alignOffset ?? mapped.alignOffset}
                    anchor={anchor}
                    aria-label={ariaLabel}
                    arrowPadding={arrowPadding ?? mapped.arrowPadding}
                    arrowSize={arrowSize}
                    collisionPadding={collisionPadding ?? mapped.collisionPadding}
                    container={container}
                    hasArrow={hasArrow}
                    motion={motion}
                    reduceMotion={reduceMotion}
                    side={side ?? mapped.side ?? "top"}
                    sideOffset={sideOffset ?? mapped.sideOffset ?? 6}
                >
                    {content}
                </TooltipContentSlot>
            </UiSdkTooltip>
        </TooltipStyleRoot>
    );
}
