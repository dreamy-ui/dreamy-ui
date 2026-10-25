"use client";

import {
    Tooltip as ArkTooltip,
    type TooltipRootProps as ArkTooltipRootProps,
    useTooltipContext as useArkTooltipContext
} from "@ark-ui/react/tooltip";
import {
    Portal,
    type PortalProps,
    type PositioningProps,
    transformReducedMotion,
    useMotionVariants,
    useReducedMotion
} from "@dreamy-ui/react";
import {
    Children,
    Fragment,
    cloneElement,
    useCallback,
    useId,
    useMemo,
    useState,
    type CSSProperties,
    type ComponentType
} from "react";
import { createStyleContext, dreamy, type HTMLDreamyProps } from "styled-system/jsx";
import { tooltip } from "styled-system/recipes";
import { Box } from "./box";
import { MotionBox, type MotionBoxProps } from "./motion";
import { mapPositioningProps } from "./map-positioning";
import { useFloatingPresent } from "./use-floating-present";

export interface TooltipProps
    extends Omit<ArkTooltipRootProps, "positioning" | "lazyMount" | "unmountOnExit">,
        Omit<HTMLDreamyProps<"div">, "content"> {
    /**
     * The React component to use as the trigger for the tooltip
     */
    children: React.ReactNode;
    /**
     * The label of the tooltip
     */
    content?: React.ReactNode;
    /**
     * The accessible, human friendly label to use for screen readers.
     */
    "aria-label"?: string;
    /**
     * If `true`, the tooltip will wrap its children in a `<span/>` with `tabIndex=0`
     * @default false
     */
    shouldWrapChildren?: boolean;
    /**
     * If `true`, the tooltip will show an arrow tip
     * @default true
     */
    hasArrow?: boolean;
    /**
     * Size of the tooltip arrow in pixels.
     * @default 8
     */
    arrowSize?: number;
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
    motionProps?: MotionBoxProps;
    /**
     * Positioning configuration for the tooltip floating element.
     */
    positioning?: PositioningProps;
}

const { withRootProvider, withContext } = createStyleContext(tooltip);

const TooltipRoot = withRootProvider(function TooltipRootBase({
    children
}: {
    children: React.ReactNode;
}) {
    return children;
});

const TooltipTrigger = withContext(function TooltipTriggerBase(props: HTMLDreamyProps<"span">) {
    return <dreamy.span {...props} />;
}, "trigger");

const StyledTooltip = withContext(function TooltipContent(props: MotionBoxProps) {
    return <MotionBox {...props} />;
}, "content") as ComponentType<MotionBoxProps>;

export interface TooltipArrowProps extends HTMLDreamyProps<"div"> {}

const TooltipArrow = withContext(function TooltipArrowBase(props: TooltipArrowProps) {
    return (
        <ArkTooltip.Arrow {...props}>
            <ArkTooltip.ArrowTip />
        </ArkTooltip.Arrow>
    );
}, "arrow");

interface TooltipFloaterProps {
    content: React.ReactNode;
    hasArrow: boolean;
    arrowSize: number;
    hasAriaLabel: boolean;
    ariaLabel?: string;
    motionProps?: MotionBoxProps;
    ref?: React.Ref<HTMLDivElement>;
    disablePortal: boolean;
    portalProps?: Omit<PortalProps, "children">;
    disabled?: boolean;
    present: boolean;
    reduceMotion: boolean;
    onExitComplete: () => void;
}

