"use client";

import type { ChangeDetails } from "@ui-sdk/core";
import {
    Radio as UiSdkRadio,
    RadioGroup as UiSdkRadioGroup,
    RadioIndicator as UiSdkRadioIndicator,
    createRadioGroupController,
    type RadioGroupController,
    type RadioGroupValueChangeReason
} from "@ui-sdk/react/radio";
import {
    createContext,
    dataAttr,
    RadioGroupProvider as LegacyRadioGroupProvider,
    useFieldProps
} from "@dreamy-ui/react";
import {
    type ChangeEvent,
    type KeyboardEvent,
    type PointerEvent,
    useMemo,
    useRef,
    useState
} from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type RadioVariantProps, radio } from "styled-system/recipes";
import { Flex, type FlexProps } from "./flex";

const StyledRadioItem = dreamy("label", radio);

interface RadioGroupContextValue extends RadioVariantProps {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    reduceMotion?: boolean;
    name?: string;
}

const [RadioGroupProvider, useRadioGroupContext] =
    createContext<RadioGroupContextValue>({
        strict: false,
        name: "RadioGroupContext"
    });

export interface RadioProps
    extends RadioVariantProps,
        Omit<
            HTMLDreamyProps<"label">,
            | "value"
            | "onChange"
            | "defaultValue"
            | "onValueChange"
            | "isChecked"
            | "defaultChecked"
        > {
    /**
     * The value this radio submits when checked. Inside a `RadioGroup` it joins
     * the group's value.
     */
    value: string;
    /**
     * Whether this radio is checked. Only used outside a `RadioGroup`.
     */
    checked?: boolean;
    /**
     * Whether this radio is checked at first. Only used outside a `RadioGroup`.
     */
    defaultChecked?: boolean;
    /**
     * Runs when this radio wants to change its checked state. Only used
     * outside a `RadioGroup`; inside one use the group's `onValueChange`.
     */
    onCheckedChange?: (
        checked: boolean,
        details: ChangeDetails<RadioGroupValueChangeReason>
    ) => void;
    /**
     * Disables this radio. Inside a `RadioGroup`, prefer the group's `disabled`.
     */
    disabled?: boolean;
    /**
     * Keeps the radio focusable and submitted, but stops changes. Only used
     * outside a `RadioGroup`.
     */
    readOnly?: boolean;
    /**
     * Blocks form submission until the radio is checked. Only used outside a
     * `RadioGroup`.
     */
    required?: boolean;
    /**
     * The name the value submits under. Only used outside a `RadioGroup`.
     */
    name?: string;
    /**
     * Marks the radio as invalid for styling purposes.
     */
    isInvalid?: boolean;
}

function RadioItem(props: RadioProps) {
    const {
        children,
        value,
        className,
        scheme,
        size,
        variant,
        disabled: disabledProp,
        readOnly: readOnlyProp,
        required: requiredProp,
        isInvalid: isInvalidProp,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        onKeyDown,
        onKeyUp,
        ...rest
    } = props;
    const field = useFieldProps(props);
    const groupContext = useRadioGroupContext();
    const isDisabled =
        Boolean(disabledProp) || field.isDisabled || groupContext?.isDisabled === true;
    const isReadOnly =
        Boolean(readOnlyProp) || field.isReadOnly || groupContext?.isReadOnly === true;
    const isRequired =
        Boolean(requiredProp) || field.isRequired || groupContext?.isRequired === true;
    const isInvalid = isInvalidProp ?? groupContext?.isInvalid ?? field.isInvalid;
    const isInteractionDisabled = isDisabled || isReadOnly;
    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    return (
        <StyledRadioItem
            {...rest}
            className={cx("group", className as string)}
            scheme={scheme ?? groupContext?.scheme}
            size={size ?? groupContext?.size}
            variant={variant ?? groupContext?.variant}
            data-active={active ? "" : undefined}
            data-disabled={dataAttr(isDisabled)}
            data-invalid={dataAttr(isInvalid)}
            data-readonly={dataAttr(isReadOnly)}
            data-required={dataAttr(isRequired)}
            onPointerDown={(event: PointerEvent<HTMLLabelElement>) => {
                (onPointerDown as ((e: PointerEvent<HTMLLabelElement>) => void) | undefined)?.(
                    event
                );
                if (!isInteractionDisabled) {
                    setIsActive(true);
                }
            }}
            onPointerUp={(event: PointerEvent<HTMLLabelElement>) => {
                (onPointerUp as ((e: PointerEvent<HTMLLabelElement>) => void) | undefined)?.(event);
                setIsActive(false);
            }}
            onPointerLeave={(event: PointerEvent<HTMLLabelElement>) => {
                (
                    onPointerLeave as ((e: PointerEvent<HTMLLabelElement>) => void) | undefined
                )?.(event);
                setIsActive(false);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLLabelElement>) => {
                (onKeyDown as ((e: KeyboardEvent<HTMLLabelElement>) => void) | undefined)?.(event);
                if (event.key === " " && !isInteractionDisabled) {
                    setIsActive(true);
                }
            }}
            onKeyUp={(event: KeyboardEvent<HTMLLabelElement>) => {
                (onKeyUp as ((e: KeyboardEvent<HTMLLabelElement>) => void) | undefined)?.(event);
                if (event.key === " ") {
                    setIsActive(false);
                }
            }}
        >
            <UiSdkRadio
                aria-describedby={field["aria-describedby"]}
                aria-invalid={isInvalid ? true : undefined}
                aria-label={ariaLabel as string | undefined}
                aria-labelledby={ariaLabelledby as string | undefined}
                data-part="wrapper"
                data-invalid={dataAttr(isInvalid)}
                disabled={isDisabled}
                id={field.id}
                value={value}
            >
                <UiSdkRadioIndicator
                    aria-hidden="true"
                    data-part="control"
                    keepMounted
                />
            </UiSdkRadio>
            {children ? <span data-part="label">{children as React.ReactNode}</span> : null}
        </StyledRadioItem>
    );
}

