"use client";

import {
    CheckboxCardProvider,
    type UseCheckboxProps,
    type UseCheckboxReturn,
    useCheckbox,
    useCheckboxCardContext
} from "@dreamy-ui/react";
import { type ReactElement, cloneElement, useMemo } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type CheckboxCardVariantProps, checkboxCard } from "styled-system/recipes";
import { CheckboxIcon } from "../checkbox";
import { VisuallyHiddenInput } from "../visually-hidden";

const { withProvider, withContext } = createStyleContext(checkboxCard);

const StyledRoot = withProvider(dreamy.div, "root");
const StyledRootProvider = withProvider(dreamy.div, "root");
const StyledCheckbox = withContext(dreamy.div, "checkbox");

export interface CheckboxCardRootProps
    extends UseCheckboxProps,
        CheckboxCardVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof UseCheckboxProps> {}

/**
 * Checkbox Card component — selectable card with an embedded checkbox.
 *
 * @see Docs https://dreamy-ui.com/docs/components/checkbox-card
 *
 * @example
 * ```tsx
 * <CheckboxCard.Root>
 *   <CheckboxCard.Header>
 *     <CheckboxCard.Title>Pro plan</CheckboxCard.Title>
 *     <CheckboxCard.Checkbox />
 *   </CheckboxCard.Header>
 * </CheckboxCard.Root>
 * ```
 */
export function Root(props: CheckboxCardRootProps) {
    const { children, ...rest } = props;
    const context = useCheckbox({ ...rest, isCard: true });
    const rootProps = context.getRootProps();

    return (
        <CheckboxCardProvider value={context}>
            <StyledRoot {...rootProps}>
                <VisuallyHiddenInput {...context.getInputProps()} />
                {children}
            </StyledRoot>
        </CheckboxCardProvider>
    );
}

export interface CheckboxCardRootProviderProps extends HTMLDreamyProps<"div"> {
    value: UseCheckboxReturn;
}

/**
 * Checkbox Card Root Provider — root wrapper when using `useCheckbox` externally.
 */
export function RootProvider(props: CheckboxCardRootProviderProps) {
    const { value, children, ...rest } = props;
    const rootProps = value.getRootProps();

    return (
        <CheckboxCardProvider value={value}>
            <StyledRootProvider
                {...rootProps}
                {...rest}
            >
                <VisuallyHiddenInput {...value.getInputProps()} />
                {children}
            </StyledRootProvider>
        </CheckboxCardProvider>
    );
}

export interface CheckboxCardHeaderProps extends HTMLDreamyProps<"div"> {}

/**
 * Checkbox Card Header — top section for title and checkbox indicator.
 */
export const Header = withContext(dreamy.div, "header");

export interface CheckboxCardTitleProps extends HTMLDreamyProps<"p"> {}

/**
 * Checkbox Card Title — primary label for the card.
 */
export const Title = withContext(dreamy.p, "title");

export interface CheckboxCardDescriptionProps extends HTMLDreamyProps<"p"> {}

/**
 * Checkbox Card Description — supporting text for the card option.
 */
export const Description = withContext(dreamy.p, "description");

export interface CheckboxCardLabelProps extends HTMLDreamyProps<"label"> {}

/**
 * Checkbox Card Label — accessible label tied to the card control.
 */
export const Label = withContext(dreamy.label, "label");

export interface CheckboxCardCheckboxProps extends HTMLDreamyProps<"div"> {}

/**
 * Checkbox Card Checkbox — checkbox indicator for the card.
 */
export function Checkbox(props: CheckboxCardCheckboxProps) {
    const context = useCheckboxCardContext();
    const icon = context?.icon ?? <CheckboxIcon />;
    const getIconProps = context?.getIconProps;

    const clonedIcon = useMemo(() => {
        if (!getIconProps) {
            return null;
        }

        return typeof icon === "function"
            ? icon(getIconProps())
            : cloneElement(icon as ReactElement, getIconProps());
    }, [getIconProps, icon]);

    return (
        <StyledCheckbox {...props}>
            <span {...context?.getWrapperProps()}>{clonedIcon}</span>
        </StyledCheckbox>
    );
}
