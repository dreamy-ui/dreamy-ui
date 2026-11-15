"use client";

import type { ChangeDetails } from "@ui-sdk/core";
import {
    Checkbox as UiSdkCheckbox,
    CheckboxGroup as UiSdkCheckboxGroup,
    CheckboxIndicator as UiSdkCheckboxIndicator,
    type CheckboxController,
    type CheckedState,
    type CheckboxCheckedChangeReason
} from "@ui-sdk/react/checkbox";
import {
    TRANSITION_EASINGS,
    type UserFeedbackProps,
    createContext,
    dataAttr,
    useFieldProps,
    useMotionVariants,
    useReducedMotion
} from "@dreamy-ui/react";
import { type SVGMotionProps, m } from "motion/react";
import {
    type PointerEvent,
    type ReactElement,
    cloneElement,
    useCallback,
    useMemo,
    useState
} from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type CheckboxVariantProps, checkbox } from "styled-system/recipes";
import { Flex, type FlexProps } from "../flex";

const StyledCheckbox = dreamy("label", checkbox);

interface CheckboxGroupContextValue extends CheckboxVariantProps, UserFeedbackProps {
    reduceMotion?: boolean;
}

const [CheckboxGroupProvider, useCheckboxGroupContext] =
    createContext<CheckboxGroupContextValue>({
        strict: false,
        name: "CheckboxGroupContext"
    });

export interface CheckboxProps
    extends CheckboxVariantProps,
        Omit<
            HTMLDreamyProps<"label">,
            | "defaultValue"
            | "onChange"
            | "onChangeValue"
            | "isChecked"
            | "defaultChecked"
            | "isDisabled"
            | "isInvalid"
            | "isReadOnly"
            | "isRequired"
            | "isIndeterminate"
        > {
    /**
     * Whether the checkbox is checked. Pass `"indeterminate"` for a partly
     * checked state. Pass it to control the checkbox.
     */
    checked?: CheckedState;
    /**
     * Whether the checkbox is checked at first. A form reset returns to it.
     */
    defaultChecked?: CheckedState;
    /**
     * Runs when a user or a form reset wants to change the checked state.
     * `details.reason` says why, and `details.cancel()` stops it.
     */
    onCheckedChange?: (
        checked: CheckedState,
        details: ChangeDetails<CheckboxCheckedChangeReason>
    ) => void;
    /**
     * Disables the checkbox like a native control: it can't be focused or
     * changed, and isn't submitted.
     */
    disabled?: boolean;
    /**
     * Keeps the checkbox focusable and submitted, but stops changes.
     */
    readOnly?: boolean;
    /**
     * Blocks form submission until the checkbox is checked.
     */
    required?: boolean;
    /**
     * Marks the checkbox as invalid for styling purposes.
     */
    isInvalid?: boolean;
    /**
     * The name the checkbox submits under.
     */
    name?: string;
    /**
     * The value submitted while checked. Defaults to `"on"`.
     */
    value?: string;
    /**
     * The id of a form to belong to, when it isn't inside that form.
     */
    form?: string;
    /**
     * Makes it the parent of its group: it checks or unchecks every checkbox
     * in the group, and shows checked, unchecked or indeterminate from them.
     */
    parent?: boolean;
    /**
     * Checks it from anywhere. Create one with `createCheckboxController()`.
     */
    controller?: CheckboxController;
    debug?: boolean;
    icon?: React.ReactNode | ((props: CheckboxIconProps) => React.ReactNode);
    reduceMotion?: boolean;
    animationTime?: number;
    pathProps?: SVGMotionProps<SVGPathElement>;
}

/**
 * Checkbox component — toggles a single boolean option.
 *
 * @see Docs https://dreamy-ui.com/docs/components/checkbox
 */
