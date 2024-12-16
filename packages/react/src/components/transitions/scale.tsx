import { TRANSITION_DEFAULTS } from "@/utils";
import {
    AnimatePresence,
    type AnimatePresenceProps,
    type HTMLMotionProps,
    type Variants as _Variants
} from "motion/react";
import { forwardRef } from "react";
import { MotionBox, type MotionBoxProps } from "../box";
import type { Variants, WithTransitionConfig } from "./transition-utils";

interface ScaleOptions {
    /**
     * The initial scale of the element
     * @default 0.95
     */
    initialScale?: number;
    /**
     * If `true`, the element will transition back to exit state
     * @default true
     */
    reverse?: boolean;
    /**
     * Props to pass to the AnimatePresence component
     */
    animatePresenceProps?: AnimatePresenceProps;
}

const variants: Variants<ScaleOptions> = {
    exit: ({ reverse, initialScale, transition, transitionEnd }) => ({
        opacity: 0,
        ...(reverse
            ? { scale: initialScale, transitionEnd: transitionEnd?.exit }
            : { transitionEnd: { scale: initialScale, ...transitionEnd?.exit } }),
        transition: transition?.exit ?? TRANSITION_DEFAULTS.exit
    }),
    enter: ({ transitionEnd, transition }) => ({
        opacity: 1,
        scale: 1,
        transition: transition?.enter ?? TRANSITION_DEFAULTS.enter,
        transitionEnd: transitionEnd?.enter
    })
};

export const ScaleConfig: HTMLMotionProps<"div"> = {
    initial: "exit",
    animate: "enter",
    exit: "exit",
    variants: variants as _Variants
};

export interface ScaleProps extends ScaleOptions, WithTransitionConfig<MotionBoxProps> {}

export const Scale = forwardRef<HTMLDivElement, ScaleProps>(function Scale(props, ref) {
    const {
        unmountOnExit,
        in: isOpen,
        reverse = true,
        initialScale = 0.95,
        transition,
        transitionEnd,
        delay,
        animatePresenceProps,
        ...rest
    } = props;

    const show = unmountOnExit ? isOpen && unmountOnExit : true;
    const animate = isOpen || unmountOnExit ? "enter" : "exit";

    const custom = { initialScale, reverse, transition, transitionEnd, delay };

    return (
        <AnimatePresence
            {...animatePresenceProps}
            custom={custom}
        >
            {show && (
                <MotionBox
                    ref={ref}
                    {...ScaleConfig}
                    animate={animate}
                    custom={custom}
                    {...rest}
                />
            )}
        </AnimatePresence>
    );
});

Scale.displayName = "Scale";
