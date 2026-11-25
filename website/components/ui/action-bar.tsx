"use client";

import {
    type ActionBarOpenChangeReason,
    type ActionBarOptions,
    ActionBarPrimitiveParts,
    Portal,
    type PortalProps,
    createActionBarController,
    transformReducedMotion,
    useMotionVariants,
    useReducedMotion
} from "@dreamy-ui/react";
import { AnimatePresence } from "motion/react";
import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, createStyleContext, splitCssProps } from "styled-system/jsx";
import type { ActionBarVariantProps } from "styled-system/recipes";
import { actionBar } from "styled-system/recipes";
import { CloseButton, type CloseButtonProps } from "./close-button";
import { MotionBox, type MotionBoxProps } from "./motion";

const { withProvider, withContext } = createStyleContext(actionBar);

export { createActionBarController };
export type { ActionBarOpenChangeReason };

export interface ActionBarRootProps
    extends ActionBarOptions,
        ActionBarVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof ActionBarOptions | "children"> {
    portalProps?: Omit<PortalProps, "children">;
    children?: ReactNode;
}

function ActionBarRoot(props: ActionBarRootProps) {
    const {
        open,
        defaultOpen,
        onOpenChange,
        closeOnEscape,
        loop,
        controller,
        debug,
        portalProps,
        className,
        style,
        children,
        ...rest
    } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <ActionBarPrimitiveParts.Provider
            closeOnEscape={closeOnEscape}
            controller={controller}
            debug={debug}
            defaultOpen={defaultOpen}
            loop={loop}
            onOpenChange={onOpenChange}
            open={open}
        >
            {({ open: isOpen }) => (
                <Portal
                    isActive={isOpen}
                    zIndex="var(--z-index-modal)"
                    {...portalProps}
                >
                    <AnimatePresence>
                        {isOpen && (
                            <ActionBarPrimitiveParts.Surface
                                {...(domProps as Record<string, unknown>)}
                                className={mergedClassName}
                                style={style as CSSProperties | undefined}
                            >
                                {children}
                            </ActionBarPrimitiveParts.Surface>
                        )}
                    </AnimatePresence>
                </Portal>
            )}
        </ActionBarPrimitiveParts.Provider>
    );
}

/**
 * ActionBar component — floating toolbar for bulk selection actions.
 *
 * @see Docs https://dreamy-ui.com/docs/components/action-bar
 */
export const Root: (props: ActionBarRootProps) => React.JSX.Element = withProvider(
    ActionBarRoot,
    "root"
) as (props: ActionBarRootProps) => React.JSX.Element;

export interface ActionBarContentProps
    extends Omit<MotionBoxProps, "role" | "children" | "transition"> {
    role?: React.AriaRole;
    "aria-label"?: string;
    loop?: boolean;
    children?: ReactNode;
}

const StyledContent = withContext(MotionBox, "content");

export function Content(props: ActionBarContentProps) {
    const { children, loop, className, style, ...rest } = props;
    const { open } = ActionBarPrimitiveParts.useState();
    const reduceMotion = useReducedMotion() ?? false;
    const { actionBar: variants } = useMotionVariants();
    const motionVariants = transformReducedMotion(variants, reduceMotion);

    return (
        <AnimatePresence propagate>
            {open && (
                <ActionBarPrimitiveParts.Content
                    keepMounted
                    loop={loop}
                    render={
                        <StyledContent
                            animate="animate"
                            className={className}
                            exit="exit"
                            initial={reduceMotion ? false : "initial"}
                            style={style}
                            variants={motionVariants}
                            {...rest}
                        />
                    }
                >
                    {children}
                </ActionBarPrimitiveParts.Content>
            )}
        </AnimatePresence>
    );
}

export interface ActionBarSelectionTriggerProps extends Omit<HTMLDreamyProps<"span">, "children"> {
    children?: ReactNode;
}

export const SelectionTrigger = withContext(function ActionBarSelectionTrigger(
    props: ActionBarSelectionTriggerProps
) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <ActionBarPrimitiveParts.SelectionTrigger
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </ActionBarPrimitiveParts.SelectionTrigger>
    );
}, "selectionTrigger");

export interface ActionBarSeparatorProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    children?: ReactNode;
}

export const Separator = withContext(function ActionBarSeparator(props: ActionBarSeparatorProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <ActionBarPrimitiveParts.Separator
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </ActionBarPrimitiveParts.Separator>
    );
}, "separator");

export interface ActionBarCloseTriggerProps extends CloseButtonProps {
    "aria-label"?: string;
}

export const CloseTrigger = withContext(function ActionBarCloseTrigger(
    props: ActionBarCloseTriggerProps
) {
    const { children: _children, ...rest } = props;

    return <ActionBarPrimitiveParts.CloseTrigger render={<CloseButton {...rest} />} />;
}, "closeTrigger");
