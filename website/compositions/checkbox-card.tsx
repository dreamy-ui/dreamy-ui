import { createContext, useCheckbox, UseCheckboxProps } from "@dreamy-ui/react";
import {
	type ElementType,
	type ReactElement,
	cloneElement,
	forwardRef,
	useMemo
} from "react";
import {
	type CheckboxCardVariantProps,
	checkboxCard
} from "styled-system/recipes";
import { Box } from "./box";
import { CheckboxIcon } from "./checkbox";
import { dreamy } from "./factory";
import { Text, TextProps } from "./text";
import { VisuallyHiddenInput } from "./visually-hidden";

export const [CheckboxProvider, useCheckboxCardContext] =
	createContext<UseCheckboxProps>({
		strict: false
	});

export interface CheckboxCardProps
	extends UseCheckboxProps,
		CheckboxCardVariantProps {
	title?: string;
	description?: string;
	titleTag?: ElementType;
	titleProps?: TextProps;
	descriptionProps?: TextProps;
}

const StyledCheckbox = dreamy("div", checkboxCard);

/**
 * CheckboxCard component
 *
 * @See Docs https://dreamy-ui.com/docs/components/checkbox-card
 */
export const CheckboxCard = forwardRef<HTMLInputElement, CheckboxCardProps>(
	(props, ref) => {
		const {
			title,
			description,
			titleTag = "p",
			titleProps,
			descriptionProps,
			...rest
		} = props;
		const {
			children,
			icon = <CheckboxIcon />,
			isChecked,
			isDisabled,
			isInvalid,
			getRootProps,
			getWrapperProps,
			getInputProps,
			getIconProps,
			getLabelProps
		} = useCheckbox({ ...rest, isCard: true, ref });

		const clonedIcon = useMemo(() => {
			return typeof icon === "function"
				? icon(getIconProps() as any)
				: cloneElement(icon as ReactElement, getIconProps());
		}, [getIconProps, icon]);

		const ctx = useMemo(() => {
			return {
				children,
				icon,
				isChecked,
				isDisabled,
				isInvalid,
				getRootProps,
				getWrapperProps,
				getInputProps,
				getIconProps,
				getLabelProps
			};
		}, [
			children,
			icon,
			isChecked,
			isDisabled,
			isInvalid,
			getRootProps,
			getWrapperProps,
			getInputProps,
			getIconProps,
			getLabelProps
		]);

		return (
			<CheckboxProvider value={ctx}>
				<StyledCheckbox {...(getRootProps() as any)}>
					<Box data-part={"header"}>
						<Text as={titleTag} data-part={"title"} {...titleProps}>
							{title}
						</Text>
						<Box data-part={"checkbox-root"}>
							<VisuallyHiddenInput
								{...(getInputProps() as any)}
							/>
							<span {...getWrapperProps()}>{clonedIcon}</span>
						</Box>
					</Box>
					<Text data-part={"description"} {...descriptionProps}>
						{description}
					</Text>
				</StyledCheckbox>
			</CheckboxProvider>
		);
	}
);

CheckboxCard.displayName = "Checkbox";
