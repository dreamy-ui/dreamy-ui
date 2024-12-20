"use client";

import type { HTMLDreamProps } from "@/utils/types";
import { isCssProperty, styled } from "@dreamy-ui/system/jsx";
import { type MotionProps, isValidMotionProp, m } from "motion/react";
import { forwardRef } from "react";

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
 * @See Docs https://dream-ui.com/docs/components/motion-box
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
