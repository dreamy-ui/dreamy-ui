import { Box } from "@/components/box/box";
import { dream } from "@/components/factory";
import {
    type GetProgressPropsOptions,
    getProgressProps
} from "@/components/progress/progress.utils";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type ProgressVariantProps, progress } from "@dreamy-ui/system/recipes";
import { forwardRef, useMemo } from "react";

interface ProgressFilledTrackProps extends HTMLDreamProps<"div">, GetProgressPropsOptions {}

const ProgressFilledTrack = forwardRef<HTMLDivElement, ProgressFilledTrackProps>((props, ref) => {
    const { min, max, value, isIndeterminate, role, ...rest } = props;
    const progress = useMemo(
        () => getProgressProps({ value, min, max, isIndeterminate, role }),
        [value, min, max, isIndeterminate, role]
    );

    return (
        <Box
            data-part="filled-track"
            ref={ref}
            style={{ width: `${progress.percent}%`, ...rest.style }}
            {...progress.bind}
            {...rest}
        />
    );
});

interface ProgressOptions {
    /**
     * The `value` of the progress indicator.
     * If `undefined` the progress bar will be in `indeterminate` state
     */
    value?: number;
    /**
     * The minimum value of the progress
     * @default 0
     */
    min?: number;
    /**
     * The maximum value of the progress
     * @default 100
     */
    max?: number;
    /**
     * The speed of indeterminate progress
     * @default 1s
     */
    speed?: string;
}

export interface ProgressProps
    extends ProgressOptions,
        ProgressVariantProps,
        HTMLDreamProps<"div"> {}

const StyledProgress = styled(dream.div, progress);

/**
 * Progress component
 *
 * @See Docs https://dream-ui.com/docs/components/progress
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
    const {
        value,
        min = 0,
        max = 100,
        children,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-valuetext": ariaValueText,
        title,
        role,
        style,
        speed = "1s",
        ...rest
    } = props;

    return (
        <StyledProgress
            ref={ref}
            {...rest}
            data-speed={speed}
            style={{
                // @ts-expect-error
                "--speed": speed,
                ...style
            }}
        >
            <ProgressFilledTrack
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-valuetext={ariaValueText}
                min={min}
                max={max}
                value={value}
                title={title}
                role={role}
            />
            {children}
        </StyledProgress>
    );
});

Progress.displayName = "Progress";
