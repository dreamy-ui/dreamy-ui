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
import { Box, type BoxProps } from "../box";
import { CloseButton as CloseButtonComponent, type CloseButtonProps } from "../close-button";
import { Heading } from "../heading";
import { MotionBox, type MotionBoxProps } from "../motion";

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
 * Popover component
 *
 * @See Docs https://dreamy-ui.com/docs/components/popover
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
    const { ref, children, arrowProps, ...rest } = props;

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
}

export interface PopoverContentProps extends PopoverTransitionProps {
    rootProps?: HTMLDreamyProps<"div">;
    motionProps?: Omit<MotionBoxProps, "children">;
}

export const Content = withContext(function PopoverContent(props: PopoverContentProps) {
    const { rootProps, motionProps, ref, ...contentProps } = props;

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
                {...getPopoverProps({ ...motionProps, ...contentProps, ref })}
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

export const Body = withContext(function PopoverHeader(props: PopoverBodyProps) {
    const { getBodyProps } = usePopoverContext();

    return <Box {...getBodyProps(props)} />;
}, "body");

export interface PopoverFooterProps extends BoxProps {}

export const Footer = withContext(function PopoverFooter(props: PopoverFooterProps) {
    return (
        <Box
            as={"footer"}
            {...props}
        />
    );
}, "footer");

export interface PopoverCloseButtonProps extends CloseButtonProps {}

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
 * PopoverAnchor is element that is used as the positioning reference
 * for the popover.
 */
export function Anchor(props: React.PropsWithChildren<{}>) {
    const child: any = Children.only(props.children);
    const { getAnchorProps } = usePopoverContext();

    return <>{cloneElement(child, getAnchorProps(child.props, child.props.ref))}</>;
}

/**
 * PopoverTrigger opens the popover's content. It must be an interactive element
 * such as `button` or `a`.
 */
export function Trigger(props: { children: React.ReactNode }) {
    const child: any = Children.only(props.children);
    const { getTriggerProps } = usePopoverContext();

    return <>{cloneElement(child, getTriggerProps(child.props, child.props.ref))}</>;
}
