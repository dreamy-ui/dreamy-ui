"use client";

import {
    type PartProps,
    type PrimitiveHandle,
    createParts,
    usePart,
    usePrimitive
} from "@ui-sdk/react/primitive";
import { createContext, useContext, useSyncExternalStore } from "react";
import {
    type StepStatus,
    type StepperOptions,
    type StepperOrientation,
    type StepperPrimitive,
    type StepperRootState,
    stepperPrimitive
} from "./stepper";

const parts = createParts(stepperPrimitive, {
    list: "ol",
    item: "li",
    trigger: "div",
    indicator: "div",
    separator: "div",
    content: "div",
    "completed-content": "div",
    "next-trigger": "button",
    "prev-trigger": "button"
});

const StepperHandleContext = createContext<PrimitiveHandle<StepperPrimitive> | null>(null);

export type StepperPrimitiveRootProps = StepperOptions &
    Omit<PartProps<"div", StepperRootState>, keyof StepperOptions>;

function StepperRoot({
    count,
    step,
    defaultStep,
    onStepChange,
    orientation,
    controller,
    debug,
    ...props
}: StepperPrimitiveRootProps) {
    const handle = usePrimitive(stepperPrimitive, {
        count,
        step,
        defaultStep,
        onStepChange,
        orientation,
        controller,
        debug
    });

    return (
        <StepperHandleContext.Provider value={handle}>
            {usePart(handle, "root", {}, props, "div")}
        </StepperHandleContext.Provider>
    );
}

export interface StepperPrimitiveState {
    step: number;
    count: number;
    orientation: StepperOrientation;
    isComplete: boolean;
    hasNextStep: boolean;
    hasPrevStep: boolean;
    setStep: (step: number) => void;
    goToNext: () => void;
    goToPrev: () => void;
    getStepStatus: (index: number) => StepStatus;
    baseId: string;
}

export function useStepperPrimitive(): StepperPrimitiveState {
    const handle = useContext(StepperHandleContext);
    if (!handle) {
        throw new Error("Stepper compound components must be used within Stepper.Root");
    }

    const snapshot = useSyncExternalStore(
        handle.instance.subscribe,
        handle.instance.get,
        handle.instance.get
    );

    return {
        step: snapshot.step,
        count: snapshot.count,
        orientation: snapshot.orientation,
        isComplete: snapshot.step >= snapshot.count,
        hasNextStep: snapshot.step < snapshot.count,
        hasPrevStep: snapshot.step > 0,
        setStep: (step) => {
            handle.api.setStep(step);
        },
        goToNext: () => {
            handle.api.next();
        },
        goToPrev: () => {
            handle.api.prev();
        },
        getStepStatus: handle.api.getStatus,
        baseId: handle.instance.id
    };
}

export const StepperPrimitiveParts = {
    Root: StepperRoot,
    List: parts.List,
    Item: parts.Item,
    Trigger: parts.Trigger,
    Indicator: parts.Indicator,
    Separator: parts.Separator,
    Content: parts.Content,
    CompletedContent: parts.CompletedContent,
    NextTrigger: parts.NextTrigger,
    PrevTrigger: parts.PrevTrigger,
    useState: useStepperPrimitive
};
