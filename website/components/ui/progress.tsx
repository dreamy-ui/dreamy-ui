"use client";

import {
    Progress as UiSdkProgress,
    ProgressIndicator as UiSdkProgressIndicator,
    ProgressLabel as UiSdkProgressLabel,
    ProgressTrack as UiSdkProgressTrack,
    ProgressValue as UiSdkProgressValue,
    type GaugeLabelDetails,
    type NumberFormat,
    type ProgressValueState
} from "@ui-sdk/react/progress";
import type { CSSProperties, ReactNode } from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy, splitCssProps } from "styled-system/jsx";
import { type ProgressVariantProps, progress } from "styled-system/recipes";

interface ProgressOptions {
    /**
     * Speed of the indeterminate range animation.
     * @default "1s"
     */
    speed?: string;
}

export type { GaugeLabelDetails, NumberFormat, ProgressValueState };

export interface ProgressLabelProps
    extends Omit<HTMLDreamyProps<"span">, "children">,
        Pick<React.ComponentProps<typeof UiSdkProgressLabel>, "children" | "render"> {}

/**
 * Accessible label for `Progress` powered by UI SDK `ProgressLabel`.
 */
export function ProgressLabel(props: ProgressLabelProps) {
    const { children, render, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkProgressLabel
            {...(domProps as unknown as Omit<
                React.ComponentProps<typeof UiSdkProgressLabel>,
                "children" | "render"
            >)}
            className={cx(className as string | undefined, css(cssProps))}
            data-part="label"
            render={render}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkProgressLabel>
    );
}

export interface ProgressValueProps
    extends Omit<HTMLDreamyProps<"span">, "children">,
        Pick<React.ComponentProps<typeof UiSdkProgressValue>, "children" | "render"> {}

/**
 * Formatted progress value readout powered by UI SDK `ProgressValue`.
 */
export function ProgressValue(props: ProgressValueProps) {
    const { children, render, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkProgressValue
            {...(domProps as unknown as Omit<
                React.ComponentProps<typeof UiSdkProgressValue>,
                "children" | "render"
            >)}
            className={cx(className as string | undefined, css(cssProps))}
            data-part="value"
            render={render}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkProgressValue>
    );
}

export interface ProgressProps
    extends ProgressOptions,
        ProgressVariantProps,
        Omit<
            HTMLDreamyProps<"div">,
            | "defaultValue"
            | "onChange"
            | "min"
            | "max"
            | "value"
            | "aria-valuemax"
            | "aria-valuemin"
            | "aria-valuenow"
        > {
    /**
     * How far the task has come, between `min` and `max`. Pass `null` or omit
     * it while the amount is unknown: the bar is then indeterminate.
     */
    value?: number | null;
    /**
     * The lowest value.
     * @default 0
     */
    min?: number;
    /**
     * The highest value.
     * @default 100
     */
    max?: number;
    /**
     * How the value reads for screen readers and `ProgressValue`, like
     * `{ style: "percent" }` or a function of the value.
     */
    format?: NumberFormat;
    /**
     * The locale the value is formatted in.
     */
    locale?: string;
    /**
     * Accessible value text function receiving `(value, details)`.
     */
    getValueLabel?: (value: number | null, details: GaugeLabelDetails<number | null>) => string;
    /**
     * Visible label rendered above the track via `ProgressLabel`.
     */
    label?: ReactNode;
    /**
     * Renders the formatted value via `ProgressValue` above the track.
     */
    showValue?: boolean;
    /**
     * Custom content or render function for `ProgressValue` when `showValue` is enabled.
     */
    valueLabel?: ReactNode | ((state: ProgressValueState) => ReactNode);
    /**
     * Logs state transitions in development builds.
     */
    debug?: boolean;
    "aria-label"?: string;
}

const StyledProgress = dreamy(UiSdkProgress, progress);

/**
 * Progress component — linear progress indicator.
 *
 * @see Docs https://dreamy-ui.com/docs/components/progress
 *
 * @example
 * ```tsx
 * <Progress value={60} aria-label="Loading" />
 * ```
 */
export function Progress(props: ProgressProps) {
    const {
        value,
        min = 0,
        max = 100,
        children,
        isIndeterminate: isIndeterminateProp,
        "aria-label": ariaLabel,
        "aria-valuetext": ariaValueText,
        speed = "1s",
        format,
        locale,
        getValueLabel,
        label,
        showValue,
        valueLabel,
        debug,
        style,
        ...rest
    } = props;

    const isIndeterminate = isIndeterminateProp ?? value == null;

    return (
        <StyledProgress
            {...rest}
            aria-label={ariaLabel}
            data-speed={speed}
            debug={debug}
            format={format}
            getValueLabel={getValueLabel ?? (ariaValueText ? () => ariaValueText : undefined)}
            isIndeterminate={isIndeterminate}
            locale={locale}
            max={max}
            min={min}
            style={
                {
                    "--speed": speed,
                    ...(style as React.CSSProperties)
                } as React.CSSProperties
            }
            value={isIndeterminate ? null : value}
        >
            {label != null || showValue ? (
                <div data-part="header">
                    {label != null ? <ProgressLabel>{label}</ProgressLabel> : null}
                    {showValue ? <ProgressValue>{valueLabel}</ProgressValue> : null}
                </div>
            ) : null}
            <UiSdkProgressTrack data-part="track">
                <UiSdkProgressIndicator data-part="range" />
            </UiSdkProgressTrack>
            {children}
        </StyledProgress>
    );
}
