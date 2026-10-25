"use client";

import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";
import {
    RadioGroupProvider,
    type UseRadioGroupProps,
    type UseRadioGroupReturn,
    type UseRadioProps,
    useFieldProps,
    useRadioGroup,
    useRadioGroupContext
} from "@dreamy-ui/react";
import { useMemo } from "react";
import { cx } from "styled-system/css";
import { dreamy } from "styled-system/jsx";
import { type RadioVariantProps, radio } from "styled-system/recipes";
import { Flex, type FlexProps } from "../flex";
import { mapRadioGroupProps } from "./map-radio-props";

const StyledRadioItem = dreamy(ArkRadioGroup.Item, radio);

export interface RadioProps
    extends Omit<UseRadioProps, "isChecked">,
        RadioVariantProps {
    isChecked?: boolean;
}

function RadioItem(props: RadioProps) {
    const { children, value, className, name, scheme, size, variant, ...rest } = props;
    const field = useFieldProps(props);
    const groupContext = useRadioGroupContext();

    return (
        <StyledRadioItem
            className={cx("group", className)}
            data-disabled={field.isDisabled ? "" : undefined}
            data-invalid={field.isInvalid ? "" : undefined}
            data-readonly={field.isReadOnly ? "" : undefined}
            disabled={field.isDisabled}
            invalid={field.isInvalid}
            readOnly={field.isReadOnly}
            required={field.isRequired}
            scheme={scheme ?? groupContext?.scheme}
            size={size ?? groupContext?.size}
            variant={variant ?? groupContext?.variant}
            value={String(value ?? "")}
            {...rest}
        >
            <ArkRadioGroup.ItemHiddenInput
                aria-describedby={field["aria-describedby"]}
                aria-invalid={field.isInvalid ? true : undefined}
                id={field.id}
                name={name}
            />
            <ArkRadioGroup.ItemControl
                aria-hidden="true"
                data-part="wrapper"
            >
                <span data-part="control">
                    <ArkRadioGroup.Indicator />
                </span>
            </ArkRadioGroup.ItemControl>
            {children ? (
                <ArkRadioGroup.ItemText data-part="label">{children}</ArkRadioGroup.ItemText>
            ) : null}
        </StyledRadioItem>
    );
}

export function Radio(props: RadioProps) {
    const { name, value, defaultChecked, isChecked, onChange, onChangeValue, ...rest } = props;
    const groupContext = useRadioGroupContext();

    if (groupContext) {
        return (
            <RadioItem
                {...rest}
                name={name}
                onChange={onChange}
                onChangeValue={onChangeValue}
                value={value}
            />
        );
    }

    const defaultValue = defaultChecked ? String(value ?? "") : undefined;
    const controlledValue = isChecked ? String(value ?? "") : isChecked === false ? "" : undefined;

    return (
        <ArkRadioGroup.Root
            defaultValue={defaultValue}
            name={name}
            onValueChange={(details) => {
                if (details.value) {
                    onChangeValue?.(details.value);
                }
                onChange?.({
                    target: { checked: true, value: details.value }
                } as React.ChangeEvent<HTMLInputElement>);
            }}
            value={controlledValue}
        >
            <RadioItem
                {...rest}
                value={value}
            />
        </ArkRadioGroup.Root>
    );
}

export interface RadioGroupContext
    extends Pick<
            UseRadioGroupReturn,
            "onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
        >,
        RadioVariantProps {
    reduceMotion?: boolean;
}

export interface RadioGroupProps
    extends UseRadioGroupProps,
        RadioVariantProps,
        Omit<FlexProps, "defaultValue" | "onChange"> {}

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
        value: valueProp,
        defaultValue,
        name,
        ...rest
    } = props;

    const group = useRadioGroup({
        onChange: onChangeProp,
        value: valueProp,
        defaultValue,
        name,
        isDisabled,
        isRequired,
        isReadOnly,
        isInvalid,
        ...props
    });

    const providerValue = useMemo(
        () => ({
            size,
            scheme,
            variant,
            value: group.value,
            onChange: group.onChange,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        }),
        [
            size,
            group.onChange,
            group.value,
            scheme,
            variant,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        ]
    );

    const arkGroup = mapRadioGroupProps({
        isDisabled,
        isInvalid,
        isReadOnly,
        isRequired,
        value: group.value != null ? String(group.value) : undefined,
        defaultValue: defaultValue != null ? String(defaultValue) : undefined,
        name,
        onChange: group.onChange
    });

    return (
        <RadioGroupProvider value={providerValue}>
            <ArkRadioGroup.Root {...arkGroup}>
                <Flex
                    {...rest}
                    className={cx("dreamy-radio-group", rest.className)}
                >
                    {children}
                </Flex>
            </ArkRadioGroup.Root>
        </RadioGroupProvider>
    );
}
