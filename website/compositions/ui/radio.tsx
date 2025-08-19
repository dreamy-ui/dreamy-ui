"use client";

import {
    type UseRadioGroupProps,
    type UseRadioGroupReturn,
    type UseRadioProps,
    createContext,
    useRadio,
    useRadioGroup
} from "@dreamy-ui/react";
import { forwardRef, useMemo } from "react";
import { cx } from "styled-system/css";
import { type RadioVariantProps, radio } from "styled-system/recipes";
import { type HTMLDreamyProps, dreamy } from "./factory";
import { Flex, type FlexProps } from "./flex";
import { VisuallyHiddenInput } from "./visually-hidden";

export interface RadioProps
    extends UseRadioProps,
        RadioVariantProps,
        Omit<HTMLDreamyProps<"input">, keyof UseRadioProps> {}

const StyledRadio = dreamy("div", radio);

/**
 * Radio component
 *
 * @See Docs https://dreamy-ui.com/docs/components/radio
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
    const {
        children,
        getRootProps,
        getWrapperProps,
        getControlProps,
        getInputProps,
        getLabelProps
    } = useRadio({ ...props, ref });

    return (
        <StyledRadio {...getRootProps()}>
            <VisuallyHiddenInput {...getInputProps()} />
            <span {...getWrapperProps()}>
                <span {...getControlProps()} />
            </span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledRadio>
    );
});

export interface RadioGroupContext
    extends Pick<
            UseRadioGroupReturn,
            "onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
        >,
        RadioVariantProps {
    /**
     * Should reduce motion
     */
    reduceMotion?: boolean;
}

export const [RadioGroupProvider, useRadioGroupContext] = createContext<RadioGroupContext>({
    name: "RadioGroupContext",
    strict: false
});

export interface RadioGroupProps
    extends UseRadioGroupProps,
        RadioVariantProps,
        Omit<FlexProps, "defaultValue" | "onChange"> {}

/**
 * RadioGroup component. Useful for grouping multiple Radios together.
 *
 * @See Docs https://dreamy-ui.com/docs/components/radio
 */
export function RadioGroup(props: RadioGroupProps) {
    const {
        scheme,
        size,
        variant,
        children,
        isDisabled,
        isRequired,
        isReadOnly,
        isInvalid,
        reduceMotion,
        onChange: onChangeProp,
        ...rest
    } = props;
    const { value, onChange } = useRadioGroup({ onChange: onChangeProp, ...props });

    const group = useMemo(
        () => ({
            size,
            scheme,
            variant,
            value,
            onChange,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        }),
        [
            size,
            onChange,
            scheme,
            value,
            variant,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        ]
    );

    return (
        <RadioGroupProvider value={group}>
            <Flex
                {...rest}
                className={cx("dreamy-radio-group", rest.className)}
            >
                {children}
            </Flex>
        </RadioGroupProvider>
    );
}
