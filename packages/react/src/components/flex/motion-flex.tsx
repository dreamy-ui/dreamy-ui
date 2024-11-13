"use client";

import { splitProps } from "@/utils";
import type { HTMLDreamProps } from "@/utils/types";
import { isCssProperty, styled } from "@dreamy-ui/system/jsx";
import { type FlexProperties, flex } from "@dreamy-ui/system/patterns";
import { type MotionProps, isValidMotionProp, m } from "framer-motion";
import { forwardRef } from "react";

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
