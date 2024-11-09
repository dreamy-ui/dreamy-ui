import { createDescendantContext } from "@/components/descendant";
import type { InputProps, UserFeedbackProps } from "@/components/input";
import type { HStackProps } from "@/components/stack";
import { getActionKeyCode } from "@/hooks/use-action-key";
import { useControllableState } from "@/hooks/use-controllable-state";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider/create-context";
import { callAllHandlers } from "@/utils";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * Create context to track descendants and their indices
 * -----------------------------------------------------------------------------------------------*/

export interface PinInputPropsWithRef extends InputProps {
    ref: React.Ref<HTMLInputElement>;
    index: number;
}

export const [
    PinInputDescendantsProvider,
    usePinInputDescendantsContext,
    usePinInputDescendants,
    usePinInputDescendant
] = createDescendantContext<HTMLInputElement>();

/* -------------------------------------------------------------------------------------------------
 * Create context that stores pin-input logic
 * -----------------------------------------------------------------------------------------------*/

export type PinInputContext = Omit<UsePinInputReturn, "descendants" | "getWrapperProps"> & {
    /**
     * Sets the pin input component to the disabled state
     */
    isDisabled?: boolean;
    /**
     * Sets the pin input component to the invalid state
     */
    isInvalid?: boolean;
};

export const [PinInputProvider, usePinInputContext] = createContext<PinInputContext>({
    name: "PinInputContext",
    errorMessage:
        "usePinInputContext: `context` is undefined. Seems you forgot to place all pin input fields within `<PinInput />`"
});

/* -------------------------------------------------------------------------------------------------
 * usePinInput hook
 * -----------------------------------------------------------------------------------------------*/

export interface UsePinInputProps extends UserFeedbackProps {
    /**
     * If `true`, the pin input receives focus on mount
     */
    autoFocus?: boolean;
    /**
     * The value of the pin input. This is the value
     * that will be returned when the pin input is filled
     */
    value?: string;
    /**
     * The default value of the pin input
     */
    defaultValue?: string;
    /**
     * Function called on input change
     */
    onChange?: (value: string) => void;
    /**
     * Function called when all inputs have valid values
     */
    onComplete?: (value: string) => void;
    /**
     * The placeholder for the pin input
     */
    placeholder?: string;
    /**
     * If `true`, focus will move automatically to the next input once filled
     * @default true
     */
    manageFocus?: boolean;
    /**
     * If `true`, the pin input component signals to its fields that they should
     * use `autocomplete="one-time-code"`.
     */
    otp?: boolean;
    /**
     * The top-level id string that will be applied to the input fields.
     * The index of the input will be appended to this top-level id.
     *
     * @example
     * if id="foo", the first input will have `foo-0`
     */
    id?: string;
    /**
     * The type of values the pin-input should allow
     */
    type?: "alphanumeric" | "number";
    /**
     * If `true`, the input's value will be masked just like `type=password`
     */
    mask?: boolean;
}

const toArray = (value?: string) => value?.split("");

function validate(value: string, type: UsePinInputProps["type"]) {
    const NUMERIC_REGEX = /^[0-9]+$/;
    const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/i;
    const regex = type === "alphanumeric" ? ALPHA_NUMERIC_REGEX : NUMERIC_REGEX;
    return regex.test(value);
}

/* -------------------------------------------------------------------------------------------------
 * usePinInput - handles the general pin input logic
 * -----------------------------------------------------------------------------------------------*/

interface UsePinInputReturn {
    getInputProps: (props: PinInputPropsWithRef) => PinInputPropsWithRef;
    getWrapperProps: (props: HStackProps) => HStackProps;
    id: string;
    descendants: ReturnType<typeof usePinInputDescendants>;
    values: string[];
    setValue: (value: string, index: number, handleFocus?: boolean) => void;
    setValues: (values: string[]) => void;
    clear: () => void;
}

/**
 * @internal
 */
