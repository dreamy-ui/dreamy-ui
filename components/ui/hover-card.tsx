"use client";

import {
    type MaybeRenderProp,
    PopoverProvider,
    Portal,
    type UseHoverCardProps,
    callAll,
    runIfFn,
    transformReducedMotion,
    useHoverCard,
    useMotionVariants,
    usePopoverContext
} from "@dreamy-ui/react";
import { Children, cloneElement, forwardRef } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { hoverCard } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { Heading } from "./heading";
import { MotionBox, type MotionBoxProps } from "./motion";

const { withContext, withRootProvider } = createStyleContext(hoverCard, {
    forwardVariants: ["size"]
});

export interface HoverCardProps extends UseHoverCardProps {
    /**
     * The content of the hover card. Usually `HoverCard.Trigger` and `HoverCard.Content`.
     */
    children?: MaybeRenderProp<{
        isOpen: boolean;
        onClose: () => void;
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
     * Controlled open state of the hover card.
     */
    isOpen?: boolean;
    /**
     * Initial open state when uncontrolled.
     */
    defaultIsOpen?: boolean;
    /**
     * Callback fired when the hover card opens.
     */
    onOpen?: () => void;
    /**
     * Callback fired when the hover card closes.
     */
    onClose?: () => void;
}

/**
 * HoverCard component
 *
 * @See Docs https://dreamy-ui.com/docs/components/hover-card
 */
export const Root = withRootProvider(function HoverCardRoot(props: HoverCardProps) {
    const { children, direction = "ltr", hasArrow = true, usePortal = true, ...rest } = props;

    const context = useHoverCard({ ...rest, direction });

    return (
        <PopoverProvider
            value={{
                ...context,
                hasArrow,
                usePortal
            }}
        >
            {runIfFn(children, {
                isOpen: context.isOpen,
                onClose: context.onClose
            })}
        </PopoverProvider>
    );
});

export interface HoverCardArrowProps extends HTMLDreamyProps<"div"> {}

export function Arrow(props: HoverCardArrowProps) {
    return (
        <Box
            data-popper-arrow
            style={{
                backgroundColor: "transparent"
            }}
        >
            <Box
                data-popper-arrow-inner
                {...props}
            />
        </Box>
    );
}

export interface HoverCardTransitionProps extends Omit<MotionBoxProps, "children"> {
    children?: React.ReactNode;
    arrowProps?: HoverCardArrowProps;
}

const Transition = forwardRef(function HoverCardTransition(
    props: HoverCardTransitionProps,
    ref: React.Ref<any>
) {
    const { children, arrowProps, ...rest } = props;

    const { isOpen, hasArrow, reduceMotion } = usePopoverContext();
    const { popover } = useMotionVariants();

    return (
        <MotionBox
            animate={isOpen ? "initial" : "exit"}
            initial={false}
            ref={ref}
            variants={transformReducedMotion(popover, reduceMotion)}
            {...rest}
        >
            {hasArrow && <Arrow {...arrowProps} />}
            {children}
        </MotionBox>
    );
});

export interface HoverCardContentProps extends HoverCardTransitionProps {
    rootProps?: HTMLDreamyProps<"div">;
    motionProps?: Omit<MotionBoxProps, "children">;
}

export const Content = withContext(
    forwardRef<HTMLElement, HoverCardContentProps>(function HoverCardContent(props, ref) {
        const { rootProps, motionProps, ...contentProps } = props;

        const { getPopoverProps, getPopoverPositionerProps, onAnimationComplete, usePortal } =
            usePopoverContext();

        if (typeof document === "undefined") return null;

        const content = (
            <div {...getPopoverPositionerProps(rootProps)}>
                <Transition
                    {...getPopoverProps({ ...motionProps, ...contentProps }, ref)}
                    onAnimationComplete={callAll(
                        onAnimationComplete,
                        contentProps.onAnimationComplete
                    )}
                />
            </div>
        );

        return usePortal ? <Portal>{content}</Portal> : content;
    }),
    "content"
);

export interface HoverCardHeaderProps extends HTMLDreamyProps<"header"> {}

export const Header = withContext(
    forwardRef<HTMLDivElement, HoverCardHeaderProps>(function HoverCardHeader(props, ref) {
        const { getHeaderProps, size } = usePopoverContext();

        return (
            <Box
                as={"header"}
                {...getHeaderProps(props, ref)}
            >
                {typeof props.children === "string" ? (
                    <Heading size={size ?? "md"}>{props.children}</Heading>
                ) : (
                    props.children
                )}
            </Box>
        );
    }),
    "header"
);

export interface HoverCardBodyProps extends HTMLDreamyProps<"div"> {}

export const Body = withContext(
    forwardRef<HTMLDivElement, HoverCardBodyProps>(function HoverCardBody(props, ref) {
        const { getBodyProps } = usePopoverContext();

        return <Box {...getBodyProps(props, ref)} />;
    }),
    "body"
);

export interface HoverCardFooterProps extends BoxProps {}

export const Footer = withContext(
    forwardRef<HTMLDivElement, HoverCardFooterProps>(function HoverCardFooter(props, ref) {
        return (
            <Box
                as={"footer"}
                {...props}
                ref={ref}
            />
        );
    }),
    "footer"
);

/**
 * HoverCardTrigger wraps the element that triggers the hover card.
 * It must be an interactive element such as `button` or `a`.
 */
export function Trigger(props: { children: React.ReactNode }) {
    const child: any = Children.only(props.children);
    const { getTriggerProps } = usePopoverContext();

    return <>{cloneElement(child, getTriggerProps(child.props, child.ref))}</>;
}
