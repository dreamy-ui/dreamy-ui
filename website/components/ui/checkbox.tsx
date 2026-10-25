"use client";

import {
    Checkbox as ArkCheckbox,
    useCheckboxContext as useArkCheckboxContext,
    type CheckboxRootProps as ArkCheckboxRootProps
} from "@ark-ui/react/checkbox";
import {
    CheckboxGroupProvider,
    TRANSITION_EASINGS,
    type UseCheckboxGroupProps,
    type UseCheckboxReturn,
    useCheckboxGroup,
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
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { cx } from "styled-system/css";
import { dreamy } from "styled-system/jsx";
import { type CheckboxVariantProps, checkbox } from "styled-system/recipes";
import { Flex, type FlexProps } from "./flex";
import { mapCheckboxRootProps } from "./map-checkbox-props";

const StyledCheckbox = dreamy(ArkCheckbox.Root, checkbox);

export interface CheckboxProps
    extends Omit<
            ArkCheckboxRootProps,
            | "checked"
            | "defaultChecked"
            | "disabled"
            | "invalid"
            | "readOnly"
            | "required"
            | "onCheckedChange"
        >,
        CheckboxVariantProps {
    isChecked?: boolean;
    defaultChecked?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isIndeterminate?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onChangeValue?: (value: boolean) => void;
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
    const {
        children,
        icon = <CheckboxIcon />,
        isChecked: isCheckedProp,
        defaultChecked,
        isIndeterminate,
        reduceMotion = reduceMotionGlobal ?? false,
        animationTime,
        pathProps,
        className,
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        ...rest
    } = props;

    const field = useFieldProps(props);
    const inputRef = useRef<HTMLInputElement>(null);
    const isInteractionDisabled = field.isDisabled || field.isReadOnly;
    const isControlled = isCheckedProp !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(!!defaultChecked);
    const [isActive, setIsActive] = useState(false);
    const active = isActive && !isInteractionDisabled;
    const isChecked = isControlled ? isCheckedProp : uncontrolledChecked;
    const showCheckedData = isChecked || isIndeterminate;

    const arkProps = mapCheckboxRootProps({
        isChecked: isCheckedProp,
        isIndeterminate,
        ...props,
        onChangeValue: props.onChangeValue,
        onChange: props.onChange
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = Boolean(isIndeterminate);
        }
    }, [isIndeterminate, isChecked]);

    const handleCheckedChange = arkProps.onCheckedChange;

    return (
        <StyledCheckbox
            {...arkProps}
            {...rest}
            className={cx("group", className)}
            data-checked={showCheckedData ? "" : undefined}
            data-disabled={field.isDisabled ? "" : undefined}
            data-indeterminate={isIndeterminate ? "" : undefined}
            data-invalid={field.isInvalid ? "" : undefined}
            data-readonly={field.isReadOnly ? "" : undefined}
            onCheckedChange={(details) => {
                if (!isControlled) {
                    setUncontrolledChecked(details.checked === true);
                }
                handleCheckedChange?.(details);
            }}
            onPointerDown={(event: PointerEvent<HTMLLabelElement>) => {
                onPointerDown?.(event);
                if (!isInteractionDisabled) {
                    setIsActive(true);
                }
            }}
            onPointerLeave={(event: PointerEvent<HTMLLabelElement>) => {
                onPointerLeave?.(event);
                setIsActive(false);
            }}
            onPointerUp={(event: PointerEvent<HTMLLabelElement>) => {
                onPointerUp?.(event);
                setIsActive(false);
            }}
        >
            <ArkCheckbox.HiddenInput
                aria-describedby={field["aria-describedby"]}
                aria-invalid={field.isInvalid ? true : undefined}
                id={field.id}
                ref={inputRef}
                required={field.isRequired}
            />
            <ArkCheckbox.Control
                aria-hidden="true"
                data-part="control"
            >
                <CheckboxIndicator
                    active={active}
                    animationTime={animationTime}
                    icon={icon}
                    pathProps={pathProps}
                    reduceMotion={reduceMotion}
                />
            </ArkCheckbox.Control>
            {children ? <ArkCheckbox.Label data-part="label">{children}</ArkCheckbox.Label> : null}
        </StyledCheckbox>
    );
}

interface CheckboxIndicatorProps {
    icon: CheckboxProps["icon"];
    active?: boolean;
    reduceMotion?: boolean;
    animationTime?: number;
    pathProps?: SVGMotionProps<SVGPathElement>;
}

function CheckboxIndicator(props: CheckboxIndicatorProps) {
    const { icon, active, reduceMotion, animationTime, pathProps } = props;
    const api = useArkCheckboxContext();
    const iconProps = useMemo(
        () => ({
            isChecked: api.checked === true,
            isIndeterminate: api.indeterminate,
            active,
            reduceMotion,
            animationTime,
            pathProps,
            "data-part": "icon"
        }),
        [api.checked, api.indeterminate, active, reduceMotion, animationTime, pathProps]
    );

    const content =
        typeof icon === "function" ? icon(iconProps) : cloneElement(icon as ReactElement, iconProps);

    return (
        <ArkCheckbox.Indicator
            aria-hidden="true"
            data-part="icon"
            hidden={false}
        >
            {content}
        </ArkCheckbox.Indicator>
    );
}

export interface IconCustomProps {
    animationTime?: number;
    pathProps?: SVGMotionProps<SVGPathElement>;
}

interface CheckboxIconProps
    extends Partial<ReturnType<UseCheckboxReturn["getIconProps"]> & IconCustomProps> {
    active?: boolean;
}

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
    extends UseCheckboxGroupProps,
        CheckboxVariantProps,
        Omit<FlexProps, "defaultValue" | "onChange"> {}

export function CheckboxGroup(props: CheckboxGroupProps) {
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
        defaultValue,
        value: valueProp,
        ...rest
    } = props;

    const group = useCheckboxGroup({
        onChange: onChangeProp,
        defaultValue,
        value: valueProp,
        isDisabled,
        isRequired,
        isReadOnly,
        isInvalid,
        reduceMotion,
        ...props
    });

    const providerValue = useMemo(
        () => ({
            variants: { size, scheme, variant },
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

    const handleValueChange = useCallback(
        (details: { value: string[] }) => {
            group.setValue(details.value);
        },
        [group]
    );

    return (
        <CheckboxGroupProvider value={providerValue}>
            <ArkCheckbox.Group
                disabled={isDisabled}
                invalid={isInvalid}
                onValueChange={handleValueChange}
                readOnly={isReadOnly}
                value={group.value.map(String)}
            >
                <Flex
                    {...rest}
                    className={cx("dreamy-checkbox-group", rest.className)}
                >
                    {children}
                </Flex>
            </ArkCheckbox.Group>
        </CheckboxGroupProvider>
    );
}
