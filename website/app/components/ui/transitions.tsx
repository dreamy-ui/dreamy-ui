"use client";

import {
    TRANSITION_DEFAULTS,
    type WithTransitionConfig,
    useMotionVariants
} from "@dreamy-ui/react";
import {
    AnimatePresence,
    type AnimatePresenceProps,
    type HTMLMotionProps,
    type Variants
} from "motion/react";
import { forwardRef, useMemo } from "react";
import { css, cx } from "styled-system/css";
import { MotionBox, type MotionBoxProps } from "./motion";

export interface CollapseOptions {
    /**
     * If `true`, the opacity of the content will be animated
     * @default true
     */
    animateOpacity?: boolean;
    /**
     * The height you want the content in its collapsed state.
     * @default 0
     */
    startingHeight?: number | string;
    /**
     * The height you want the content in its expanded state.
     * @default "auto"
     */
    endingHeight?: number | string;
    /**
     * Props to pass to the AnimatePresence component
     */
    animatePresenceProps?: AnimatePresenceProps;
}

export interface CollapseProps extends WithTransitionConfig<MotionBoxProps>, CollapseOptions {}

/**
 * Collapse component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/transitions
 */
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>((props, ref) => {
    const {
        isOpen,
        unmountOnExit,
        animateOpacity = true,
        startingHeight = 0,
        endingHeight = "auto",
        style,
        className,
        transition,
        transitionEnd,
        animatePresenceProps,
        ...rest
    } = props;

    const custom = useMemo(
        () => ({
            startingHeight,
            endingHeight,
            animateOpacity,
            transition,
            transitionEnd: {
                enter: transitionEnd?.enter,
                exit: unmountOnExit ? transitionEnd?.exit : transitionEnd?.exit
            }
        }),
        [startingHeight, endingHeight, animateOpacity, transition, transitionEnd, unmountOnExit]
    );

    const {
        collapse: { default: variants }
    } = useMotionVariants();

    const show = useMemo(() => (unmountOnExit ? isOpen : true), [unmountOnExit, isOpen]);
    const animate = useMemo(
        () => (isOpen || unmountOnExit ? "initial" : "exit"),
        [isOpen, unmountOnExit]
    );

    return (
        <AnimatePresence
            initial={false}
            custom={custom}
            {...animatePresenceProps}
        >
            {show && (
                <MotionBox
                    ref={ref}
                    custom={custom}
                    variants={variants}
                    initial={unmountOnExit ? "exit" : false}
                    animate={animate}
                    exit="exit"
                    {...rest}
                    className={cx(
                        css({
                            overflow: "hidden",
                            display: "block"
                        }),
                        className
                    )}
                />
            )}
        </AnimatePresence>
    );
});

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

const variants: Variants = {
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
        transitionEnd: {
            ...transitionEnd?.enter
        }
    })
};

export const ScaleConfig: HTMLMotionProps<"div"> = {
    initial: "exit",
    animate: "enter",
    exit: "exit",
    variants: variants
};

export interface ScaleProps extends ScaleOptions, WithTransitionConfig<MotionBoxProps> {}

export const Scale = forwardRef<HTMLDivElement, ScaleProps>(function Scale(props, ref) {
    const {
        unmountOnExit,
        isOpen,
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
