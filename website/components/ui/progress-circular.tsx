"use client";

import {
    Progress as UiSdkProgress,
    type NumberFormat
} from "@ui-sdk/react/progress";
import { dataAttr } from "@dreamy-ui/react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ProgressCircularVariantProps, progressCircular } from "styled-system/recipes";

interface ProgressCircularOptions {
    value?: number | null;
    label?: string;
    showValueLabel?: boolean;
    valueLabel?: string;
    min?: number;
    max?: number;
    /**
     * Forces the indeterminate animation. Otherwise a `null` or missing
     * `value` is indeterminate.
     */
    isIndeterminate?: boolean;
    disabled?: boolean;
    /**
     * Speed of the indeterminate animation.
     * @default "1.5s"
     */
    speed?: string;
}

export interface ProgressCircularProps
    extends ProgressCircularOptions,
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
        >,
        ProgressCircularVariantProps {
    "aria-label"?: string;
    /**
     * How the value reads for screen readers.
     */
    format?: NumberFormat;
    /**
     * The locale the value is formatted in.
     */
    locale?: string;
}

const StyledProgressCircular = dreamy(UiSdkProgress, progressCircular);

const CIRCLE_STYLE = {
    "--radius": "calc(var(--size) / 2 - var(--thickness) / 2)",
    cx: "calc(var(--size) / 2)",
    cy: "calc(var(--size) / 2)",
    r: "var(--radius)",
    fill: "transparent",
    strokeWidth: "var(--thickness)"
} as React.CSSProperties;

export function ProgressCircular(props: ProgressCircularProps) {
    const {
        label,
        showValueLabel,
        valueLabel,
        value,
        min = 0,
        max = 100,
        isIndeterminate: isIndeterminateProp,
        disabled,
        speed = "1.5s",
        children,
        "aria-label": ariaLabel,
        "aria-valuetext": ariaValueText,
        format,
        locale,
        style,
        ...rest
    } = props;

    const isIndeterminate = isIndeterminateProp ?? value == null;
    const progressValue = isIndeterminate ? null : value;
    const range = max - min;
    const percent =
        progressValue == null || range === 0
            ? 0
            : Math.min(100, Math.max(0, ((progressValue - min) / range) * 100));

    return (
        <StyledProgressCircular
            {...rest}
            aria-label={ariaLabel}
            data-disabled={dataAttr(disabled)}
            data-indeterminate={dataAttr(isIndeterminate)}
            format={format}
            getValueLabel={
                ariaValueText != null || valueLabel != null
                    ? () => ariaValueText ?? valueLabel ?? ""
                    : undefined
            }
            locale={locale}
            max={max}
            min={min}
            style={
                {
                    "--speed": speed,
                    ...(style as React.CSSProperties)
                } as React.CSSProperties
            }
            value={progressValue}
        >
            <div>
                <svg
                    aria-hidden="true"
                    data-indeterminate={dataAttr(isIndeterminate)}
                    data-part="circle"
                    style={
                        {
                            width: "var(--size)",
                            height: "var(--size)",
                            "--speed": speed
                        } as React.CSSProperties
                    }
                >
                    <circle
                        data-part="circleTrack"
                        style={CIRCLE_STYLE}
                    />
                    <circle
                        data-indeterminate={dataAttr(isIndeterminate)}
                        data-part="circleRange"
                        style={
                            {
                                ...CIRCLE_STYLE,
                                "--percent": percent,
                                "--circumference":
                                    "calc(2 * 3.14159 * var(--radius))",
                                "--offset":
                                    "calc(var(--circumference) * (100 - var(--percent)) / 100)",
                                strokeDashoffset:
                                    "calc(var(--circumference) * ((100 - var(--percent)) / 100))",
                                strokeDasharray: isIndeterminate
                                    ? undefined
                                    : "var(--circumference)",
                                transformOrigin: "center",
                                transform: "rotate(-90deg)",
                                opacity: progressValue === 0 ? 0 : undefined
                            } as React.CSSProperties
                        }
                    />
                </svg>
                {showValueLabel ? (
                    <span data-part="valueText">{valueLabel}</span>
                ) : null}
            </div>
            {label ? <span data-part="label">{label}</span> : null}
            {children}
        </StyledProgressCircular>
    );
}
