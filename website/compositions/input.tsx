"use client";

import {
	callAllHandlers,
	copyObjectWithoutKeys,
	InputGroupProvider,
	useField,
	useInputGroup
} from "@dreamy-ui/react";
import type React from "react";
import { forwardRef, useMemo } from "react";
import { splitCssProps } from "styled-system/jsx";
import { type InputVariantProps, input } from "styled-system/recipes";
import { Box, BoxProps } from "./box";
import { dreamy, HTMLDreamyProps } from "./factory";
import { Flex, FlexProps } from "./flex";

export interface UserFeedbackProps {
	/**
	 * If `true`, the form control will be required. This has 2 side effects:
	 * - The `FormLabel` will show a required indicator
	 * - The form element (e.g, Input) will have `aria-required` set to `true`
	 *
	 * @default false
	 */
	isRequired?: boolean;
	/**
	 * If `true`, the form control will be disabled. This has 2 side effects:
	 * - The `FormLabel` will have `data-disabled` attribute
	 * - The form element (e.g, Input) will be disabled
	 *
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * If `true`, the form control will be invalid. This has 2 side effects:
	 * - The `FormLabel` and `FormErrorIcon` will have `data-invalid` set to `true`
	 * - The form element (e.g, Input) will have `aria-invalid` set to `true`
	 *
	 * @default false
	 */
	isInvalid?: boolean;
	/**
	 * If `true`, the form control will be readonly
	 *
	 * @default false
	 */
	isReadOnly?: boolean;
}

export interface InputProps
	extends HTMLDreamyProps<"input">,
		InputVariantProps,
		UserFeedbackProps {
	/**
	 * The callback function that is called when the input value changes.
	 */
	onChangeValue?: (value: string) => void;
}

const StyledInput = dreamy("input", input);

/**
 * Input component
 *
 * @See Docs https://dreamy-ui.com/docs/components/input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	const inputGroup = useInputGroup();
	const field = useField(
		useMemo(() => {
			return {
				...inputGroup,
				...props
			};
		}, [inputGroup, props])
	);

	return (
		<StyledInput
			ref={ref}
			{...field}
			onChange={callAllHandlers(
				props.onChange,
				(e: React.ChangeEvent<HTMLInputElement>) =>
					props.onChangeValue?.(e.target.value)
			)}
		/>
	);
});

interface InputGroupProviderContext
	extends InputVariantProps,
		UserFeedbackProps {}

export interface InputGroupProps extends InputGroupProviderContext, BoxProps {}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
	function InputGroup(props, ref) {
		const [cssProps, rest] = splitCssProps(props);

		return (
			<InputGroupProvider
				value={copyObjectWithoutKeys(rest, ["children"])}
			>
				<Box data-input-group={"true"} ref={ref} {...cssProps}>
					{props.children}
				</Box>
			</InputGroupProvider>
		);
	}
);

export interface InputAddonProps extends FlexProps {}

const InputAddon = forwardRef<HTMLDivElement, InputAddonProps>(
	function InputAddon(props, ref) {
		return (
			<Flex
				ref={ref}
				style={{
					position: "absolute",
					top: "50%",
					transform: "translateY(-50%)",
					flex: "0 0 auto",
					width: "2.5rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					whiteSpace: "nowrap"
				}}
				{...props}
			/>
		);
	}
);

export const InputLeftAddon = forwardRef<HTMLDivElement, InputAddonProps>(
	function InputLeftAddon(props, ref) {
		return <InputAddon ref={ref} left={0} {...props} />;
	}
);

export const InputRightAddon = forwardRef<HTMLDivElement, InputAddonProps>(
	function InputRightAddon(props, ref) {
		return <InputAddon ref={ref} right={0} {...props} />;
	}
);
