"use client";

import {
    Portal,
    type PortalProps,
    type UseTooltipProps,
    omit,
    pick,
    transformReducedMotion,
    useMotionVariants,
    useReducedMotion,
    useTooltip
} from "@dreamy-ui/react";
import { AnimatePresence, type HTMLMotionProps } from "motion/react";
import { Children, Fragment, cloneElement, useMemo, type ComponentType } from "react";
import { createStyleContext, dreamy, type HTMLDreamyProps } from "styled-system/jsx";
import { tooltip } from "styled-system/recipes";
import { Box } from "./box";
import { MotionBox, type MotionBoxProps } from "./motion";

export interface TooltipProps
    extends Omit<HTMLDreamyProps<"div">, "content">,
        Partial<UseTooltipProps> {
    /**
     * The React component to use as the
     * trigger for the tooltip
     */
    children: React.ReactNode;
    /**
     * The label of the tooltip
     */
    content?: React.ReactNode;
    /**
     * The accessible, human friendly label to use for
     * screen readers.
     *
     * If passed, tooltip will show the content `label`
     * but expose only `aria-label` to assistive technologies
     */
    "aria-label"?: string;
    /**
     * If `true`, the tooltip will wrap its children
     * in a `<span/>` with `tabIndex=0`
     * @default false
     */
    shouldWrapChildren?: boolean;
    /**
     * If `true`, the tooltip will show an arrow tip
     * @default false
     */
    hasArrow?: boolean;
    /**
     * Props to be forwarded to the portal component
     */
    portalProps?: Omit<PortalProps, "children">;
    /**
     * If `true`, the tooltip will not be rendered inside a portal
     * @default false
     */
    disablePortal?: boolean;
    /**
     * Props to be forwarded to the motion component
     */
    motionProps?: HTMLMotionProps<"div">;
}

const { withProvider, withContext } = createStyleContext(tooltip);

const TooltipRoot = withProvider(function TooltipRootBase({
    children,
    ...props
}: HTMLDreamyProps<"div">) {
    return <dreamy.div {...props}>{children}</dreamy.div>;
}, "root");

const TooltipTrigger = withContext(function TooltipTriggerBase(props: HTMLDreamyProps<"span">) {
    return <dreamy.span {...props} />;
}, "trigger");

const StyledTooltip = withContext(function TooltipContent(props: MotionBoxProps) {
    return <MotionBox {...props} />;
}, "content") as ComponentType<MotionBoxProps>;

/**
 * Tooltips display informative text when users hover, focus on, or tap an element.
 *
 * @see Docs https://dreamy-ui.com/docs/components/tooltip
 */
export function Tooltip(props: TooltipProps) {
    const { ref } = props;
    const {
        children,
        content,
        shouldWrapChildren,
        "aria-label": ariaLabel,
        hasArrow = true,
        isDisabled,
        portalProps,
        motionProps,
        disablePortal = false,
        ...rest
    } = props;

    const tooltip = useTooltip(rest);

    const shouldWrap = shouldWrapChildren || typeof children === "string";

    const trigger = useMemo(() => {
        if (shouldWrap) {
            return (
                <TooltipTrigger
                    tabIndex={0}
                    {...tooltip.getTriggerProps()}
                >
                    {children}
                </TooltipTrigger>
            );
        }
        /**
         * Ensure tooltip has only one child node
         */
        const child = Children.only(children) as React.ReactElement & {
            ref?: React.Ref<Element>;
        };
        return cloneElement(child, tooltip.getTriggerProps(child.props as object));
    }, [shouldWrap, children, tooltip.getTriggerProps]);

    const hasAriaLabel = !!ariaLabel;

    const _tooltipProps = useMemo(
        () => tooltip.getTooltipProps({ ref }),
        [tooltip.getTooltipProps, ref]
    );

    const tooltipProps = useMemo(
        () => (hasAriaLabel ? omit(_tooltipProps, ["role", "id"]) : _tooltipProps),
        [hasAriaLabel, _tooltipProps]
    );

    const srOnlyProps = useMemo(() => pick(_tooltipProps, ["role", "id"]), [_tooltipProps]);

    const { tooltip: variants } = useMotionVariants();

    const PortalComponent = useMemo(() => (disablePortal ? Fragment : Portal), [disablePortal]);

    const reducedMotion = useReducedMotion();

    /**
     * If the `label` is empty, there's no point showing the tooltip.
     * Let's simply return the children
     */
    if (!content) {
        return <>{children}</>;
    }

    return (
        <TooltipRoot>
            {trigger}
            <AnimatePresence>
                {tooltip.isOpen && !isDisabled && (
                    <PortalComponent
                        {...(disablePortal
                            ? {}
                            : {
                                  isActive: tooltip.isOpen,
                                  zIndex: "var(--z-index-tooltip)",
                                  ...portalProps
                              })}
                    >
                        <Box {...tooltip.getTooltipPositionerProps()}>
                            <StyledTooltip
                                animate="initial"
                                exit="exit"
                                initial="exit"
                                variants={transformReducedMotion(variants, reducedMotion)}
                                {...motionProps}
                                {...tooltipProps}
                            >
                                {content}
                                {hasAriaLabel && (
                                    <Box
                                        as={"span"}
                                        srOnly
                                        {...srOnlyProps}
                                    >
                                        {ariaLabel}
                                    </Box>
                                )}
                                {hasArrow && (
                                    <Box {...tooltip.getArrowProps({ style: { backgroundColor: "transparent" } })}>
                                        <Box {...tooltip.getArrowInnerProps()} />
                                    </Box>
                                )}
                            </StyledTooltip>
                        </Box>
                    </PortalComponent>
                )}
            </AnimatePresence>
        </TooltipRoot>
    );
}
