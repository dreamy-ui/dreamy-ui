"use client";

import { useCallback } from "react";
import { useControllableState } from "./use-controllable-state";

export interface UseStepsProps {
    /**
     * The total number of steps.
     */
    count: number;
    /**
     * The initial step (uncontrolled).
     * @default 0
     */
    defaultStep?: number;
    /**
     * The controlled current step.
     */
    step?: number;
    /**
     * Callback fired when the step changes.
     */
    onChange?: (step: number) => void;
}

export interface UseStepsReturn {
    step: number;
    setStep: (step: number) => void;
    goToNext: () => void;
    goToPrev: () => void;
    goTo: (index: number) => void;
    isFirst: boolean;
    isLast: boolean;
    isComplete: boolean;
}

export function useSteps(props: UseStepsProps): UseStepsReturn {
    const { count, defaultStep = 0, step: stepProp, onChange } = props;

    const [step, setStep] = useControllableState({
        value: stepProp,
        defaultValue: defaultStep,
        onChange
    });

    const isFirst = step === 0;
    const isLast = step === count - 1;
    const isComplete = step >= count;

    const goToNext = useCallback(() => {
        if (step < count) {
            setStep(step + 1);
        }
    }, [step, count, setStep]);

    const goToPrev = useCallback(() => {
        if (step > 0) {
            setStep(step - 1);
        }
    }, [step, setStep]);

    const goTo = useCallback(
        (index: number) => {
            if (index >= 0 && index <= count) {
                setStep(index);
            }
        },
        [count, setStep]
    );

    return {
        step,
        setStep,
        goToNext,
        goToPrev,
        goTo,
        isFirst,
        isLast,
        isComplete
    };
}
