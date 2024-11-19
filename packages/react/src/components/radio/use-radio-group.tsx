import { useCallbackRef } from "@/hooks";
import { useControllableState } from "@/hooks/use-controllable-state";
import { isObject } from "@/utils/object";
import { useCallback } from "react";
import type { UserFeedbackProps } from "../input";

function isInputEvent(value: any): value is { target: HTMLInputElement } {
    return value && isObject(value) && isObject(value.target);
}

export interface UseRadioGroupProps extends UserFeedbackProps {
    /**
     * The value of the Radio group
     */
    value?: string | number;
    /**
     * The initial value of the Radio group
     */
    defaultValue?: string | number;
    /**
     * The callback fired when any children Radio is checked or unchecked
     */
    onChange?(value: string | number): void;
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

export function useRadioGroup(props: UseRadioGroupProps = {}) {
    const { defaultValue, value: valueProp, onChange, isNative, ...rest } = props;

    const onChangeProp = useCallbackRef(onChange);

    const [value, setValue] = useControllableState({
        value: valueProp,
        defaultValue: defaultValue || "",
        onChange: onChangeProp
    });

    const handleChange = useCallback(
        (eventOrValue: React.ChangeEvent<HTMLInputElement> | string | number) => {
            if (!value) return;

            const isChecked = isInputEvent(eventOrValue)
                ? eventOrValue.target.checked
                : value !== eventOrValue;

            const selectedValue = isInputEvent(eventOrValue)
                ? eventOrValue.target.value
                : eventOrValue;

            const nextValue = isChecked ? selectedValue : "";

            setValue(nextValue);
        },
        [setValue, value]
    );

    const getRadioProps = useCallback(
        (props: Record<string, any> = {}) => {
            const checkedKey = isNative ? "checked" : "isChecked";
            return {
                ...props,
                [checkedKey]: value === props.value,
                onChange: handleChange
            };
        },
        [handleChange, isNative, value]
    );

    return {
        value,
        onChange: handleChange,
        setValue,
        getRadioProps,
        ...rest
    };
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>;
