"use client";

import {
    RadioCardProvider,
    type UseRadioProps,
    type UseRadioReturn,
    useRadio,
    useRadioCardContext
} from "@dreamy-ui/react";

import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type RadioCardVariantProps, radioCard } from "styled-system/recipes";
import { VisuallyHiddenInput } from "./visually-hidden";

const { withProvider, withContext } = createStyleContext(radioCard);

const StyledRoot = withProvider(dreamy.div, "root");
const StyledRootProvider = withProvider(dreamy.div, "root");
const StyledRadio = withContext(dreamy.div, "radio");

export interface RadioCardRootProps
    extends UseRadioProps,
        RadioCardVariantProps,
        Omit<HTMLDreamyProps<"div">, keyof UseRadioProps> {}

/**
 * RadioCard.Root
 *
 * @See Docs https://dreamy-ui.com/docs/components/radio-card
 */
export function Root(props: RadioCardRootProps) {
    const { ref } = props;
    const { children, ...rest } = props;
    const context = useRadio({ ...rest, isCard: true, ref });
    const rootProps = context.getRootProps();

    return (
        <RadioCardProvider value={context}>
            <StyledRoot {...rootProps}>
                <VisuallyHiddenInput {...context.getInputProps()} />
                {children}
            </StyledRoot>
        </RadioCardProvider>
    );
}

export interface RadioCardRootProviderProps extends HTMLDreamyProps<"div"> {
    value: UseRadioReturn;
}

/**
 * RadioCard.RootProvider
 *
 * Use when controlling the radio card with the `useRadio` hook externally.
 */
export function RootProvider(props: RadioCardRootProviderProps) {
    const { value, children, ...rest } = props;
    const rootProps = value.getRootProps();

    return (
        <RadioCardProvider value={value}>
            <StyledRootProvider
                {...rootProps}
                {...rest}
            >
                <VisuallyHiddenInput {...value.getInputProps()} />
                {children}
            </StyledRootProvider>
        </RadioCardProvider>
    );
}

export interface RadioCardHeaderProps extends HTMLDreamyProps<"div"> {}
export const Header = withContext(dreamy.div, "header");

export interface RadioCardTitleProps extends HTMLDreamyProps<"p"> {}
export const Title = withContext(dreamy.p, "title");

export interface RadioCardDescriptionProps extends HTMLDreamyProps<"p"> {}
export const Description = withContext(dreamy.p, "description");

export interface RadioCardLabelProps extends HTMLDreamyProps<"label"> {}
export const Label = withContext(dreamy.label, "label");

export interface RadioCardRadioProps extends HTMLDreamyProps<"div"> {}

/**
 * RadioCard.Radio
 *
 * The radio indicator. Must be used inside `RadioCard.Root`.
 */
export function Radio(props: RadioCardRadioProps) {
    const context = useRadioCardContext();

    return (
        <StyledRadio {...props}>
            <span {...context?.getWrapperProps()}>
                <span {...context?.getControlProps()} />
            </span>
        </StyledRadio>
    );
}
