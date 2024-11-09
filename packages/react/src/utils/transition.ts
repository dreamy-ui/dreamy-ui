export const TRANSITION_EASINGS = {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0.5, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1]
} as const;

export const TRANSITION_DEFAULTS = {
    enter: {
        duration: 0.2,
        ease: TRANSITION_EASINGS.easeOut
    },
    exit: {
        duration: 0.1,
        ease: TRANSITION_EASINGS.easeIn
    }
} as const;
