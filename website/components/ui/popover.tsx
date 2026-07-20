"use client";

import {
    type MaybeRenderProp,
    PopoverProvider,
    Portal,
    type PortalProps,
    type UsePopoverProps,
    callAll,
    callAllHandlers,
    runIfFn,
    transformReducedMotion,
    useMotionVariants,
    usePopover,
    usePopoverContext
} from "@dreamy-ui/react";
import { Children, cloneElement } from "react";
import { type HTMLDreamyProps, createStyleContext } from "styled-system/jsx";
import { popover } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "./close-button";
import { Heading } from "./heading";
import { MotionBox, type MotionBoxProps } from "./motion";

const { withContext, withRootProvider } = createStyleContext(popover);

export interface PopoverProps extends UsePopoverProps {
    /**
     * The content of the popover. It is usually the `PopoverTrigger`,
     * and `PopoverContent`
     */
    children?: MaybeRenderProp<{
        isOpen: boolean;
        onClose: () => void;
        forceUpdate: (() => void) | undefined;
    }>;
    /**
     * If `true`, the popover will have an arrow pointing to the trigger
     * @default true
     */
    hasArrow?: boolean;
    /**
     * If `true`, the popover content will be rendered in a portal
     * @default true
     */
    usePortal?: boolean;
    /**
     * Props forwarded to the `Portal` used by `Popover.Content`.
     * Use `containerRef` to render into a native or third-party top-layer container.
     */
    portalProps?: Omit<PortalProps, "children">;
}

/**
 * Popover component — floating content anchored to a trigger element.
 *
 * @see Docs https://dreamy-ui.com/docs/components/popover
 *
 * @example
 * ```tsx
 * <Popover.Root>
 *   <Popover.Trigger>
 *     <Button>Open</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>
 *     <Popover.Body>Content</Popover.Body>
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 */
export const Root = withRootProvider(function PopoverRoot(props: PopoverProps) {
    const { children, hasArrow, usePortal = true, portalProps, ...rest } = props;

    const context = usePopover(rest);

    return (
        <PopoverProvider
            value={{
                ...context,
                hasArrow: hasArrow ?? false,
                usePortal,
                portalProps
            }}
        >
            {runIfFn(children, {
                isOpen: context.isOpen,
                onClose: context.onClose,
                forceUpdate: context.forceUpdate
            })}
        </PopoverProvider>
    );
});

export interface PopoverArrowProps extends HTMLDreamyProps<"div"> {}

/**
 * Popover Arrow — pointer connecting the popover to its anchor.
 */
export function Arrow(props: PopoverArrowProps) {
    const { getArrowProps, getArrowInnerProps } = usePopoverContext();

    return (
        <Box {...getArrowProps({ style: { backgroundColor: "transparent" } })}>
            <Box {...getArrowInnerProps(props)} />
        </Box>
    );
}

export interface PopoverTransitionProps extends Omit<MotionBoxProps, "children"> {
    children?: React.ReactNode;
    /**
     * Props to be forwarded to the arrow component
     */
    arrowProps?: PopoverArrowProps;
}

function Transition(props: PopoverTransitionProps) {
    const { children, arrowProps, ...rest } = props;

    const { isOpen, hasArrow, reduceMotion } = usePopoverContext();
    const { popover } = useMotionVariants();

    return (
        <MotionBox
            animate={isOpen ? "initial" : "exit"}
            initial={false}
            variants={transformReducedMotion(popover, reduceMotion)}
            {...rest}
        >
            {hasArrow && <Arrow {...arrowProps} />}
            {children}
        </MotionBox>
    );
}

export interface PopoverContentProps extends PopoverTransitionProps {
    rootProps?: HTMLDreamyProps<"div">;
    motionProps?: Omit<MotionBoxProps, "children">;
}

/**
 * Popover Content — the floating panel rendered in a portal.
 */
export const Content = withContext(function PopoverContent(props: PopoverContentProps) {
    const { rootProps, motionProps, ...contentProps } = props;

    const {
        getPopoverProps,
        getPopoverPositionerProps,
        isOpen,
        onAnimationComplete,
        usePortal,
        portalProps
    } = usePopoverContext();

    if (typeof document === "undefined") return null;

    const content = (
        <div {...getPopoverPositionerProps(rootProps)}>
            <Transition
                {...getPopoverProps({ ...motionProps, ...contentProps })}
                onAnimationComplete={callAll(onAnimationComplete, contentProps.onAnimationComplete)}
            />
        </div>
    );

    return usePortal ? (
        <Portal
            isActive={isOpen}
            zIndex="var(--z-index-popover)"
            {...portalProps}
        >
            {content}
        </Portal>
    ) : (
        content
    );
}, "content");

export interface PopoverHeaderProps extends HTMLDreamyProps<"header"> {}

/**
 * Popover Header — title area at the top of the popover.
 */
export const Header = withContext(function PopoverHeader(props: PopoverHeaderProps) {
    const { children } = props;
    const { getHeaderProps } = usePopoverContext();

    return (
        <Box
            as={"header"}
            {...getHeaderProps(props)}
        >
            {typeof children === "string" ? (
                <Heading
                    size="md"
                    variant={"heading"}
                >
                    {children}
                </Heading>
            ) : (
                children
            )}
        </Box>
    );
}, "header");

export interface PopoverBodyProps extends HTMLDreamyProps<"div"> {}

/**
 * Popover Body — main content area of the popover.
 */
export const Body = withContext(function PopoverHeader(props: PopoverBodyProps) {
    const { getBodyProps } = usePopoverContext();

    return <Box {...getBodyProps(props)} />;
}, "body");

export interface PopoverFooterProps extends BoxProps {}

/**
 * Popover Footer — action area at the bottom of the popover.
 */
export const Footer = withContext(function PopoverFooter(props: PopoverFooterProps) {
    return (
        <Box
            as={"footer"}
            {...props}
        />
    );
}, "footer");

export interface PopoverCloseButtonProps extends CloseButtonProps {}

/**
 * Popover Close Button — dismisses the popover.
 */
export const CloseButton = withContext(function PopoverCloseButton(props: PopoverCloseButtonProps) {
    const { onClose } = usePopoverContext();

    return (
        <CloseButtonComponent
            {...props}
            onClick={callAllHandlers(props.onClick, onClose)}
            size={"sm"}
        />
    );
}, "close");

/**
 * Popover Anchor — positioning reference element for the popover.
 */
export function Anchor(props: React.PropsWithChildren<{}>) {
    const child = Children.only(props.children) as React.ReactElement<Record<string, unknown>> & {
        ref?: React.Ref<Element>;
    };
    const { getAnchorProps } = usePopoverContext();

    return <>{cloneElement(child, getAnchorProps({ ...child.props, ref: child.ref }))}</>;
}

/**
 * Popover Trigger — opens the popover when activated.
 */
export function Trigger(props: { children: React.ReactNode }) {
    const child = Children.only(props.children) as React.ReactElement<Record<string, unknown>> & {
        ref?: React.Ref<Element>;
    };
    const { getTriggerProps } = usePopoverContext();

    return <>{cloneElement(child, getTriggerProps({ ...child.props, ref: child.ref }))}</>;
}
