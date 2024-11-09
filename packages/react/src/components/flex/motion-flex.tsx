"use client";

import type { HTMLDreamProps } from "@/utils/types";
import { isCssProperty, styled } from "@dreamy-ui/system/jsx";
import { flex } from "@dreamy-ui/system/recipes";
import { type MotionProps, isValidMotionProp, m } from "framer-motion";
import { forwardRef } from "react";

const StyledMotionFlex = styled(m.div, flex, {
    shouldForwardProp: (prop, variantKeys) =>
        isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
});

export const MotionFlex = forwardRef<HTMLDivElement, MotionFlexProps>((props, ref) => {
    return (
        <StyledMotionFlex
            ref={ref}
            {...(props as any)}
        />
    );
});

type FlexWithNoMotionProps = Omit<HTMLDreamProps<"div">, keyof MotionProps>;

export interface MotionFlexProps extends FlexWithNoMotionProps, MotionProps {}
