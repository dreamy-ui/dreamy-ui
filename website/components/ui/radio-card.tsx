"use client";

import { dataAttr, useFieldContext, useFieldProps } from "@dreamy-ui/react";
import type { ChangeDetails } from "@ui-sdk/core";
import {
    Radio as UiSdkRadio,
    RadioGroup as UiSdkRadioGroup,
    RadioIndicator as UiSdkRadioIndicator,
    type RadioGroupValueChangeReason
} from "@ui-sdk/react/radio";
import {
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
    useState
} from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type RadioCardVariantProps, radioCard } from "styled-system/recipes";
import { useRadioGroupContext } from "./radio";

const { withProvider, withContext } = createStyleContext(radioCard);

const StyledRoot = withProvider(dreamy.div, "root");
const StyledRadio = withContext(dreamy.div, "radio");

export interface RadioCardRootProps
    extends RadioCardVariantProps,
        Omit<
            HTMLDreamyProps<"div">,
            | "value"
            | "onChange"
            | "defaultValue"
            | "onValueChange"
            | "isChecked"
            | "defaultChecked"
            | "isDisabled"
            | "isInvalid"
            | "isReadOnly"
            | "isRequired"
            | "form"
            | "children"
        > {
    /**
     * The value this radio card submits when selected.
     */
    value: string;
    /**
     * Whether this radio card is checked (standalone usage outside `RadioGroup`).
     */
    checked?: boolean;
    /**
     * Whether this radio card is checked initially (standalone usage outside `RadioGroup`).
     */
    defaultChecked?: boolean;
    /**
     * Runs when the checked state changes (standalone usage outside `RadioGroup`).
     */
    onCheckedChange?: (
        checked: boolean,
        details: ChangeDetails<RadioGroupValueChangeReason>
    ) => void;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    invalid?: boolean;
    name?: string;
    /**
     * The id of a form to belong to, when used standalone outside that form.
     */
    form?: string;
    children?: ReactNode;
}

function RadioCardItem(props: RadioCardRootProps) {
    const {
        children,
        value,
        className,
        size,
        scheme,
        variant,
        disabled: disabledProp,
        readOnly: readOnlyProp,
        required: requiredProp,
        invalid: invalidProp,
        id: idProp,
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
        isInvalid: invalidProp,
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
        invalidProp ?? (hasOwnField ? field.isInvalid : undefined) ?? groupContext?.isInvalid;
    const ariaDescribedBy =
        (ariaDescribedbyProp as string | undefined) ??
        (hasOwnField ? field["aria-describedby"] : groupContext?.ariaDescribedBy);
    const resolvedId = (idProp as string | undefined) ?? (hasOwnField ? field.id : undefined);
    const inheritedVariant =
        groupContext?.variant === "outline" || groupContext?.variant === "subtle"
            ? groupContext.variant
            : undefined;
    const isInteractionDisabled = isDisabled || isReadOnly;

    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    return (
        <UiSdkRadio
            aria-describedby={ariaDescribedBy}
            aria-invalid={isInvalid ? true : undefined}
            aria-label={ariaLabel as string | undefined}
            aria-labelledby={ariaLabelledby as string | undefined}
            data-active={active ? "" : undefined}
            data-invalid={dataAttr(isInvalid)}
            data-readonly={dataAttr(isReadOnly)}
            data-required={dataAttr(isRequired)}
            disabled={isDisabled}
            id={resolvedId}
            render={
                <StyledRoot
                    {...rest}
                    className={cx("group", className as string | undefined)}
                    scheme={scheme ?? groupContext?.scheme}
                    size={size ?? groupContext?.size}
                    variant={variant ?? inheritedVariant}
                    onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                        (onKeyDown as ((e: KeyboardEvent<HTMLDivElement>) => void) | undefined)?.(
                            event
                        );
                        if (event.key === " " && !isInteractionDisabled) {
                            setIsActive(true);
                        }
                    }}
                    onKeyUp={(event: KeyboardEvent<HTMLDivElement>) => {
                        (onKeyUp as ((e: KeyboardEvent<HTMLDivElement>) => void) | undefined)?.(
                            event
                        );
                        if (event.key === " ") {
                            setIsActive(false);
                        }
                    }}
                    onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
                        (
                            onPointerDown as ((e: PointerEvent<HTMLDivElement>) => void) | undefined
                        )?.(event);
                        if (!isInteractionDisabled) {
                            setIsActive(true);
                        }
                    }}
                    onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
                        (
                            onPointerLeave as
                                | ((e: PointerEvent<HTMLDivElement>) => void)
                                | undefined
                        )?.(event);
                        setIsActive(false);
                    }}
                    onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
                        (onPointerUp as ((e: PointerEvent<HTMLDivElement>) => void) | undefined)?.(
                            event
                        );
                        setIsActive(false);
                    }}
                />
            }
            value={value}
        >
            {children}
        </UiSdkRadio>
    );
}

/**
 * Radio Card component — selectable card with a radio indicator powered by UI SDK.
 *
 * @see Docs https://dreamy-ui.com/docs/components/radio-card
 *
 * @example
 * ```tsx
 * <RadioCard.Root value="a">
 *   <RadioCard.Header>
 *     <RadioCard.Title>Plan A</RadioCard.Title>
 *     <RadioCard.Radio />
 *   </RadioCard.Header>
 * </RadioCard.Root>
 * ```
 */
export function Root(props: RadioCardRootProps) {
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
            <RadioCardItem
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
            <RadioCardItem
                {...rest}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                value={stringValue}
            />
        </UiSdkRadioGroup>
    );
}

export interface RadioCardHeaderProps extends HTMLDreamyProps<"div"> {
    className?: string;
}

/**
 * Radio Card Header — top section of the card.
 */
export const Header = withContext(dreamy.div, "header");

export interface RadioCardTitleProps extends HTMLDreamyProps<"div"> {
    className?: string;
}

/**
 * Radio Card Title — primary label for the card.
 */
export const Title = withContext(dreamy.div, "title");

export interface RadioCardDescriptionProps extends HTMLDreamyProps<"p"> {
    className?: string;
}

/**
 * Radio Card Description — supporting text for the card option.
 */
export const Description = withContext(dreamy.p, "description");

export interface RadioCardLabelProps extends HTMLDreamyProps<"label"> {
    className?: string;
}

/**
 * Radio Card Label — accessible label wrapper for the card.
 */
export const Label = withContext(dreamy.label, "label");

export interface RadioCardRadioProps extends HTMLDreamyProps<"div"> {
    className?: string;
}

/**
 * Radio Card Radio — decorative radio indicator within the card.
 */
export function Radio(props: RadioCardRadioProps) {
    return (
        <StyledRadio {...props}>
            <span
                aria-hidden="true"
                data-part="wrapper"
            >
                <UiSdkRadioIndicator
                    aria-hidden="true"
                    data-part="control"
                    keepMounted
                />
            </span>
        </StyledRadio>
    );
}
