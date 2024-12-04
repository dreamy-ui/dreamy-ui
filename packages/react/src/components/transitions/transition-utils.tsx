import type { Target, TargetAndTransition, Transition } from "framer-motion";

function resetDurations(obj: any): Variants {
    // Loop through each key in the object
    for (const key in obj) {
        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        if (obj.hasOwnProperty(key)) {
            if (key === "duration" && typeof obj[key] === "number") {
                // Set the duration to 0 if the key is "duration"
                obj[key] = 0;
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                // Recursively process nested objects
                resetDurations(obj[key]);
            }
        }
    }
    return obj;
}

export function transformReducedMotion(variants: any, shouldReduceMotion: boolean) {
    if (shouldReduceMotion) {
        return resetDurations(variants);
    }
    return variants;
}

export type TransitionProperties = {
    /**
     * Custom `transition` definition for `enter` and `exit`
     */
    transition?: TransitionConfig;
    /**
     * Custom `transitionEnd` definition for `enter` and `exit`
     */
    transitionEnd?: TransitionEndConfig;
    /**
     * Custom `delay` definition for `enter` and `exit`
     */
    delay?: number | DelayConfig;
};

type TargetResolver<P = {}> = (props: P & TransitionProperties) => TargetAndTransition;

type Variant<P = {}> = TargetAndTransition | TargetResolver<P>;

export type Variants<P = {}> = {
    enter: Variant<P>;
    exit: Variant<P>;
    initial?: Variant<P>;
};

type WithMotionState<P> = Partial<Record<"enter" | "exit", P>>;

export type TransitionConfig = WithMotionState<Transition>;

export type TransitionEndConfig = WithMotionState<Target>;

export type DelayConfig = WithMotionState<number>;

export type WithTransitionConfig<P extends object> = Omit<P, "transition"> &
    TransitionProperties & {
        /**
         * If `true`, the element will unmount when `in={false}` and animation is done
         */
        unmountOnExit?: boolean;
        /**
         * Show the component; triggers when enter or exit states
         */
        in?: boolean;
    };
