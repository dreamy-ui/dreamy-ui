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
 * CheckboxCard.Root
 *
 * @See Docs https://dreamy-ui.com/docs/components/checkbox-card
 */
export function Root(props: CheckboxCardRootProps) {
    const { ref } = props;
    const { children, ...rest } = props;
    const context = useCheckbox({ ...rest, isCard: true, ref });
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
 * CheckboxCard.RootProvider
 *
 * Use when controlling the checkbox card with the `useCheckbox` hook externally.
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
export const Header = withContext(dreamy.div, "header");

export interface CheckboxCardTitleProps extends HTMLDreamyProps<"p"> {}
export const Title = withContext(dreamy.p, "title");

export interface CheckboxCardDescriptionProps extends HTMLDreamyProps<"p"> {}
export const Description = withContext(dreamy.p, "description");

export interface CheckboxCardLabelProps extends HTMLDreamyProps<"label"> {}
export const Label = withContext(dreamy.label, "label");

export interface CheckboxCardCheckboxProps extends HTMLDreamyProps<"div"> {}

/**
 * CheckboxCard.Checkbox
 *
 * The checkbox indicator. Must be used inside `CheckboxCard.Root`.
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
