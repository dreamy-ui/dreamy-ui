"use client";

import { splitProps } from "@dreamy-ui/react";
import { type MotionProps, motion } from "motion/react";
import { forwardRef } from "react";
import { type FlexProperties, flex } from "styled-system/patterns";
import { type HTMLDreamyProps, dreamy } from "./factory";

const StyledMotionBox = motion.create(dreamy.div);
// dreamy(
//     m.div,
//     {},
//     {
//         shouldForwardProp: (prop, variantKeys) =>
//             isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
//     }
// );

/**
 * MotionBox component. A styled wrapper around the `m.div` component from `motion/react`.
 *
 * @See Docs https://dreamy-ui.com/docs/components/motion
 */
export const MotionBox = forwardRef<HTMLDivElement, MotionBoxProps>((props, ref) => {
    return (
        <StyledMotionBox
            ref={ref}
            {...(props as any)}
        />
    );
});

export interface MotionBoxProps
    extends Omit<HTMLDreamyProps<"div">, keyof MotionProps>,
        MotionProps {}

/**
 * MotionFlex component
 *
 * @See Docs https://dreamy-ui.com/docs/components/motion
 */
export const MotionFlex = forwardRef<HTMLDivElement, MotionFlexProps>((props, ref) => {
    const [patternProps, restProps] = splitProps(props, [
        "align",
        "justify",
        "direction",
        "wrap",
        "basis",
        "grow",
        "shrink"
    ]);

    const styles = flex.raw(patternProps);

    return (
        <StyledMotionBox
            ref={ref}
            {...(styles as any)}
            {...restProps}
        />
    );
});

export interface MotionFlexProps extends Omit<MotionBoxProps, "direction">, FlexProperties {}
