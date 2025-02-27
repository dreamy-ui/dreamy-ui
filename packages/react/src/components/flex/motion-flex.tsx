"use client";

import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { type MotionProps, isValidMotionProp, m } from "motion/react";
import { forwardRef } from "react";
import { isCssProperty, styled } from "styled-system/jsx";
import { type FlexProperties, flex } from "styled-system/patterns";

const StyledMotionFlex = styled(
    m.div,
    {},
    {
        shouldForwardProp: (prop, variantKeys) =>
            isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
    }
);

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
        <StyledMotionFlex
            ref={ref}
            {...(styles as any)}
            {...restProps}
        />
    );
});

MotionFlex.displayName = "MotionFlex";

type MotionAndFlexProps = MotionProps & FlexProperties;
type FlexWithNoMotionProps = Omit<HTMLDreamProps<"div">, keyof MotionAndFlexProps>;

export interface MotionFlexProps extends FlexWithNoMotionProps, FlexProperties, MotionProps {}
