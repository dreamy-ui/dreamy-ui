import { TRANSITION_DEFAULTS, TRANSITION_EASINGS } from "@/utils";
import { isNumeric } from "@/utils/number";
import type { Transition, Variants } from "motion/react";

type VariantKeys =
    | "modal"
    | "overlay"
    | "tooltip"
    | "popover"
    | "collapse"
    | "checkboxCheckIcon"
    | "actionBar";
export type DefaultVariants = Record<VariantKeys, Variants>;

export type MotionVariants = typeof defaultMotionVariants;

export const defaultMotionVariants: DefaultVariants = {
    modal: {
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
    },
    overlay: {
        initial: {
            opacity: 0,
            transition: TRANSITION_DEFAULTS.enter
        },
        animate: { opacity: 1 },
        exit: {
            opacity: 0,
            transition: TRANSITION_DEFAULTS.exit
        }
    },
    tooltip: {
        initial: {
            scale: 1,
            opacity: 1,
            transition: {
                opacity: {
                    ease: TRANSITION_EASINGS.easeOut,
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
                    ease: TRANSITION_EASINGS.easeInOut
                },
                scale: {
                    duration: 0.2,
                    ease: TRANSITION_EASINGS.easeInOut
                }
            }
        }
    },
    popover: {
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
    },
    collapse: {
        initial: ({ animateOpacity, endingHeight, transition, transitionEnd, delay }) => ({
            ...(animateOpacity && { opacity: 1 }),
            height: endingHeight,
            transitionEnd: transitionEnd?.enter,
            transition: transition?.enter ?? {
                height: {
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeInOut
                },
                opacity: {
                    duration: 0.4,
                    ease: TRANSITION_EASINGS.easeInOut
                },
                delay: typeof delay === "number" ? delay : delay?.enter
            }
        }),
        exit: ({ animateOpacity, startingHeight, transition, transitionEnd, delay }) => ({
            ...(animateOpacity && {
                opacity: isNumeric(startingHeight) ? 1 : 0
            }),
            height: startingHeight,
            transitionEnd: transitionEnd?.exit,
            transition: transition?.exit ?? {
                height: {
                    duration: 0.2,
                    ease: TRANSITION_EASINGS.easeInOut
                },
                opacity: {
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeInOut
                },
                delay: typeof delay === "number" ? delay : delay?.exit
            }
        })
    },
    checkboxCheckIcon: {
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
    },
    actionBar: {
        initial: { y: 100, opacity: 0, transition: TRANSITION_DEFAULTS.enter },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0, transition: TRANSITION_DEFAULTS.exit }
    }
} as const;

Object.freeze(defaultMotionVariants);

export const bouncyMotionVariants: DefaultVariants = {
    modal: {
        initial: {
            opacity: 0,
            scale: 0.85
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 380,
                damping: 18
            }
        },
        exit: {
            opacity: 0,
            scale: 0.88,
            transition: {
                duration: 0.18,
                ease: TRANSITION_EASINGS.easeInOut
            }
        }
    },
    overlay: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.25, ease: TRANSITION_EASINGS.easeOut }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.18, ease: TRANSITION_EASINGS.easeIn }
        }
    },
    tooltip: {
        initial: {
            scale: 1,
            opacity: 1,
            transition: {
                opacity: { ease: TRANSITION_EASINGS.easeOut, duration: 0.15 },
                scale: { type: "spring", stiffness: 500, damping: 14 }
            }
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            transition: {
                opacity: { duration: 0.12, ease: TRANSITION_EASINGS.easeInOut },
                scale: { duration: 0.14, ease: TRANSITION_EASINGS.easeInOut }
            }
        }
    },
    popover: {
        initial: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 380,
                damping: 18
            }
        },
        exit: {
            opacity: 0,
            scale: 0.92,
            transition: { duration: 0.15, ease: TRANSITION_EASINGS.easeInOut }
        }
    },
    collapse: {
        initial: ({ animateOpacity, endingHeight, transition, transitionEnd, delay }) => ({
            ...(animateOpacity && { opacity: 1 }),
            height: endingHeight,
            transitionEnd: transitionEnd?.enter,
            transition: transition?.enter ?? {
                height: {
                    type: "spring",
                    stiffness: 280,
                    damping: 22
                },
                opacity: {
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeOut
                },
                delay: typeof delay === "number" ? delay : delay?.enter
            }
        }),
        exit: ({ animateOpacity, startingHeight, transition, transitionEnd, delay }) => ({
            ...(animateOpacity && {
                opacity: isNumeric(startingHeight) ? 1 : 0
            }),
            height: startingHeight,
            transitionEnd: transitionEnd?.exit,
            transition: transition?.exit ?? {
                height: {
                    duration: 0.22,
                    ease: TRANSITION_EASINGS.easeInOut
                },
                opacity: {
                    duration: 0.18,
                    ease: TRANSITION_EASINGS.easeInOut
                },
                delay: typeof delay === "number" ? delay : delay?.exit
            }
        })
    },
    checkboxCheckIcon: {
        animate: ({ isChecked, active, animationTime }) => ({
            pathOffset: active ? 0.5 : !isChecked ? 1 : 0,
            pathLength: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 20,
                duration:
                    ((!isChecked && active) || (isChecked && !active)
                        ? animationTime
                        : animationTime / 4) / 1000
            }
        })
    },
    actionBar: {
        initial: { y: 80, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 340,
                damping: 16
            }
        },
        exit: {
            y: 80,
            opacity: 0,
            transition: { duration: 0.2, ease: TRANSITION_EASINGS.easeInOut }
        }
    }
} as const;

Object.freeze(bouncyMotionVariants);

export const defaultDefaultTransition = {
    type: "tween",
    ease: TRANSITION_EASINGS.easeInOut,
    duration: 0.2
} satisfies Transition;

Object.freeze(defaultDefaultTransition);

export const bouncyDefaultTransition = {
    type: "spring",
    stiffness: 380,
    damping: 18
} satisfies Transition;

Object.freeze(bouncyDefaultTransition);
