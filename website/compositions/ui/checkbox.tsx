"use client";

import {
    TRANSITION_EASINGS,
    type UseCheckboxGroupProps,
    type UseCheckboxGroupReturn,
    type UseCheckboxProps,
    type UseCheckboxReturn,
    createContext,
    useCheckbox,
    useCheckboxGroup,
    useMotionVariants
} from "@dreamy-ui/react";
import { type SVGMotionProps, m } from "motion/react";
import { type ReactElement, cloneElement, forwardRef, useMemo } from "react";
import { cx } from "styled-system/css";
import { type CheckboxVariantProps, checkbox } from "styled-system/recipes";
import { dreamy } from "./factory";
import { Flex, type FlexProps } from "./flex";
import { VisuallyHiddenInput } from "./visually-hidden";

export interface CheckboxProps extends UseCheckboxProps, CheckboxVariantProps {}

const StyledCheckbox = dreamy("div", checkbox);

/**
 * Checkbox component
 *
 * @See Docs https://dreamy-ui.com/docs/components/checkbox
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const {
        children,
        icon = <CheckboxIcon />,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getIconProps,
        getLabelProps
    } = useCheckbox({ ...props, ref });

    const clonedIcon = useMemo(() => {
        return typeof icon === "function"
            ? icon(getIconProps() as any)
            : cloneElement(icon as ReactElement, getIconProps());
    }, [getIconProps, icon]);

    return (
        <StyledCheckbox {...(getRootProps() as any)}>
            <VisuallyHiddenInput {...(getInputProps() as any)} />
            <span {...getWrapperProps()}>{clonedIcon}</span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledCheckbox>
    );
});

export interface IconCustomProps {
    /**
     * Animation time in milliseconds.
     * @default 200
     */
    animationTime?: number;
    /**
     * Props to pass to the animated path
     */
    pathProps?: SVGMotionProps<SVGPathElement>;
}

type CheckboxIconProps = Partial<ReturnType<UseCheckboxReturn["getIconProps"]> & IconCustomProps>;

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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...otherProps}
        >
            <m.path
                d="M20 6 9 17l-5-5"
                initial={false}
                animate={"animate"}
                custom={{ isChecked, active, animationTime }}
                variants={variants.checkboxCheckIcon.default}
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
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            {...otherProps}
        >
            <m.line
                x1="21"
                x2="3"
                y1="12"
                y2="12"
                initial={{
                    pathOffset: 1,
                    pathLength: 1
                }}
                animate={{ pathOffset: 0, pathLength: 1 }}
                exit={{
                    pathOffset: 1,
                    pathLength: 1
                }}
                transition={{
                    duration: !reduceMotion ? animationTime / 1000 : 0,
                    ease: TRANSITION_EASINGS.easeInOut
                }}
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

export interface CheckboxGroupContext
    extends Pick<
            UseCheckboxGroupReturn,
            "onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
        >,
        CheckboxVariantProps {
    reduceMotion?: boolean;
}

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<CheckboxGroupContext>(
    {
        name: "CheckboxGroupContext",
        strict: false
    }
);

export interface CheckboxGroupProps
    extends UseCheckboxGroupProps,
        CheckboxVariantProps,
        Omit<FlexProps, "defaultValue" | "onChange"> {}

/**
 * CheckboxGroup component. Useful for grouping multiple checkboxes together.
 *
 * @See Docs https://dreamy-ui.com/docs/components/checkbox
 */
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
        ...rest
    } = props;
    const { value, onChange } = useCheckboxGroup({
        onChange: onChangeProp,
        defaultValue,
        ...props
    });

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
        <CheckboxGroupProvider value={group}>
            <Flex
                {...rest}
                className={cx("dreamy-checkbox-group", rest.className)}
            >
                {children}
            </Flex>
        </CheckboxGroupProvider>
    );
}
