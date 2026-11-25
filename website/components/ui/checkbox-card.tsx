"use client";

import {
    dataAttr,
    useFieldProps,
    useReducedMotion
} from "@dreamy-ui/react";
import type { ChangeDetails } from "@ui-sdk/core";
import {
    Checkbox as UiSdkCheckbox,
    CheckboxIndicator as UiSdkCheckboxIndicator,
    type CheckboxCheckedChangeReason,
    type CheckboxController,
    type CheckedState,
    createCheckboxController
} from "@ui-sdk/react/checkbox";
import type { SVGMotionProps } from "motion/react";
import {
    type PointerEvent,
    type ReactElement,
    type ReactNode,
    cloneElement,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react";
import { cx } from "styled-system/css";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type CheckboxCardVariantProps, checkboxCard } from "styled-system/recipes";
import { CheckboxIcon, useCheckboxGroupContext } from "./checkbox";

const { withProvider, withContext } = createStyleContext(checkboxCard);

const StyledRoot = withProvider(dreamy.div, "root");
const StyledCheckbox = withContext(dreamy.div, "checkbox");

export { createCheckboxController };

interface CheckboxCardVisualContextValue {
    active: boolean;
    icon: ReactNode | ((props: Record<string, unknown>) => ReactNode);
    reduceMotion: boolean;
    animationTime?: number;
    pathProps?: SVGMotionProps<SVGPathElement>;
}

const CheckboxCardVisualContext = createContext<CheckboxCardVisualContextValue>({
    active: false,
    icon: <CheckboxIcon />,
    reduceMotion: false
});

export interface CheckboxCardRootProps
    extends CheckboxCardVariantProps,
        Omit<
            HTMLDreamyProps<"div">,
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
            | "children"
        > {
    /**
     * Whether the card checkbox is checked. Pass `"indeterminate"` for a partly checked state.
     */
    checked?: CheckedState;
    /**
     * Whether the card checkbox is checked initially when uncontrolled.
     */
    defaultChecked?: CheckedState;
    /**
     * Runs when the checked state wants to change.
     */
    onCheckedChange?: (
        checked: CheckedState,
        details: ChangeDetails<CheckboxCheckedChangeReason>
    ) => void;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    invalid?: boolean;
    name?: string;
    value?: string;
    form?: string;
    parent?: boolean;
    controller?: CheckboxController;
    debug?: boolean;
    icon?: ReactNode | ((props: Record<string, unknown>) => ReactNode);
    reduceMotion?: boolean;
    animationTime?: number;
    pathProps?: SVGMotionProps<SVGPathElement>;
    children?: ReactNode;
}

/**
 * Checkbox Card component — selectable card with an embedded checkbox powered by UI SDK.
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
        invalid: invalidProp,
        reduceMotion: reduceMotionProp,
        animationTime,
        pathProps,
        name,
        value,
        form,
        parent,
        controller,
        debug,
        id: idProp,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        className,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        ...rest
    } = props;

    const field = useFieldProps({
        isDisabled: disabledProp,
        isInvalid: invalidProp,
        isReadOnly: readOnlyProp,
        isRequired: requiredProp,
        id: idProp as string | undefined
    });

    const isDisabled = disabledProp ?? field.isDisabled ?? groupContext?.isDisabled;
    const isReadOnly = readOnlyProp ?? field.isReadOnly ?? groupContext?.isReadOnly;
    const isRequired = requiredProp ?? field.isRequired ?? groupContext?.isRequired;
    const isInvalid = invalidProp ?? groupContext?.isInvalid ?? field.isInvalid;
    const reduceMotion =
        reduceMotionProp ?? groupContext?.reduceMotion ?? reduceMotionGlobal ?? false;
    const isInteractionDisabled = isDisabled || isReadOnly;

    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;

    const visualContext = useMemo<CheckboxCardVisualContextValue>(
        () => ({
            active,
            icon,
            reduceMotion,
            animationTime,
            pathProps
        }),
        [active, icon, reduceMotion, animationTime, pathProps]
    );

    return (
        <CheckboxCardVisualContext.Provider value={visualContext}>
            <UiSdkCheckbox
                aria-describedby={field["aria-describedby"]}
                aria-invalid={isInvalid ? true : undefined}
                aria-label={ariaLabel as string | undefined}
                aria-labelledby={ariaLabelledby as string | undefined}
                checked={checked}
                controller={controller}
                data-active={active ? "" : undefined}
                data-invalid={dataAttr(isInvalid)}
                debug={debug}
                defaultChecked={defaultChecked}
                disabled={isDisabled}
                form={form}
                id={(idProp ?? field.id) as string | undefined}
                name={name}
                onBlur={field.onBlur}
                onCheckedChange={onCheckedChange}
                onFocus={field.onFocus}
                parent={parent}
                readOnly={isReadOnly}
                render={
                    <StyledRoot
                        {...rest}
                        className={cx("group", className as string | undefined)}
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
                            (
                                onPointerUp as ((e: PointerEvent<HTMLDivElement>) => void) | undefined
                            )?.(event);
                            setIsActive(false);
                        }}
                    />
                }
                required={isRequired}
                value={value}
            >
                {children}
            </UiSdkCheckbox>
        </CheckboxCardVisualContext.Provider>
    );
}

export interface CheckboxCardHeaderProps extends HTMLDreamyProps<"div"> {
    className?: string;
}

/**
 * Checkbox Card Header — top section for title and checkbox indicator.
 */
export const Header = withContext(dreamy.div, "header");

export interface CheckboxCardTitleProps extends HTMLDreamyProps<"div"> {
    className?: string;
}

/**
 * Checkbox Card Title — primary label for the card.
 */
export const Title = withContext(dreamy.div, "title");

export interface CheckboxCardDescriptionProps extends HTMLDreamyProps<"p"> {
    className?: string;
}

/**
 * Checkbox Card Description — supporting text for the card option.
 */
export const Description = withContext(dreamy.p, "description");

export interface CheckboxCardLabelProps extends HTMLDreamyProps<"label"> {
    className?: string;
}

/**
 * Checkbox Card Label — accessible label tied to the card control.
 */
export const Label = withContext(dreamy.label, "label");

export interface CheckboxCardCheckboxProps extends HTMLDreamyProps<"div"> {
    className?: string;
}

/**
 * Checkbox Card Checkbox — decorative checkbox indicator for the card.
 */
export function Checkbox(props: CheckboxCardCheckboxProps) {
    const { active, icon, reduceMotion, animationTime, pathProps } =
        useContext(CheckboxCardVisualContext);

    const renderIcon = useCallback(
        (state: { checked: boolean; indeterminate: boolean }) => {
            const iconProps = {
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
        [active, animationTime, icon, pathProps, reduceMotion]
    );

    return (
        <StyledCheckbox {...props}>
            <UiSdkCheckboxIndicator
                aria-hidden="true"
                data-part="control"
                keepMounted
            >
                {renderIcon}
            </UiSdkCheckboxIndicator>
        </StyledCheckbox>
    );
}
