"use client";

import type { HTMLDreamProps } from "@/utils/types";
import { type MotionProps, isValidMotionProp, m } from "motion/react";
import { forwardRef } from "react";
import { isCssProperty, styled } from "styled-system/jsx";

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

type BoxWithNoMotionProps = Omit<HTMLDreamProps<"div">, keyof MotionProps>;

export interface MotionBoxProps extends BoxWithNoMotionProps, MotionProps {
    ref?: React.Ref<HTMLDivElement>;
}
