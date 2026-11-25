"use client";

import type { ChangeDetails } from "@ui-sdk/core";
import { mergeProps } from "@ui-sdk/react/primitive";
import {
    Radio as UiSdkRadio,
    RadioGroup as UiSdkRadioGroup,
    RadioIndicator as UiSdkRadioIndicator,
    createRadioGroupController,
    type RadioGroupChangeOptions,
    type RadioGroupController,
    type RadioGroupState,
    type RadioGroupValueChangeReason,
    type RadioState
} from "@ui-sdk/react/radio";
import {
    type DreamyHostProps,
    createContext,
    dataAttr,
    RadioGroupProvider as LegacyRadioGroupProvider,
    useFieldContext,
    useFieldProps
} from "@dreamy-ui/react";
import {
    type ChangeEvent,
    type ComponentProps,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
    cloneElement,
    useMemo,
    useRef,
    useState
} from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy, splitCssProps } from "styled-system/jsx";
import { type RadioVariantProps, radio } from "styled-system/recipes";
import { Flex, type FlexProps } from "./flex";

export {
    createRadioGroupController,
    type RadioGroupChangeOptions,
    type RadioGroupController,
    type RadioGroupState,
    type RadioGroupValueChangeReason,
    type RadioState
};

const StyledRadioItem = dreamy("label", radio);

interface RadioGroupContextValue extends RadioVariantProps {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    reduceMotion?: boolean;
    name?: string;
    fieldId?: string;
    ariaDescribedBy?: string;
}

export const [RadioGroupProvider, useRadioGroupContext] =
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
            | "form"
            | "render"
            | "children"
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
     * The id of a form to belong to, when used standalone outside that form.
     */
    form?: string;
    /**
     * Marks the radio as invalid for styling purposes.
     */
    isInvalid?: boolean;
    /**
     * Renders the radio as a custom element, or a function receiving the part's props and state.
     */
    render?: ComponentProps<typeof UiSdkRadio>["render"];
    /**
     * Radio label content, or a function of the radio's state when `render` is used.
     */
    children?: ReactNode | ((state: RadioState) => ReactNode);
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
        id: idProp,
        render,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        "aria-describedby": ariaDescribedbyProp,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        onKeyDown,
        onKeyUp,
        ...rest
    } = props;
    const groupContext = useRadioGroupContext();
    const fieldContext = useFieldContext();
    const hasOwnField = Boolean(
        fieldContext && (!groupContext || fieldContext.id !== groupContext.fieldId)
    );
    const field = useFieldProps({
        isDisabled: disabledProp,
        isInvalid: isInvalidProp,
        isReadOnly: readOnlyProp,
        isRequired: requiredProp,
        id: idProp as string | undefined,
        "aria-describedby": ariaDescribedbyProp as string | undefined
    });
    const isDisabled =
        Boolean(disabledProp) ||
        (hasOwnField && Boolean(field.isDisabled)) ||
        groupContext?.isDisabled === true;
    const isReadOnly =
        Boolean(readOnlyProp) ||
        (hasOwnField && Boolean(field.isReadOnly)) ||
        groupContext?.isReadOnly === true;
    const isRequired =
        Boolean(requiredProp) ||
        (hasOwnField && Boolean(field.isRequired)) ||
        groupContext?.isRequired === true;
    const isInvalid =
        isInvalidProp ?? (hasOwnField ? field.isInvalid : undefined) ?? groupContext?.isInvalid;
    const ariaDescribedBy =
        (ariaDescribedbyProp as string | undefined) ??
        (hasOwnField ? field["aria-describedby"] : groupContext?.ariaDescribedBy);
    const resolvedId = (idProp as string | undefined) ?? (hasOwnField ? field.id : undefined);
    const isInteractionDisabled = isDisabled || isReadOnly;
    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    if (render) {
        const [cssProps, domProps] = splitCssProps(rest);
        return (
            <UiSdkRadio
                {...(domProps as Record<string, unknown>)}
                aria-describedby={ariaDescribedBy}
                aria-invalid={isInvalid ? true : undefined}
                aria-label={ariaLabel as string | undefined}
                aria-labelledby={ariaLabelledby as string | undefined}
                className={cx(className as string | undefined, css(cssProps))}
                data-invalid={dataAttr(isInvalid)}
                disabled={isDisabled}
                id={resolvedId}
                render={render}
                value={value}
            >
                {children}
            </UiSdkRadio>
        );
    }

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
                aria-describedby={ariaDescribedBy}
                aria-invalid={isInvalid ? true : undefined}
                aria-label={ariaLabel as string | undefined}
                aria-labelledby={ariaLabelledby as string | undefined}
                data-part="wrapper"
                data-invalid={dataAttr(isInvalid)}
                disabled={isDisabled}
                id={resolvedId}
                value={value}
            >
                <UiSdkRadioIndicator
                    aria-hidden="true"
                    data-part="control"
                    keepMounted
                />
            </UiSdkRadio>
            {typeof children === "function" ? null : children ? (
                <span data-part="label">{children as ReactNode}</span>
            ) : null}
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
        form,
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
            form={form}
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

