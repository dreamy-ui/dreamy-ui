import { Box } from "@/components/box";
import { Portal, type PortalProps } from "@/components/portal";
import { type UseTooltipProps, useTooltip } from "@/components/tooltip/use-tooltip";
import { useMotionVariants } from "@/provider";
import { omit, pick } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { isCssProperty, styled } from "@dreamy-ui/system/jsx";
import { tooltip } from "@dreamy-ui/system/recipes";
import { AnimatePresence, type HTMLMotionProps, isValidMotionProp, m } from "framer-motion";
import { Children, Fragment, cloneElement, forwardRef, useMemo } from "react";

export interface TooltipProps
    extends Omit<HTMLDreamProps<"div">, "direction" | "offset" | "content">,
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

const StyledTooltip = styled(m.div, tooltip, {
    shouldForwardProp: (prop, variantKeys) =>
        isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
});

/**
 * Tooltips display informative text when users hover, focus on, or tap an element.
 *
 * @see Docs https://dream-ui.com/docs/components/tooltip
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
        return cloneElement(child, tooltip.getTriggerProps(child.props, child.ref));
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
                    <PortalComponent {...(disablePortal ? {} : (portalProps as any))}>
                        <Box
                            {...tooltip.getTooltipPositionerProps()}
                            style={{
                                pointerEvents: "none"
                            }}
                        >
                            <StyledTooltip
                                variants={variants}
                                initial="exit"
                                animate="initial"
                                exit="exit"
                                {...motionProps}
                                {...(tooltipProps as any)}
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

Tooltip.displayName = "Tooltip";
