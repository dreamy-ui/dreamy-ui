"use client";

import {
    Portal,
    type PortalProps,
    type UseTooltipProps,
    omit,
    pick,
    useMotionVariants,
    useTooltip
} from "@dreamy-ui/react";
import { AnimatePresence, type HTMLMotionProps, m } from "motion/react";
import { Children, Fragment, cloneElement, forwardRef, useMemo } from "react";
import { tooltip } from "styled-system/recipes";
import { Box } from "./box";
import { type HTMLDreamyProps, dreamy } from "./factory";

export interface TooltipProps
    extends Omit<HTMLDreamyProps<"div">, "direction" | "offset" | "content">,
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
    portalProps?: Pick<PortalProps, "appendToParentPortal" | "containerRef">;
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

const StyledTooltip = m.create(dreamy("div", tooltip), { forwardMotionProps: true });

/**
 * Tooltips display informative text when users hover, focus on, or tap an element.
 *
 * @see Docs https://dreamy-ui.com/docs/components/tooltip
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
    const {
        children,
        content,
        shouldWrapChildren,
        "aria-label": ariaLabel,
        hasArrow = true,
        isDisabled,
        portalProps,
        direction,
        motionProps,
        disablePortal = false,
        ...rest
    } = props;

    const tooltip = useTooltip({ ...rest, direction: direction ?? "ltr" });

    const shouldWrap = shouldWrapChildren || typeof children === "string";

    const trigger = useMemo(() => {
        if (shouldWrap) {
            return (
                <Box
                    as={"span"}
                    display="inline-block"
                    tabIndex={0}
                    {...tooltip.getTriggerProps()}
                >
                    {children}
                </Box>
            );
        }
        /**
         * Ensure tooltip has only one child node
         */
        const child = Children.only(children) as React.ReactElement & {
            ref?: React.Ref<any>;
        };
        return cloneElement(child, tooltip.getTriggerProps(child.props as object, child.ref));
    }, [shouldWrap, children, tooltip.getTriggerProps]);

    const hasAriaLabel = !!ariaLabel;

    const _tooltipProps = useMemo(
        () => tooltip.getTooltipProps(undefined, ref),
        [tooltip.getTooltipProps, ref]
    );

    const tooltipProps = useMemo(
        () => (hasAriaLabel ? omit(_tooltipProps, ["role", "id"]) : _tooltipProps),
        [hasAriaLabel, _tooltipProps]
    );

    const srOnlyProps = useMemo(() => pick(_tooltipProps, ["role", "id"]), [_tooltipProps]);

    const {
        tooltip: { default: variants }
    } = useMotionVariants();

    const PortalComponent = useMemo(() => (disablePortal ? Fragment : Portal), [disablePortal]);

    /**
     * If the `label` is empty, there's no point showing the tooltip.
     * Let's simply return the children
     */
    if (!content) {
        return <>{children}</>;
    }

    return (
        <>
            {trigger}
            <AnimatePresence>
                {tooltip.isOpen && !isDisabled && (
                    <PortalComponent {...(disablePortal ? {} : portalProps)}>
                        <Box {...tooltip.getTooltipPositionerProps()}>
                            <StyledTooltip
                                variants={variants}
                                initial="exit"
                                animate="initial"
                                exit="exit"
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
                                    <Box data-popper-arrow>
                                        <Box data-popper-arrow-inner />
                                    </Box>
                                )}
                            </StyledTooltip>
                        </Box>
                    </PortalComponent>
                )}
            </AnimatePresence>
        </>
    );
});
