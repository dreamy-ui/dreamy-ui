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
 * Radio Card component — selectable card with a radio indicator.
 *
 * @see Docs https://dreamy-ui.com/docs/components/radio-card
 *
 * @example
 * ```tsx
 * <RadioCard.Root value="a">
 *   <RadioCard.Header>
 *     <RadioCard.Title>Plan A</RadioCard.Title>
 *   </RadioCard.Header>
 *   <RadioCard.Radio />
 * </RadioCard.Root>
 * ```
 */
export function Root(props: RadioCardRootProps) {
    const { children, ...rest } = props;
    const context = useRadio({ ...rest, isCard: true });
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
 * Radio Card Root Provider — provides external `useRadio` state to descendants.
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

/**
 * Radio Card Header — top section of the card.
 */
export const Header = withContext(dreamy.div, "header");

export interface RadioCardTitleProps extends HTMLDreamyProps<"p"> {}

/**
 * Radio Card Title — primary label for the card.
 */
export const Title = withContext(dreamy.p, "title");

export interface RadioCardDescriptionProps extends HTMLDreamyProps<"p"> {}

/**
 * Radio Card Description — supporting text for the card.
 */
export const Description = withContext(dreamy.p, "description");

export interface RadioCardLabelProps extends HTMLDreamyProps<"label"> {}

/**
 * Radio Card Label — accessible label wrapper for the card.
 */
export const Label = withContext(dreamy.label, "label");

export interface RadioCardRadioProps extends HTMLDreamyProps<"div"> {}

/**
 * Radio Card Radio — the radio indicator within the card.
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
