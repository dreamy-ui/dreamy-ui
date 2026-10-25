"use client";

import {
    Progress as ArkProgress,
    type ProgressRootProps as ArkProgressRootProps
} from "@ark-ui/react/progress";
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
        ArkProgressRootProps,
        ProgressVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof ArkProgressRootProps | "defaultValue"> {
    "aria-label": string;
}

const StyledProgress = dreamy(ArkProgress.Root, progress);

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
        "aria-labelledby": ariaLabelledBy,
        "aria-valuetext": ariaValueText,
        style,
        speed = "1s",
        ...rest
    } = props;

    const isIndeterminate = isIndeterminateProp ?? value == null;

    return (
        <StyledProgress
            {...rest}
            data-speed={speed}
            isIndeterminate={isIndeterminate}
            max={max}
            min={min}
            style={{
                // @ts-expect-error css variable
                "--speed": speed,
                ...style
            }}
            value={isIndeterminate ? null : value}
        >
            <ArkProgress.Track
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-valuetext={ariaValueText}
            >
                <ArkProgress.Range data-indeterminate={isIndeterminate ? "" : undefined} />
            </ArkProgress.Track>
            {children}
        </StyledProgress>
    );
}