function TooltipFloater(props: TooltipFloaterProps) {
    const {
        content,
        hasArrow,
        arrowSize,
        hasAriaLabel,
        ariaLabel,
        motionProps,
        ref,
        disablePortal,
        portalProps,
        disabled,
        present,
        reduceMotion,
        onExitComplete
    } = props;

    const { open } = useArkTooltipContext();
    const { tooltip: variants } = useMotionVariants();
    const srLabelId = useId();
    const { onAnimationComplete: motionOnAnimationComplete, style, ...restMotionProps } =
        motionProps ?? {};

    const contentStyle = {
        "--arrow-size": `${arrowSize}px`,
        "--arrow-background": "var(--tooltip-bg)",
        ...style
    } satisfies CSSProperties;

    if (disabled) {
        return null;
    }

    const PortalComponent = disablePortal ? Fragment : Portal;

    const floating = (
        <ArkTooltip.Positioner>
            <ArkTooltip.Content
                asChild
                aria-label={hasAriaLabel ? ariaLabel : undefined}
            >
                <StyledTooltip
                    animate={open ? "initial" : "exit"}
                    exit="exit"
                    initial={reduceMotion ? false : "exit"}
                    variants={transformReducedMotion(variants, reduceMotion)}
                    {...restMotionProps}
                    style={contentStyle}
                    onAnimationComplete={(definition) => {
                        motionOnAnimationComplete?.(definition);
                        if (!open && !reduceMotion) {
                            onExitComplete();
                        }
                    }}
                    ref={ref}
                >
                    {content}
                    {hasAriaLabel && (
                        <Box
                            as="span"
                            srOnly
                            id={srLabelId}
                            role="tooltip"
                        >
                            {ariaLabel}
                        </Box>
                    )}
                    {hasArrow && (
                        <TooltipArrow
                            style={{
                                "--arrow-size": `${arrowSize}px`,
                                "--arrow-background": "var(--tooltip-bg)"
                            }}
                        />
                    )}
                </StyledTooltip>
            </ArkTooltip.Content>
        </ArkTooltip.Positioner>
    );

    return (
        <PortalComponent
            {...(disablePortal
                ? {}
                : {
                      isActive: present,
                      zIndex: "var(--z-index-tooltip)",
                      ...portalProps
                  })}
        >
            {floating}
        </PortalComponent>
    );
}

/**
 * Tooltip component — informative text on hover, focus, or tap.
 *
 * @see Docs https://dreamy-ui.com/docs/components/tooltip
 */
export function Tooltip(props: TooltipProps) {
    const {
        children,
        content,
        shouldWrapChildren,
        "aria-label": ariaLabel,
        hasArrow = true,
        arrowSize = 8,
        portalProps,
        motionProps,
        disablePortal = false,
        positioning,
        open,
        defaultOpen,
        onOpenChange,
        closeOnEscape = true,
        disabled,
        closeOnClick,
        closeOnPointerDown,
        closeOnScroll,
        openDelay,
        closeDelay,
        id,
        ref,
        ...rest
    } = props;

    const generatedId = useId();
    const [trackedOpen, setTrackedOpen] = useState(defaultOpen ?? false);
    const reducedMotion = useReducedMotion() ?? false;
    const resolvedOpen = open ?? trackedOpen;
    const { present, handleExitComplete } = useFloatingPresent(resolvedOpen, reducedMotion);

    const handleOpenChange = useCallback(
        (details: { open: boolean }) => {
            setTrackedOpen(details.open);
            onOpenChange?.(details);
        },
        [onOpenChange]
    );

    const arkRootProps: ArkTooltipRootProps = {
        id: id ?? generatedId,
        openDelay,
        closeDelay,
        closeOnClick,
        closeOnPointerDown,
        closeOnScroll,
        disabled,
        positioning: mapPositioningProps(positioning),
        ...(open !== undefined ? { open } : {}),
        ...(open === undefined ? { defaultOpen } : {}),
        onOpenChange: handleOpenChange,
        closeOnEscape,
        present,
        onExitComplete: handleExitComplete,
        unmountOnExit: false
    };

    const shouldWrap = shouldWrapChildren || typeof children === "string";

    const trigger = useMemo(() => {
        if (shouldWrap) {
            return (
                <ArkTooltip.Trigger asChild>
                    <TooltipTrigger tabIndex={0}>{children}</TooltipTrigger>
                </ArkTooltip.Trigger>
            );
        }

        const child = Children.only(children) as React.ReactElement & {
            ref?: React.Ref<Element>;
        };

        return (
            <ArkTooltip.Trigger asChild>
                {cloneElement(child, { ...child.props, ref: child.ref })}
            </ArkTooltip.Trigger>
        );
    }, [children, shouldWrap]);

    if (!content) {
        return <>{children}</>;
    }

    const hasAriaLabel = !!ariaLabel;

    return (
        <TooltipRoot {...rest}>
            <ArkTooltip.Root {...arkRootProps}>
                {trigger}
                <TooltipFloater
                    ariaLabel={ariaLabel}
                    content={content}
                    disablePortal={disablePortal}
                    hasAriaLabel={hasAriaLabel}
                    hasArrow={hasArrow}
                    arrowSize={arrowSize}
                    disabled={disabled}
                    motionProps={motionProps}
                    onExitComplete={handleExitComplete}
                    portalProps={portalProps}
                    present={present}
                    reduceMotion={reducedMotion}
                    ref={ref}
                />
            </ArkTooltip.Root>
        </TooltipRoot>
    );
}
