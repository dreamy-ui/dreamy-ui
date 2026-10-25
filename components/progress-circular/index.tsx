"use client";

import { Progress as ArkProgress } from "@ark-ui/react/progress";
import { dataAttr } from "@dreamy-ui/react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ProgressCircularVariantProps, progressCircular } from "styled-system/recipes";

interface ProgressCircularOptions {
    value?: number;
    label?: string;
    showValueLabel?: boolean;
    valueLabel?: string;
    minValue?: number;
    maxValue?: number;
    isIndeterminate?: boolean;
    isDisabled?: boolean;
    speed?: string;
}

export interface ProgressCircularProps
    extends ProgressCircularOptions,
        Omit<
            React.ComponentProps<typeof ArkProgress.Root>,
            "orientation" | "min" | "max" | "defaultValue" | "value"
        >,
        ProgressCircularVariantProps,
        Omit<HTMLDreamyProps<"div">, "defaultValue"> {
    "aria-label"?: string;
}

const StyledProgressCircular = dreamy(ArkProgress.Root, progressCircular);

export function ProgressCircular(props: ProgressCircularProps) {
    const {
        label,
        showValueLabel,
        valueLabel,
        value,
        minValue,
        maxValue,
        isIndeterminate: isIndeterminateProp,
        isDisabled,
        speed = "1.5s",
        children,
        "aria-label": ariaLabel,
        "aria-valuetext": ariaValueText,
        style,
        ...rest
    } = props;

    const min = minValue ?? 0;
    const max = maxValue ?? 100;
    const isIndeterminate = isIndeterminateProp ?? value === undefined;
    const progressValue = isIndeterminate ? null : value;

    return (
        <StyledProgressCircular
            {...rest}
            aria-label={ariaLabel}
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={isIndeterminate ? undefined : value}
            aria-valuetext={
                ariaValueText ?? (valueLabel != null ? valueLabel : undefined)
            }
            data-disabled={dataAttr(isDisabled)}
            data-indeterminate={dataAttr(isIndeterminate)}
            max={max}
            min={min}
            orientation="circular"
            role="progressbar"
            style={{
                // @ts-expect-error css variable
                "--speed": speed,
                ...style
            }}
            value={progressValue}
        >
            <div>
                <ArkProgress.Circle
                    aria-hidden="true"
                    aria-label={undefined}
                    aria-valuemax={undefined}
                    aria-valuemin={undefined}
                    aria-valuenow={undefined}
                    data-part="circle"
                    role="presentation"
                    style={{
                        // @ts-expect-error css variable
                        "--speed": speed
                    }}
                >
                    <ArkProgress.CircleTrack data-part="circleTrack" />
                    <ArkProgress.CircleRange data-part="circleRange" />
                </ArkProgress.Circle>
                {showValueLabel ? (
                    <ArkProgress.ValueText data-part="valueText">
                        {valueLabel}
                    </ArkProgress.ValueText>
                ) : null}
            </div>
            {label ? <span data-part="label">{label}</span> : null}
            {children}
        </StyledProgressCircular>
    );
}
