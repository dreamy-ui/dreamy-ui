import { useCallbackRef } from "@/hooks";
import { useControllableState } from "@/hooks/use-controllable-state";
import { createContext } from "@/provider";
import { isObject } from "@/utils/object";
import { useCallback } from "react";
import type { UserFeedbackProps } from "../field";

function isInputEvent(value: any): value is { target: HTMLInputElement } {
    return value && isObject(value) && isObject(value.target);
}

export interface CheckboxGroupContext
    extends Pick<
        UseCheckboxGroupReturn,
        "onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
    > {
    /**
     * Should reduce motion
     */
    reduceMotion?: boolean;
    variants?: Record<string, any>;
}

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<CheckboxGroupContext>(
    {
        name: "CheckboxGroupContext",
        strict: false
    }
);

export interface UseCheckboxGroupProps extends UserFeedbackProps {
    /**
     * The value of the checkbox group
     */
    value?: Array<string | number>;
    /**
     * The initial value of the checkbox group
     */
    defaultValue?: Array<string | number>;
    /**
     * The callback fired when any children Checkbox is checked or unchecked
     */
    onChange?(value: Array<string | number>): void;
    /**
     * If `true`, input elements will receive
     * `checked` attribute instead of `isChecked`.
     *
     * This assumes, you're using native radio inputs
     *
     * @default false
     */
    isNative?: boolean;
    reduceMotion?: boolean;
    variants?: Record<string, any>;
}

export function useCheckboxGroup(props: UseCheckboxGroupProps = {}) {
    const { defaultValue, value: valueProp, onChange, isNative, variants, ...rest } = props;

    const onChangeProp = useCallbackRef(onChange);

    const [value, setValue] = useControllableState({
        value: valueProp,
        defaultValue: defaultValue || [],
        onChange: onChangeProp
    });

    const handleChange = useCallback(
        (eventOrValue: React.ChangeEvent<HTMLInputElement> | string | number) => {
            if (!value) return;

            const isChecked = isInputEvent(eventOrValue)
                ? eventOrValue.target.checked
                : !value.includes(eventOrValue);

            const selectedValue = isInputEvent(eventOrValue)
                ? eventOrValue.target.value
                : eventOrValue;

            const nextValue = isChecked
                ? [...value, selectedValue]
                : value.filter((v) => String(v) !== String(selectedValue));

            setValue(nextValue);
        },
        [setValue, value]
    );

    const getCheckboxProps = useCallback(
        (props: Record<string, any> = {}) => {
            const checkedKey = isNative ? "checked" : "isChecked";
            return {
                ...props,
                [checkedKey]: value.some((val) => String(props.value) === String(val)),
                onChange: handleChange
            };
        },
        [handleChange, isNative, value]
    );

    return {
        value,
        onChange: handleChange,
        setValue,
        getCheckboxProps,
        variants,
        ...rest
    };
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>;
