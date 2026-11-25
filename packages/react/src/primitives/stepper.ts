import {
    type ChangeDetails,
    type ChangeOptions,
    type Named,
    type PrimitiveOptions,
    createChange,
    createController,
    definePrimitive
} from "@ui-sdk/core";

export type StepStatus = "complete" | "current" | "incomplete";
export type StepperOrientation = "horizontal" | "vertical";
export type StepperStepChangeReason = "item-press" | "next-press" | "previous-press" | "imperative";

export interface StepperOptions extends PrimitiveOptions {
    count: number;
    step?: number;
    defaultStep?: number;
    onStepChange?: (step: number, details: ChangeDetails<StepperStepChangeReason>) => void;
    orientation?: StepperOrientation;
    controller?: StepperController;
}

interface StepperInternalState {
    count: number;
    step: number;
    orientation: StepperOrientation;
}

export interface StepperRootState {
    step: number;
    count: number;
    orientation: StepperOrientation;
    isComplete: boolean;
    hasNextStep: boolean;
    hasPrevStep: boolean;
}

export interface StepperStepState {
    index: number;
    step: number;
    status: StepStatus;
    complete: boolean;
    current: boolean;
    incomplete: boolean;
}

export interface StepperContentState {
    index: number;
    open: boolean;
}

export interface StepperTriggerState {
    disabled: boolean;
}

export interface StepperApi {
    setStep: (step: number, options?: ChangeOptions<StepperStepChangeReason>) => boolean;
    next: (event?: Event) => boolean;
    prev: (event?: Event) => boolean;
    getStatus: (index: number) => StepStatus;
    isComplete: () => boolean;
    hasNextStep: () => boolean;
    hasPrevStep: () => boolean;
}

export type StepperController = StepperApi;

function clampStep(step: number, count: number): number {
    return Math.max(0, Math.min(step, Math.max(0, count)));
}

function stepStatus(index: number, step: number): StepStatus {
    if (index < step) return "complete";
    if (index === step) return "current";
    return "incomplete";
}

function stepAttrs(status: StepStatus) {
    return {
        "data-complete": status === "complete" ? "" : undefined,
        "data-current": status === "current" ? "" : undefined,
        "data-incomplete": status === "incomplete" ? "" : undefined
    };
}

function stepState(index: number, step: number): StepperStepState {
    const status = stepStatus(index, step);
    return {
        index,
        step,
        status,
        complete: status === "complete",
        current: status === "current",
        incomplete: status === "incomplete"
    };
}

