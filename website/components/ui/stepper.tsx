"use client";

import {
    type StepStatus,
    type StepperOptions,
    type StepperPrimitiveState,
    StepperPrimitiveParts,
    type StepperStepChangeReason,
    createStepperController
} from "@dreamy-ui/react";
import { mergeProps } from "@ui-sdk/react/primitive";
import type React from "react";
import {
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    cloneElement,
    isValidElement
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import type { StepperVariantProps } from "styled-system/recipes";
import { stepper } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(stepper);

export { createStepperController };
export type { StepStatus, StepperStepChangeReason };
export type StepperState = StepperPrimitiveState;

export interface StepperRootProps
    extends StepperOptions,
        StepperVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof StepperOptions | "children"> {
    children?: ReactNode;
}

function StepperRoot(props: StepperRootProps) {
    const {
        count,
        step,
        defaultStep,
        onStepChange,
        orientation = "horizontal",
        controller,
        debug,
        className,
        style,
        children,
        ...rest
    } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.Root
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            controller={controller}
            count={count}
            debug={debug}
            defaultStep={defaultStep}
            onStepChange={onStepChange}
            orientation={orientation}
            step={step}
            style={style as CSSProperties | undefined}
        >
            {children}
        </StepperPrimitiveParts.Root>
    );
}

/**
 * Stepper component — multi-step process indicator and navigation.
 *
 * @see Docs https://dreamy-ui.com/docs/components/stepper
 */
export const Root: (props: StepperRootProps) => React.JSX.Element = withProvider(
    StepperRoot,
    "root"
) as (props: StepperRootProps) => React.JSX.Element;

export interface StepperListProps extends Omit<HTMLDreamyProps<"ol">, "children"> {
    children?: ReactNode;
}

export const List = withContext(function StepperList(props: StepperListProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.List
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </StepperPrimitiveParts.List>
    );
}, "list");

export interface StepperItemProps extends Omit<HTMLDreamyProps<"li">, "title" | "children"> {
    index: number;
    children?: ReactNode;
}

export const Item = withContext(function StepperItem(props: StepperItemProps) {
    const { index, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.Item
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            index={index}
            style={style as CSSProperties | undefined}
        >
            {children}
        </StepperPrimitiveParts.Item>
    );
}, "item");

export interface StepperTriggerProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    index: number;
    children?: ReactNode;
}

export const Trigger = withContext(function StepperTrigger(props: StepperTriggerProps) {
    const { index, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.Trigger
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            index={index}
            style={style as CSSProperties | undefined}
        >
            {children}
        </StepperPrimitiveParts.Trigger>
    );
}, "trigger");

export interface StepperIndicatorProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    index: number;
    icon?: ReactNode;
    children?: ReactNode;
}

export const Indicator = withContext(function StepperIndicator(props: StepperIndicatorProps) {
    const { index, icon, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.Indicator
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            index={index}
            style={style as CSSProperties | undefined}
        >
            {(state) => {
                if (children) return children;
                if (icon) return icon;
                if (state.complete) return <CheckIcon />;
                return index + 1;
            }}
        </StepperPrimitiveParts.Indicator>
    );
}, "indicator");

export interface StepperTitleProps extends HTMLDreamyProps<"p"> {}

export const Title = withContext(function StepperTitle(props: StepperTitleProps) {
    return <dreamy.p {...props} />;
}, "title");

export interface StepperDescriptionProps extends HTMLDreamyProps<"p"> {}

export const Description = withContext(function StepperDescription(props: StepperDescriptionProps) {
    return <dreamy.p {...props} />;
}, "description");

export interface StepperSeparatorProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    index: number;
    children?: ReactNode;
}

export const Separator = withContext(function StepperSeparator(props: StepperSeparatorProps) {
    const { index, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.Separator
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            index={index}
            style={style as CSSProperties | undefined}
        >
            {children}
        </StepperPrimitiveParts.Separator>
    );
}, "separator");

export interface StepperContentProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    index: number;
    children?: ReactNode;
}

export const Content = withContext(function StepperContent(props: StepperContentProps) {
    const { index, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.Content
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            index={index}
            style={style as CSSProperties | undefined}
        >
            {children}
        </StepperPrimitiveParts.Content>
    );
}, "content");

export interface StepperCompletedContentProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    children?: ReactNode;
}

export const CompletedContent = withContext(function StepperCompletedContent(
    props: StepperCompletedContentProps
) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <StepperPrimitiveParts.CompletedContent
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </StepperPrimitiveParts.CompletedContent>
    );
}, "completedContent");

const NextTriggerSlot = withContext(StepperPrimitiveParts.NextTrigger, "nextTrigger");
const PrevTriggerSlot = withContext(StepperPrimitiveParts.PrevTrigger, "prevTrigger");

export interface StepperNextTriggerProps extends Omit<HTMLDreamyProps<"button">, "children"> {
    render?: ReactElement;
    asChild?: boolean;
    children?: ReactNode;
}

export function NextTrigger(props: StepperNextTriggerProps) {
    const { render, asChild, disabled, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const resolvedRender = render ?? (asChild && isValidElement(children) ? children : undefined);

    return (
        <NextTriggerSlot
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            disabled={disabled}
            render={
                resolvedRender
                    ? (partProps, state) =>
                          cloneElement(
                              resolvedRender as ReactElement<Record<string, unknown>>,
                              mergeProps(
                                  partProps,
                                  { disabled: state.disabled },
                                  resolvedRender.props as Record<string, unknown>
                              )
                          )
                    : undefined
            }
            style={style as CSSProperties | undefined}
        >
            {resolvedRender ? undefined : children}
        </NextTriggerSlot>
    );
}

export interface StepperPrevTriggerProps extends Omit<HTMLDreamyProps<"button">, "children"> {
    render?: ReactElement;
    asChild?: boolean;
    children?: ReactNode;
}

export function PrevTrigger(props: StepperPrevTriggerProps) {
    const { render, asChild, disabled, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const resolvedRender = render ?? (asChild && isValidElement(children) ? children : undefined);

    return (
        <PrevTriggerSlot
            {...(domProps as Record<string, unknown>)}
            className={cx(className as string | undefined, css(cssProps))}
            disabled={disabled}
            render={
                resolvedRender
                    ? (partProps, state) =>
                          cloneElement(
                              resolvedRender as ReactElement<Record<string, unknown>>,
                              mergeProps(
                                  partProps,
                                  { disabled: state.disabled },
                                  resolvedRender.props as Record<string, unknown>
                              )
                          )
                    : undefined
            }
            style={style as CSSProperties | undefined}
        >
            {resolvedRender ? undefined : children}
        </PrevTriggerSlot>
    );
}

export interface StepperContextProps {
    children: (ctx: StepperState) => ReactNode;
}

export function Context({ children }: StepperContextProps) {
    const ctx = StepperPrimitiveParts.useState();
    return <>{children(ctx)}</>;
}

function CheckIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
