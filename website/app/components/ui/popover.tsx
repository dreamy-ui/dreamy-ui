"use client";

import {
    type MaybeRenderProp,
    PopoverProvider,
    type UsePopoverProps,
    callAll,
    callAllHandlers,
    runIfFn,
    transformReducedMotion,
    useMotionVariants,
    usePopover,
    usePopoverContext
} from "@dreamy-ui/react";
import { Children, cloneElement, forwardRef } from "react";
import { createStyleContext } from "styled-system/jsx";
import { popover } from "styled-system/recipes";
import { Box, type BoxProps } from "./box";
import { CloseButton, type CloseButtonProps } from "./close-button";
import type { HTMLDreamyProps } from "./factory";
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
}

/**
 * Popover component
 *
 * @See Docs https://dreamy-ui.com/docs/components/popover
 */
const PopoverRoot = withRootProvider(function PopoverRoot(props: PopoverProps) {
    const { children, direction = "ltr", hasArrow, ...rest } = props;

    const context = usePopover({ ...rest, direction });

    return (
        <PopoverProvider
            value={{
                ...context,
                hasArrow: hasArrow ?? false
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

function PopoverArrow(props: PopoverArrowProps) {
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

export interface PopoverTransitionProps extends Omit<MotionBoxProps, "children"> {
    children?: React.ReactNode;
    /**
     * Props to be forwarded to the arrow component
     */
    arrowProps?: PopoverArrowProps;
}

const PopoverTransition = forwardRef(function PopoverTransition(
    props: PopoverTransitionProps,
    ref: React.Ref<any>
) {
    const { children, arrowProps, ...rest } = props;

    const { isOpen, hasArrow, reduceMotion } = usePopoverContext();
    const { popover } = useMotionVariants();

    return (
        <MotionBox
            ref={ref}
            variants={transformReducedMotion(popover.default, reduceMotion)}
            initial={false}
            animate={isOpen ? "initial" : "exit"}
            {...rest}
        >
            {hasArrow && <PopoverArrow {...arrowProps} />}
            {children}
        </MotionBox>
    );
});

export interface PopoverContentProps extends PopoverTransitionProps {
    rootProps?: HTMLDreamyProps<"div">;
    motionProps?: Omit<MotionBoxProps, "children">;
}

const PopoverContent = withContext(
    forwardRef<HTMLElement, PopoverContentProps>(function PopoverContent(props, ref) {
        const { rootProps, motionProps, ...contentProps } = props;

        const { getPopoverProps, getPopoverPositionerProps, onAnimationComplete } =
            usePopoverContext();

        if (typeof document === "undefined") return null;

        return (
            <div {...getPopoverPositionerProps(rootProps)}>
                <PopoverTransition
                    {...motionProps}
                    {...getPopoverProps(contentProps, ref)}
                    onAnimationComplete={callAll(
                        onAnimationComplete,
                        contentProps.onAnimationComplete
                    )}
                />
            </div>
        );
    }),
    "content"
);

export interface PopoverHeaderProps extends HTMLDreamyProps<"header"> {}

const PopoverHeader = withContext(
    forwardRef<HTMLDivElement, PopoverHeaderProps>(function PopoverHeader(props, ref) {
        const { children, ...rest } = props;
        const { getHeaderProps } = usePopoverContext();

        return (
            <Box
                as={"header"}
                {...getHeaderProps(rest, ref)}
            >
                {typeof children === "string" ? (
                    <Heading
                        variant={"heading"}
                        size="md"
                    >
                        {children}
                    </Heading>
                ) : (
                    children
                )}
            </Box>
        );
    }),
    "header"
);

export interface PopoverBodyProps extends HTMLDreamyProps<"div"> {}

const PopoverBody = withContext(
    forwardRef<HTMLDivElement, PopoverBodyProps>(function PopoverHeader(props, ref) {
        const { getBodyProps } = usePopoverContext();

        return <Box {...getBodyProps(props, ref)} />;
    }),
    "body"
);

export interface PopoverFooterProps extends BoxProps {}

const PopoverFooter = withContext(
    forwardRef<HTMLDivElement, PopoverFooterProps>(function PopoverFooter(props, ref) {
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

export interface PopoverCloseButtonProps extends CloseButtonProps {}

const PopoverCloseButton = withContext(
    forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(function PopoverCloseButton(props, ref) {
        const { onClose } = usePopoverContext();

        return (
            <CloseButton
                {...props}
                size={"sm"}
                onClick={callAllHandlers(props.onClick, onClose)}
                ref={ref}
            />
        );
    }),
    "close"
);

/**
 * PopoverAnchor is element that is used as the positioning reference
 * for the popover.
 */
function PopoverAnchor(props: React.PropsWithChildren<{}>) {
    const child: any = Children.only(props.children);
    const { getAnchorProps } = usePopoverContext();

    return <>{cloneElement(child, getAnchorProps(child.props, child.ref))}</>;
}

/**
 * PopoverTrigger opens the popover's content. It must be an interactive element
 * such as `button` or `a`.
 */
function PopoverTrigger(props: { children: React.ReactNode }) {
    const child: any = Children.only(props.children);
    const { getTriggerProps } = usePopoverContext();

    return <>{cloneElement(child, getTriggerProps(child.props, child.ref))}</>;
}

export namespace Popover {
    export const Root = PopoverRoot;
    export const Content = PopoverContent;
    export const Header = PopoverHeader;
    export const Body = PopoverBody;
    export const Footer = PopoverFooter;
    export const CloseButton = PopoverCloseButton;
    export const Anchor = PopoverAnchor;
    export const Trigger = PopoverTrigger;
}