/**
 * Radio component — selects one option from a group.
 *
 * @see Docs https://dreamy-ui.com/docs/components/radio
 */
export function Radio(props: RadioProps) {
    const {
        checked,
        defaultChecked,
        onCheckedChange,
        disabled,
        readOnly,
        required,
        name,
        ...rest
    } = props;
    const groupContext = useRadioGroupContext();
    const stringValue = String(props.value ?? "");

    if (groupContext) {
        return (
            <RadioItem
                {...rest}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                value={stringValue}
            />
        );
    }

    return (
        <UiSdkRadioGroup
            defaultValue={defaultChecked ? stringValue : null}
            disabled={disabled}
            name={name}
            onValueChange={(next, details) => {
                onCheckedChange?.(next === stringValue, details);
            }}
            readOnly={readOnly}
            required={required}
            value={checked === undefined ? undefined : checked ? stringValue : null}
        >
            <RadioItem
                {...rest}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                value={stringValue}
            />
        </UiSdkRadioGroup>
    );
}

export interface RadioGroupProps
    extends RadioVariantProps,
        Pick<
            React.ComponentProps<typeof UiSdkRadioGroup>,
            | "value"
            | "defaultValue"
            | "onValueChange"
            | "disabled"
            | "readOnly"
            | "required"
            | "name"
            | "form"
            | "loop"
            | "controller"
            | "debug"
        >,
        Omit<FlexProps, "defaultValue" | "onChange" | "onValueChange"> {
    isInvalid?: boolean;
    reduceMotion?: boolean;
}

export function RadioGroup(props: RadioGroupProps) {
    const {
        scheme,
        size,
        variant,
        children,
        isInvalid,
        reduceMotion,
        className,
        value,
        defaultValue,
        onValueChange,
        disabled,
        readOnly,
        required,
        name,
        form,
        loop,
        controller,
        debug,
        ...rest
    } = props;

    const internalControllerRef = useRef<RadioGroupController<string> | null>(null);
    if (internalControllerRef.current === null) {
        internalControllerRef.current = createRadioGroupController<string>();
    }
    const activeController = controller ?? internalControllerRef.current;
    const [internalValue, setInternalValue] = useState<string | null>(
        value !== undefined ? value : (defaultValue ?? null)
    );

    const handleValueChange = (
        next: string | null,
        details: ChangeDetails<RadioGroupValueChangeReason>
    ) => {
        setInternalValue(next);
        onValueChange?.(next, details);
    };

    const legacyValue = {
        value: (value !== undefined ? value : internalValue) ?? "",
        onChange: (eventOrValue: ChangeEvent<HTMLInputElement> | string | number) => {
            const next =
                eventOrValue != null &&
                typeof eventOrValue === "object" &&
                "target" in eventOrValue
                    ? (eventOrValue as ChangeEvent<HTMLInputElement>).target.value
                    : eventOrValue;
            activeController.setValue(next == null ? null : String(next), {
                reason: "imperative"
            });
        },
        isDisabled: disabled,
        isInvalid,
        isRequired: required,
        isReadOnly: readOnly,
        reduceMotion,
        variants: { scheme, size, variant }
    };

    const providerValue = useMemo<RadioGroupContextValue>(
        () => ({
            size,
            scheme,
            variant,
            isInvalid,
            isDisabled: disabled,
            isReadOnly: readOnly,
            isRequired: required,
            reduceMotion,
            name
        }),
        [
            size,
            scheme,
            variant,
            isInvalid,
            disabled,
            readOnly,
            required,
            reduceMotion,
            name
        ]
    );

    return (
        <LegacyRadioGroupProvider value={legacyValue}>
            <RadioGroupProvider value={providerValue}>
                <UiSdkRadioGroup
                    controller={activeController}
                    debug={debug}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    form={form}
                    loop={loop}
                    name={name}
                    onValueChange={handleValueChange}
                    readOnly={readOnly}
                    required={required}
                    value={value}
                >
                    <Flex
                        {...rest}
                        className={cx("dreamy-radio-group", className as string)}
                    >
                        {children}
                    </Flex>
                </UiSdkRadioGroup>
            </RadioGroupProvider>
        </LegacyRadioGroupProvider>
    );
}
