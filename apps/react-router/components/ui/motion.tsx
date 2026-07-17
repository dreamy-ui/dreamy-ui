"use client";

import { splitProps } from "@dreamy-ui/react";
import type { MotionProps } from "motion/react";
import * as m from "motion/react-m";

import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type FlexProperties, flex } from "styled-system/patterns";
import type { SystemStyleObject } from "styled-system/types";

const StyledMotionBox = m.create(dreamy.div);

export interface MotionBoxProps
    extends Omit<HTMLDreamyProps<"div">, keyof MotionProps>,
        MotionProps {}

/**
 * MotionBox component. A styled wrapper around the `m.div` component from `motion/react`.
 *
 * @See Docs https://dreamy-ui.com/docs/components/motion
 */
export function MotionBox(props: MotionBoxProps) {
    return <StyledMotionBox {...props} />;
}

export interface MotionFlexProps extends Omit<MotionBoxProps, "direction">, FlexProperties {}

/**
 * MotionFlex component
 *
 * @See Docs https://dreamy-ui.com/docs/components/motion
 */
export function MotionFlex(props: MotionFlexProps) {
    const [patternProps, restProps] = splitProps(props, [
        "align",
        "justify",
        "direction",
        "wrap",
        "basis",
        "grow",
        "shrink"
    ]);

    const styles = flex.raw(patternProps) as Omit<SystemStyleObject, "transition">;

    return (
        <StyledMotionBox
            {...styles}
            {...restProps}
        />
    );
}
