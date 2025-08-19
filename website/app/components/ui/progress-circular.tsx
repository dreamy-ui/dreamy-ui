"use client";

import { type UseCircularProgressProps, useCircularProgress } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { styled } from "styled-system/jsx";
import { type ProgressCircularVariantProps, progressCircular } from "styled-system/recipes";
import type { HTMLDreamyProps } from "./factory";

export interface ProgressCircularProps
    extends UseCircularProgressProps,
        Omit<HTMLDreamyProps<"div">, keyof UseCircularProgressProps>,
        ProgressCircularVariantProps {}

const StyledProgressCircular = styled("div", progressCircular);

/**
 * ProgressCircular component
 *
 * @See Docs https://dreamy-ui.com/docs/components/progress-circular
 */
export const ProgressCircular = forwardRef<HTMLDivElement, ProgressCircularProps>((props, ref) => {
    const {
        label,
        showValueLabel,
        getProgressBarProps,
        getLabelProps,
        getSvgProps,
        getIndicatorProps,
        getTrackProps,
        valueText
    } = useCircularProgress({ ref, ...props });

    const progressBarProps = getProgressBarProps();

    return (
        <StyledProgressCircular {...progressBarProps}>
            <div>
                <svg
                    {...getSvgProps()}
                    aria-hidden="true"
                >
                    <circle {...getTrackProps()} />
                    <circle {...getIndicatorProps()} />
                </svg>
                {showValueLabel && <span data-part="valueText">{valueText}</span>}
            </div>
            {label && <span {...getLabelProps()}>{label}</span>}
        </StyledProgressCircular>
    );
});
