import { TRANSITION_DEFAULTS, TRANSITION_EASINGS } from "@/utils";
import { isNumeric } from "@/utils/number";
import type { Transition, Variants } from "motion/react";

type VariantKeys = "modal" | "overlay" | "tooltip" | "popover" | "collapse" | "checkboxCheckIcon";
export type DefaultVariants = Record<VariantKeys, { default: Variants }>;

export const defaultMotionVariants: DefaultVariants = {
    modal: {
        default: {
            initial: {
                opacity: 0,
                scale: 0.95,
                transition: TRANSITION_DEFAULTS.enter
            },
            animate: { opacity: 1, scale: 1 },
            exit: {
                opacity: 0,
                scale: 0.95,
                transition: TRANSITION_DEFAULTS.exit
            }
        }
    },
    overlay: {
        default: {
            initial: {
                opacity: 0,
                transition: TRANSITION_DEFAULTS.enter
            },
            animate: { opacity: 1 },
            exit: {
                opacity: 0,
                transition: TRANSITION_DEFAULTS.exit
            }
        }
    },
    tooltip: {
        default: {
            initial: {
                scale: 1,
                opacity: 1,
                transition: {
                    opacity: {
                        easings: TRANSITION_EASINGS.easeOut,
                        duration: 0.2
                    },
                    scale: { duration: 0.2, ease: [0.175, 0.885, 0.4, 1.1] }
                }
            },
            exit: {
                scale: 0.85,
                opacity: 0,
                transition: {
                    opacity: {
                        duration: 0.15,
                        easings: TRANSITION_EASINGS.easeInOut
                    },
                    scale: {
                        duration: 0.2,
                        easings: TRANSITION_EASINGS.easeInOut
                    }
                }
            }
        }
    },
    popover: {
        default: {
            initial: {
                opacity: 1,
                scale: 1,
                transition: TRANSITION_DEFAULTS.enter
            },
            exit: {
                opacity: 0,
                scale: 0.95,
                transition: TRANSITION_DEFAULTS.exit
            }
        }
    },
    collapse: {
        default: {
            initial: ({ animateOpacity, endingHeight, transition, transitionEnd, delay }) => ({
                ...(animateOpacity && { opacity: 1 }),
                height: endingHeight,
                transitionEnd: transitionEnd?.enter,
                transition: transition?.enter ?? {
                    height: { duration: 0.3, ease: TRANSITION_EASINGS.easeInOut },
                    opacity: { duration: 0.4, ease: TRANSITION_EASINGS.easeInOut },
                    delay: typeof delay === "number" ? delay : delay?.enter
                }
            }),
            exit: ({ animateOpacity, startingHeight, transition, transitionEnd, delay }) => ({
                ...(animateOpacity && { opacity: isNumeric(startingHeight) ? 1 : 0 }),
                height: startingHeight,
                transitionEnd: transitionEnd?.exit,
                transition: transition?.exit ?? {
                    height: { duration: 0.2, ease: TRANSITION_EASINGS.easeInOut },
                    opacity: { duration: 0.3, ease: TRANSITION_EASINGS.easeInOut },
                    delay: typeof delay === "number" ? delay : delay?.exit
                }
            })
        }
    },
    checkboxCheckIcon: {
        default: {
            animate: ({ isChecked, active, animationTime }) => ({
                pathOffset: active ? 0.5 : !isChecked ? 1 : 0,
                pathLength: 1,
                transition: {
                    duration:
                        ((!isChecked && active) || (isChecked && !active)
                            ? animationTime
                            : animationTime / 4) / 1000,
                    ease: TRANSITION_EASINGS.easeInOut
                }
            })
        }
    }
} as const;

export const defaultDefaultTransition: Transition = {
    type: "tween",
    ease: TRANSITION_EASINGS.easeInOut,
    duration: 0.2
} satisfies Transition;