export function usePinInput(props: UsePinInputProps = {}): UsePinInputReturn {
    const {
        autoFocus,
        value,
        defaultValue,
        onChange,
        onComplete,
        placeholder = "○",
        manageFocus = true,
        otp = false,
        id: idProp,
        type = "number",
        mask,
        ...restProps
    } = props;

    // biome-ignore lint/correctness/useExhaustiveDependencies: restProps will have different ref between renders, so we stringify it to prevent re-renders
    const rest = useMemo(() => restProps, [JSON.stringify(restProps)]);

    const uuid = useId();
    const id = idProp ?? `pin-input-${uuid}`;

    const descendants = usePinInputDescendants();

    const [moveFocus, setMoveFocus] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const [values, setValues] = useControllableState<string[]>({
        defaultValue: toArray(defaultValue) || [],
        value: toArray(value),
        onChange: (values) => onChange?.(values.join(""))
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (autoFocus) {
            const first = descendants.first();
            if (first) {
                requestAnimationFrame(() => {
                    first.node.focus();
                });
            }
        }
    }, [descendants]);

    const focusNext = useCallback(
        (index: number) => {
            if (!moveFocus || !manageFocus) {
                return;
            }
            const next = descendants.nextEnabled(index, false);
            if (next) {
                requestAnimationFrame(() => {
                    next.node?.focus();
                });
            }
        },
        [descendants, moveFocus, manageFocus]
    );

    const setValue = useCallback(
        (value: string, index: number, handleFocus = true) => {
            const nextValues = [...values];
            nextValues[index] = value;
            setValues(nextValues);

            const isComplete =
                value !== "" &&
                nextValues.length === descendants.count() &&
                nextValues.every((inputValue) => inputValue != null && inputValue !== "");

            if (isComplete) {
                onComplete?.(nextValues.join(""));
            } else {
                if (handleFocus) focusNext(index);
            }
        },
        [values, setValues, focusNext, onComplete, descendants]
    );

    const clear = useCallback(() => {
        const values: string[] = Array(descendants.count()).fill("");
        setValues(values);
        const first = descendants.first();
        first?.node?.focus();
    }, [descendants, setValues]);

    const getNextValue = useCallback((value: string, eventValue: string) => {
        let nextValue = eventValue;
        if (value?.length > 0) {
            if (value[0] === eventValue.charAt(0)) {
                nextValue = eventValue.charAt(1);
            } else if (value[0] === eventValue.charAt(1)) {
                nextValue = eventValue.charAt(0);
            }
        }
        return nextValue;
    }, []);

    const getInputProps = useCallback(
        (props: PinInputPropsWithRef): PinInputPropsWithRef => {
            const { index, ...inputRest } = props;

            /**
             * Improved from: https://github.com/uber/baseweb/blob/master/src/pin-code/pin-code.js
             */
            const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const eventValue = event.target.value;
                const currentValue = values[index];
                const nextValue = getNextValue(currentValue, eventValue);

                // if the value was removed using backspace
                if (nextValue === "") {
                    setValue("", index);
                    return;
                }

                // in the case of an autocomplete or copy and paste
                if (eventValue.length > 2) {
                    // see if we can use the string to fill out our values
                    if (validate(eventValue, type)) {
                        // Ensure the value matches the number of inputs
                        const nextValue = eventValue
                            .split("")
                            .filter((_, index) => index < descendants.count());

                        setValues(nextValue);

                        // if pasting fills the entire input fields, trigger `onComplete`
                        if (nextValue.length === descendants.count()) {
                            onComplete?.(nextValue.join(""));
                        }
                    }
                } else {
                    // only set if the new value is a number
                    if (validate(nextValue, type)) {
                        setValue(nextValue, index);
                    }

                    setMoveFocus(true);
                }
            };

            const onKeyDown = (event: React.KeyboardEvent) => {
                if (event.key === "Backspace" && manageFocus) {
                    // if user is holding shift or ctrl, remove all the inputs
                    if (event.shiftKey || event[getActionKeyCode()]) {
                        clear();
                        return;
                    }

                    if ((event.target as HTMLInputElement).value === "") {
                        const prevInput = descendants.prevEnabled(index, false);
                        if (prevInput) {
                            setValue("", index - 1, false);
                            requestAnimationFrame(() => {
                                prevInput.node?.focus();
                                // prevInput.node.value = "";
                            });
                            setMoveFocus(true);
                        }
                    } else {
                        setMoveFocus(false);
                    }
                }
            };

            const onFocus = () => {
                setFocusedIndex(index);
            };

            const onBlur = () => {
                setFocusedIndex(-1);
            };

            const hasFocus = focusedIndex === index;
            const inputType = type === "number" ? "tel" : "text";

            return {
                "aria-label": "Please enter your pin code",
                inputMode: type === "number" ? "numeric" : "text",
                type: mask ? "password" : inputType,
                index,
                ...rest,
                ...inputRest,
                id: `${id}-${index}`,
                onChange: callAllHandlers(inputRest.onChange, onChange),
                onKeyDown: callAllHandlers(inputRest.onKeyDown, onKeyDown),
                onFocus: callAllHandlers(inputRest.onFocus, onFocus),
                onBlur: callAllHandlers(inputRest.onBlur, onBlur),
                value: values[index] || "",
                autoComplete: otp ? "one-time-code" : "off",
                placeholder: hasFocus ? "" : placeholder
            };
        },
        [
            descendants,
            focusedIndex,
            getNextValue,
            id,
            mask,
            manageFocus,
            onComplete,
            otp,
            placeholder,
            setValue,
            setValues,
            type,
            values,
            clear,
            rest
        ]
    );

    const getWrapperProps = useCallback((props: HStackProps) => {
        return {
            ...props
        };
    }, []);

    return {
        // prop getter
        getInputProps,
        getWrapperProps,
        // state
        id,
        descendants,
        values,
        // actions
        setValue,
        setValues,
        clear
    };
}

export interface UsePinInputFieldProps extends InputProps {
    ref?: React.Ref<HTMLInputElement>;
}

/**
 * @internal
 */
export function usePinInputField(props: UsePinInputFieldProps = {}, ref: React.Ref<any> = null) {
    const { getInputProps } = usePinInputContext();
    const { index, register } = usePinInputDescendant({
        disabled: props?.isDisabled || props?.disabled || false
    });

    return getInputProps({
        ...props,
        ref: mergeRefs(register, ref),
        index
    });
}
