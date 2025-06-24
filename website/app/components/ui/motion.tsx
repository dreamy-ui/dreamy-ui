"use client";

import { splitProps } from "@dreamy-ui/react";
import { type MotionProps, isValidMotionProp, m } from "motion/react";
import { forwardRef } from "react";
import { isCssProperty, styled } from "styled-system/jsx";
import { type FlexProperties, flex } from "styled-system/patterns";
import type { HTMLDreamyProps } from "./factory";

const StyledMotionBox = styled(
    m.div,
    {},
    {
        shouldForwardProp: (prop, variantKeys) =>
            isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
    }
);

/**
 * MotionBox component. A styled wrapper around the `m.div` component from `motion/react`.
 *
 * @See Docs https://dreamy-ui.com/docs/components/motion-box
 */
export const MotionBox = forwardRef<HTMLDivElement, MotionBoxProps>((props, ref) => {
    return (
        <StyledMotionBox
            ref={ref}
            {...(props as any)}
        />
    );
});

type BoxWithNoMotionProps = Omit<HTMLDreamyProps<"div">, keyof MotionProps>;

export interface MotionBoxProps extends BoxWithNoMotionProps, MotionProps {
    ref?: React.Ref<HTMLDivElement>;
}

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

MotionFlex.displayName = "MotionFlex";

type MotionAndFlexProps = MotionProps & FlexProperties;
type FlexWithNoMotionProps = Omit<HTMLDreamyProps<"div">, keyof MotionAndFlexProps>;

export interface MotionFlexProps extends FlexWithNoMotionProps, FlexProperties, MotionProps {}