export function Checkbox(props: CheckboxProps) {
    const reduceMotionGlobal = useReducedMotion();
    const groupContext = useCheckboxGroupContext();
    const {
        children,
        icon = <CheckboxIcon />,
        checked,
        defaultChecked,
        onCheckedChange,
        disabled: disabledProp,
        readOnly: readOnlyProp,
        required: requiredProp,
        isInvalid: isInvalidProp,
        reduceMotion: reduceMotionProp,
        animationTime,
        pathProps,
        scheme,
        size,
        variant,
        className,
        id: idProp,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        name,
        value,
        form,
        parent,
        controller,
        debug,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        ...rest
    } = props;

    const field = useFieldProps(props);
    const isDisabled = disabledProp ?? field.isDisabled ?? groupContext?.isDisabled;
    const isReadOnly = readOnlyProp ?? field.isReadOnly ?? groupContext?.isReadOnly;
    const isRequired = requiredProp ?? field.isRequired ?? groupContext?.isRequired;
    const isInvalid = isInvalidProp ?? groupContext?.isInvalid ?? field.isInvalid;
    const reduceMotion = reduceMotionProp ?? groupContext?.reduceMotion ?? reduceMotionGlobal ?? false;
    const isInteractionDisabled = isDisabled || isReadOnly;

    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    const resolvedScheme = scheme ?? groupContext?.scheme;
    const resolvedSize = size ?? groupContext?.size;
    const resolvedVariant = variant ?? groupContext?.variant;

    const handleCheckedChange = useCallback(
        (next: CheckedState, details: ChangeDetails<CheckboxCheckedChangeReason>) => {
            onCheckedChange?.(next, details);
        },
        [onCheckedChange]
    );

    const renderIcon = useCallback(
        (state: { checked: boolean; indeterminate: boolean }) => {
            const iconProps: CheckboxIconProps = {
                isChecked: state.checked,
                isIndeterminate: state.indeterminate,
                active,
                reduceMotion,
                animationTime,
                pathProps,
                "data-part": "icon"
            };

            return typeof icon === "function"
                ? icon(iconProps)
                : cloneElement(icon as ReactElement, iconProps);
        },
        [icon, active, reduceMotion, animationTime, pathProps]
    );

    return (
        <StyledCheckbox
            {...rest}
            scheme={resolvedScheme}
            size={resolvedSize}
            variant={resolvedVariant}
            className={cx("group", className as string)}
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
            onPointerLeave={(event: PointerEvent<HTMLLabelElement>) => {
                (
                    onPointerLeave as ((e: PointerEvent<HTMLLabelElement>) => void) | undefined
                )?.(event);
                setIsActive(false);
            }}
            onPointerUp={(event: PointerEvent<HTMLLabelElement>) => {
                (onPointerUp as ((e: PointerEvent<HTMLLabelElement>) => void) | undefined)?.(event);
                setIsActive(false);
            }}
        >
            <UiSdkCheckbox
                aria-describedby={field["aria-describedby"]}
                aria-invalid={isInvalid ? true : undefined}
                aria-label={ariaLabel as string | undefined}
                aria-labelledby={ariaLabelledby as string | undefined}
                checked={checked}
                controller={controller}
                data-part="control"
                data-invalid={dataAttr(isInvalid)}
                debug={debug}
                defaultChecked={defaultChecked}
                disabled={isDisabled}
                form={form}
                id={(idProp ?? field.id) as string | undefined}
                name={name}
                onBlur={field.onBlur}
                onCheckedChange={handleCheckedChange}
                onFocus={field.onFocus}
                parent={parent}
                readOnly={isReadOnly}
                required={isRequired}
                value={value}
            >
                <UiSdkCheckboxIndicator
                    aria-hidden="true"
                    data-part="icon"
                    keepMounted
                >
                    {renderIcon}
                </UiSdkCheckboxIndicator>
            </UiSdkCheckbox>
            {children ? <span data-part="label">{children as React.ReactNode}</span> : null}
        </StyledCheckbox>
    );
}

export interface IconCustomProps {
    animationTime?: number;
    pathProps?: SVGMotionProps<SVGPathElement>;
}

type CheckboxIconProps = Partial<{
    isChecked: boolean;
    isIndeterminate: boolean;
    active: boolean;
    reduceMotion: boolean;
    "data-part": string;
}> &
    IconCustomProps;

function CheckIcon(props: CheckboxIconProps) {
    const {
        isChecked,
        active,
        reduceMotion,
        animationTime = 200,
        pathProps,
        ...otherProps
    } = props;

    const variants = useMotionVariants();

    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            {...otherProps}
        >
            <m.path
                animate={"animate"}
                custom={{ isChecked, active, animationTime }}
                d="M20 6 9 17l-5-5"
                initial={false}
                variants={variants.checkboxCheckIcon}
                {...pathProps}
            />
        </svg>
    );
}

function IndeterminateIcon(props: CheckboxIconProps) {
    const { isChecked, reduceMotion, animationTime = 0.2, ...otherProps } = props;

    return (
        <svg
            aria-hidden="true"
            height="16"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            width="16"
            {...otherProps}
        >
            <m.line
                animate={{ pathOffset: 0, pathLength: 1 }}
                exit={{
                    pathOffset: 1,
                    pathLength: 1
                }}
                initial={{
                    pathOffset: 1,
                    pathLength: 1
                }}
                transition={{
                    duration: !reduceMotion ? animationTime / 1000 : 0,
                    ease: TRANSITION_EASINGS.easeInOut
                }}
                x1="21"
                x2="3"
                y1="12"
                y2="12"
            />
        </svg>
    );
}

export function CheckboxIcon(props: CheckboxIconProps) {
    const { isIndeterminate, ...otherProps } = props;
    const BaseIcon = useMemo(
        () => (isIndeterminate ? IndeterminateIcon : CheckIcon),
        [isIndeterminate]
    );

    return <BaseIcon {...otherProps} />;
}

export interface CheckboxGroupProps
    extends CheckboxVariantProps,
        Pick<
            React.ComponentProps<typeof UiSdkCheckboxGroup>,
            | "value"
            | "defaultValue"
            | "onValueChange"
            | "allValues"
            | "disabled"
            | "readOnly"
            | "required"
            | "name"
            | "form"
            | "controller"
            | "debug"
        >,
        Omit<FlexProps, "defaultValue" | "onChange" | "onValueChange"> {
    isInvalid?: boolean;
    reduceMotion?: boolean;
}

export function CheckboxGroup(props: CheckboxGroupProps) {
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
        allValues,
        disabled,
        readOnly,
        required,
        name,
        form,
        controller,
        debug,
        ...rest
    } = props;

    const providerValue = useMemo<CheckboxGroupContextValue>(
        () => ({
            size,
            scheme,
            variant,
            isInvalid,
            isDisabled: disabled,
            isReadOnly: readOnly,
            isRequired: required,
            reduceMotion
        }),
        [size, scheme, variant, isInvalid, disabled, readOnly, required, reduceMotion]
    );

    return (
        <CheckboxGroupProvider value={providerValue}>
            <UiSdkCheckboxGroup
                allValues={allValues}
                controller={controller}
                debug={debug}
                defaultValue={defaultValue}
                disabled={disabled}
                form={form}
                name={name}
                onValueChange={onValueChange}
                readOnly={readOnly}
                required={required}
                value={value}
            >
                <Flex
                    {...rest}
                    className={cx("dreamy-checkbox-group", className as string)}
                >
                    {children}
                </Flex>
            </UiSdkCheckboxGroup>
        </CheckboxGroupProvider>
    );
}
