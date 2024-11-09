import { useCallbackRef } from "@/hooks";
import { useControllableState } from "@/hooks/use-controllable-state";
import { isObject } from "@/utils/object";
import { useCallback } from "react";
import type { UserFeedbackProps } from "../input";

function isInputEvent(value: any): value is { target: HTMLInputElement } {
    return value && isObject(value) && isObject(value.target);
}

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
}

export function useCheckboxGroup(props: UseCheckboxGroupProps = {}) {
    const { defaultValue, value: valueProp, onChange, isNative, ...rest } = props;

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
        ...rest
    };
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>;
