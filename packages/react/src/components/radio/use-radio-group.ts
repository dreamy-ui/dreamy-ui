import { useCallbackRef } from "@/hooks";
import { useControllableState } from "@/hooks/use-controllable-state";
import { createContext } from "@/provider";
import { isObject } from "@/utils/object";
import { useCallback } from "react";
import type { UserFeedbackProps } from "../field";

export interface RadioGroupContext
	extends Pick<
		UseRadioGroupReturn,
		"onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
	> {
	/**
	 * Should reduce motion
	 */
	reduceMotion?: boolean;
	variants?: Record<string, any>;
}

export const [RadioGroupProvider, useRadioGroupContext] = createContext<RadioGroupContext>({
	name: "RadioGroupContext",
	strict: false
});

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
	variants?: Record<string, any>;
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
			let selectedValue: string | number = isInputEvent(eventOrValue)
				? eventOrValue.target.value
				: eventOrValue;

			if (typeof selectedValue === "string") {
				selectedValue = Number(selectedValue) || selectedValue;
			}

			setValue(selectedValue);
		},
		[setValue]
	);

	return {
		value,
		onChange: handleChange,
		setValue,
		...rest
	};
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>;
