"use client";

import { createContext } from "@/provider";
import { useCallback, useId } from "react";
import { useControllableState } from "../../hooks/use-controllable-state";

export interface UseStepperProps {
    /**
     * The total number of steps.
     */
    count: number;
    /**
     * The initial step to start on (uncontrolled).
     * @default 0
     */
    defaultStep?: number;
    /**
     * The controlled current step index.
     */
    step?: number;
    /**
     * Callback fired when the step changes.
     */
    onStepChange?: (step: number) => void;
    /**
     * The orientation of the stepper.
     * @default "horizontal"
     */
    orientation?: "horizontal" | "vertical";
    /**
     * The id of the stepper.
     */
    id?: string;
}

export interface UseStepperReturn {
    step: number;
    count: number;
    orientation: "horizontal" | "vertical";
    id: string;
    isFirst: boolean;
    isLast: boolean;
    isComplete: boolean;
    goToNext: () => void;
    goToPrev: () => void;
    goTo: (index: number) => void;
    getRootProps: () => Record<string, any>;
    getListProps: () => Record<string, any>;
    getItemProps: (index: number) => Record<string, any>;
    getIndicatorProps: (index: number) => Record<string, any>;
    getTriggerProps: (index: number) => Record<string, any>;
    getSeparatorProps: (index: number) => Record<string, any>;
    getContentProps: (index: number) => Record<string, any>;
    getNextTriggerProps: () => Record<string, any>;
    getPrevTriggerProps: () => Record<string, any>;
}

export const [StepperProvider, useStepperContext] = createContext<UseStepperReturn>({
    name: "StepperContext",
    hookName: "useStepperContext",
    providerName: "<Stepper.Root />"
});

export function useStepper(props: UseStepperProps): UseStepperReturn {
    const {
        count,
        defaultStep = 0,
        step: stepProp,
        onStepChange,
        orientation = "horizontal",
        id: idProp
    } = props;

    const uid = useId();
    const id = idProp ?? `stepper-${uid}`;

    const [step, setStep] = useControllableState({
        value: stepProp,
        defaultValue: defaultStep,
        onChange: onStepChange
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

    function getRootProps() {
        return {
            "data-orientation": orientation,
            id
        };
    }

    function getListProps() {
        return {
            "data-part": "list",
            "data-orientation": orientation,
            role: "list"
        };
    }

    function getStepStatus(index: number): "complete" | "current" | "incomplete" {
        if (index < step) return "complete";
        if (index === step) return "current";
        return "incomplete";
    }

    function getItemProps(index: number) {
        const status = getStepStatus(index);
        return {
            "data-part": "item",
            "data-status": status,
            "data-complete": status === "complete" ? "" : undefined,
            "data-current": status === "current" ? "" : undefined,
            "data-incomplete": status === "incomplete" ? "" : undefined,
            "data-orientation": orientation,
            role: "listitem"
        };
    }

    function getIndicatorProps(index: number) {
        const status = getStepStatus(index);
        return {
            "data-part": "indicator",
            "data-status": status,
            "data-complete": status === "complete" ? "" : undefined,
            "data-current": status === "current" ? "" : undefined,
            "data-incomplete": status === "incomplete" ? "" : undefined
        };
    }

    function getTriggerProps(index: number) {
        const status = getStepStatus(index);
        return {
            "data-part": "trigger",
            "data-status": status,
            "aria-current": status === "current" ? "step" : undefined
        };
    }

    function getSeparatorProps(index: number) {
        const status = getStepStatus(index);
        return {
            "data-part": "separator",
            "data-status": status,
            "data-complete": status === "complete" ? "" : undefined,
            "data-orientation": orientation,
            role: "separator"
        };
    }

    function getContentProps(index: number) {
        return {
            "data-part": "content",
            hidden: step !== index,
            role: "tabpanel",
            id: `${id}-content-${index}`,
            "aria-labelledby": `${id}-trigger-${index}`
        };
    }

    function getNextTriggerProps() {
        return {
            "data-part": "next-trigger",
            type: "button" as const,
            disabled: isComplete,
            onClick: goToNext
        };
    }

    function getPrevTriggerProps() {
        return {
            "data-part": "prev-trigger",
            type: "button" as const,
            disabled: isFirst,
            onClick: goToPrev
        };
    }

    return {
        step,
        count,
        orientation,
        id,
        isFirst,
        isLast,
        isComplete,
        goToNext,
        goToPrev,
        goTo,
        getRootProps,
        getListProps,
        getItemProps,
        getIndicatorProps,
        getTriggerProps,
        getSeparatorProps,
        getContentProps,
        getNextTriggerProps,
        getPrevTriggerProps
    };
}
