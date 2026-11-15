"use client";

import {
    Progress as UiSdkProgress,
    ProgressIndicator as UiSdkProgressIndicator,
    ProgressTrack as UiSdkProgressTrack,
    type NumberFormat
} from "@ui-sdk/react/progress";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ProgressVariantProps, progress } from "styled-system/recipes";

interface ProgressOptions {
    /**
     * Speed of the indeterminate range animation.
     * @default "1s"
     */
    speed?: string;
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
    "aria-label": string;
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
        style,
        ...rest
    } = props;

    const isIndeterminate = isIndeterminateProp ?? value == null;

    return (
        <StyledProgress
            {...rest}
            aria-label={ariaLabel}
            data-speed={speed}
            format={format}
            getValueLabel={ariaValueText ? () => ariaValueText : undefined}
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
            <UiSdkProgressTrack data-part="track">
                <UiSdkProgressIndicator data-part="range" />
            </UiSdkProgressTrack>
            {children}
        </StyledProgress>
    );
}