const _stepperPrimitive = definePrimitive({
    name: "stepper",
    options: {
        count: "number",
        step: "number",
        defaultStep: "number",
        onStepChange: "callback",
        orientation: "string",
        controller: "value"
    },
    controlled: ["step"],
    state: (options: StepperOptions): StepperInternalState => {
        const count = Math.max(0, options.count);
        const initial = options.step ?? options.defaultStep ?? 0;
        return {
            count,
            step: clampStep(initial, count),
            orientation: options.orientation ?? "horizontal"
        };
    },
    sync: (options): Partial<StepperInternalState> => {
        const count = Math.max(0, options.count);
        const next: Partial<StepperInternalState> = { count };
        if (options.step !== undefined) {
            next.step = clampStep(options.step, count);
        }
        if (options.orientation !== undefined) {
            next.orientation = options.orientation;
        }
        return next;
    },
    api: (context): StepperApi => {
        const change = createChange(context);

        function setStep(next: number, options?: ChangeOptions<StepperStepChangeReason>) {
            const current = context.store.get();
            const clamped = clampStep(next, current.count);
            if (clamped === current.step) {
                return false;
            }
            return change("step", clamped, {
                reason: options?.reason ?? "imperative",
                event: options?.event
            });
        }

        return {
            setStep,
            next: (event?: Event) =>
                setStep(context.store.get().step + 1, { reason: "next-press", event }),
            prev: (event?: Event) =>
                setStep(context.store.get().step - 1, { reason: "previous-press", event }),
            getStatus: (index: number) => stepStatus(index, context.store.get().step),
            isComplete: () => {
                const { step, count } = context.store.get();
                return step >= count;
            },
            hasNextStep: () => {
                const { step, count } = context.store.get();
                return step < count;
            },
            hasPrevStep: () => context.store.get().step > 0
        };
    },
    slots: (slot) => ({
        root: slot<{}, StepperRootState>({
            state: (state) => ({
                step: state.step,
                count: state.count,
                orientation: state.orientation,
                isComplete: state.step >= state.count,
                hasNextStep: state.step < state.count,
                hasPrevStep: state.step > 0
            }),
            attrs: (state) => ({
                "data-orientation": state.orientation
            })
        }),
        list: slot({
            attrs: (state) => ({
                "data-orientation": state.orientation
            })
        }),
        item: slot<{ index: number }, StepperStepState>({
            props: { index: "number" },
            state: (state, { props }) => stepState(props.index, state.step),
            attrs: (state, { props }) => ({
                ...stepAttrs(stepStatus(props.index, state.step)),
                "data-orientation": state.orientation
            })
        }),
        trigger: slot<{ index: number }, StepperStepState>({
            props: { index: "number" },
            state: (state, { props }) => stepState(props.index, state.step),
            attrs: (state, { id, props }) => {
                const status = stepStatus(props.index, state.step);
                return {
                    id: `${id}-step-${props.index}`,
                    "aria-current": status === "current" ? "step" : undefined,
                    ...stepAttrs(status)
                };
            }
        }),
        indicator: slot<{ index: number }, StepperStepState>({
            props: { index: "number" },
            state: (state, { props }) => stepState(props.index, state.step),
            attrs: (state, { props }) => ({
                "aria-hidden": "true",
                ...stepAttrs(stepStatus(props.index, state.step))
            })
        }),
        separator: slot<{ index: number }, StepperStepState>({
            role: "separator",
            props: { index: "number" },
            state: (state, { props }) => stepState(props.index, state.step),
            attrs: (state, { props }) => ({
                "aria-orientation": state.orientation,
                "data-complete": props.index < state.step ? "" : undefined,
                "data-orientation": state.orientation,
                "data-part": "separator"
            })
        }),
        content: slot<{ index: number }, StepperContentState>({
            role: "tabpanel",
            props: { index: "number" },
            state: (state, { props }) => ({
                index: props.index,
                open: state.step === props.index
            }),
            attrs: (state, { id, props }) => {
                const isCurrent = state.step === props.index;
                return {
                    id: `${id}-content-${props.index}`,
                    "aria-labelledby": `${id}-step-${props.index}`,
                    "data-state": isCurrent ? "open" : "closed",
                    hidden: isCurrent ? undefined : ""
                };
            }
        }),
        "completed-content": slot<{}, { complete: boolean }>({
            present: (state) => state.step >= state.count,
            state: (state) => ({ complete: state.step >= state.count }),
            attrs: (state) => ({
                "data-complete": state.step >= state.count ? "" : undefined
            })
        }),
        "next-trigger": slot<{ disabled?: boolean }, StepperTriggerState>({
            props: { disabled: "boolean" },
            state: (state, { props }) => ({
                disabled: props.disabled ?? state.step >= state.count
            }),
            attrs: (state, { props }) => {
                const disabled = props.disabled ?? state.step >= state.count;
                return {
                    type: "button",
                    disabled: disabled ? "" : undefined,
                    "data-disabled": disabled ? "" : undefined
                };
            },
            press: ({ api, props, store }, event) => {
                const { step, count } = store.get();
                if (props.disabled ?? step >= count) return;
                api.next(event);
            }
        }),
        "prev-trigger": slot<{ disabled?: boolean }, StepperTriggerState>({
            props: { disabled: "boolean" },
            state: (state, { props }) => ({
                disabled: props.disabled ?? state.step <= 0
            }),
            attrs: (state, { props }) => {
                const disabled = props.disabled ?? state.step <= 0;
                return {
                    type: "button",
                    disabled: disabled ? "" : undefined,
                    "data-disabled": disabled ? "" : undefined
                };
            },
            press: ({ api, props, store }, event) => {
                if (props.disabled ?? store.get().step <= 0) return;
                api.prev(event);
            }
        })
    }),
    agent: {
        actions: ["setStep", "next", "prev"],
        reveals: true
    }
});

export interface StepperPrimitive extends Named<typeof _stepperPrimitive> {}
export const stepperPrimitive: StepperPrimitive = _stepperPrimitive;

export function createStepperController(): StepperController {
    return createController<StepperApi>();
}