type UiSdkRadioGroupPickedProps = Pick<
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
    | "render"
>;

export interface RadioGroupProps
    extends RadioVariantProps,
        UiSdkRadioGroupPickedProps,
        DreamyHostProps<FlexProps, UiSdkRadioGroupPickedProps, "onChange" | "children"> {
    isInvalid?: boolean;
    reduceMotion?: boolean;
    children?: ComponentProps<typeof UiSdkRadioGroup>["children"];
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
        render,
        id: idProp,
        "aria-describedby": ariaDescribedbyProp,
        ...rest
    } = props;

    const field = useFieldProps({
        isDisabled: disabled,
        isInvalid,
        isReadOnly: readOnly,
        isRequired: required,
        id: idProp as string | undefined,
        "aria-describedby": ariaDescribedbyProp as string | undefined
    });

    const resolvedDisabled = Boolean(disabled) || Boolean(field.isDisabled);
    const resolvedReadOnly = Boolean(readOnly) || Boolean(field.isReadOnly);
    const resolvedRequired = Boolean(required) || Boolean(field.isRequired);
    const resolvedInvalid = isInvalid ?? field.isInvalid;
    const resolvedAriaDescribedBy = field["aria-describedby"];
    const resolvedId = (idProp as string | undefined) ?? field.id;

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
        isDisabled: resolvedDisabled,
        isInvalid: resolvedInvalid,
        isRequired: resolvedRequired,
        isReadOnly: resolvedReadOnly,
        reduceMotion,
        variants: { scheme, size, variant }
    };

    const providerValue = useMemo<RadioGroupContextValue>(
        () => ({
            size,
            scheme,
            variant,
            isInvalid: resolvedInvalid,
            isDisabled: resolvedDisabled,
            isReadOnly: resolvedReadOnly,
            isRequired: resolvedRequired,
            reduceMotion,
            name,
            fieldId: field.id,
            ariaDescribedBy: resolvedAriaDescribedBy
        }),
        [
            size,
            scheme,
            variant,
            resolvedInvalid,
            resolvedDisabled,
            resolvedReadOnly,
            resolvedRequired,
            reduceMotion,
            name,
            field.id,
            resolvedAriaDescribedBy
        ]
    );

    const renderGroup = (): ComponentProps<typeof UiSdkRadioGroup>["render"] => {
        if (!render) {
            return (
                <Flex
                    {...rest}
                    className={cx("dreamy-radio-group", className as string)}
                />
            );
        }
        const [cssProps, domProps] = splitCssProps(rest);
        const extraProps = {
            ...domProps,
            className: cx("dreamy-radio-group", className as string, css(cssProps))
        };
        if (typeof render === "function") {
            return (groupProps, state) => render(mergeProps(groupProps, extraProps), state);
        }
        return cloneElement(
            render,
            mergeProps(extraProps, render.props as Record<string, unknown>)
        );
    };

    return (
        <LegacyRadioGroupProvider value={legacyValue}>
            <RadioGroupProvider value={providerValue}>
                <UiSdkRadioGroup
                    aria-describedby={resolvedAriaDescribedBy}
                    aria-invalid={resolvedInvalid ? true : undefined}
                    controller={activeController}
                    data-invalid={dataAttr(resolvedInvalid)}
                    debug={debug}
                    defaultValue={defaultValue}
                    disabled={resolvedDisabled}
                    form={form}
                    id={resolvedId}
                    loop={loop}
                    name={name}
                    onValueChange={handleValueChange}
                    readOnly={resolvedReadOnly}
                    render={renderGroup()}
                    required={resolvedRequired}
                    value={value}
                >
                    {children}
                </UiSdkRadioGroup>
            </RadioGroupProvider>
        </LegacyRadioGroupProvider>
    );
}
