"use client";

import { type UseCircularProgressProps, useCircularProgress } from "@dreamy-ui/react";
import { forwardRef } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ProgressCircularVariantProps, progressCircular } from "styled-system/recipes";

export interface ProgressCircularProps
    extends UseCircularProgressProps,
        Omit<HTMLDreamyProps<"div">, keyof UseCircularProgressProps>,
        ProgressCircularVariantProps {}

const StyledProgressCircular = dreamy("div", progressCircular);

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

    return (
        <StyledProgressCircular {...getProgressBarProps()}>
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
