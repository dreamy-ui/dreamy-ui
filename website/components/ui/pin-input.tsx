"use client";

import { type DreamyHostProps, dataAttr, useFieldProps } from "@dreamy-ui/react";
import {
    OTPInput as UiSdkOTPInput,
    OTPInputGroup as UiSdkOTPInputGroup,
    type OTPInputOptions,
    OTPInputSeparator as UiSdkOTPInputSeparator,
    OTPInputSlot as UiSdkOTPInputSlot,
    createOTPInputController
} from "@ui-sdk/react/otp-input";
import type React from "react";
import {
    type CSSProperties,
    Children,
    type ReactElement,
    type ReactNode,
    cloneElement,
    createContext,
    isValidElement,
    useContext,
    useMemo
} from "react";
import { css, cx } from "styled-system/css";
import { type HTMLDreamyProps, splitCssProps } from "styled-system/jsx";
import { type InputVariantProps, input } from "styled-system/recipes";

export { createOTPInputController };

interface PinInputUiContextValue {
    size?: InputVariantProps["size"];
    variant?: InputVariantProps["variant"];
    mask: boolean;
    invalid: boolean;
}

const PinInputUiContext = createContext<PinInputUiContextValue>({
    size: "md",
    variant: "outline",
    mask: false,
    invalid: false
});

function assignFieldIndices(
    nodes: ReactNode,
    counter: { current: number }
): ReactNode {
    return Children.map(nodes, (child) => {
        if (!isValidElement(child)) return child;

        if (child.type === Field) {
            const props = child.props as PinInputFieldProps;
            const index = props.index ?? counter.current;
            counter.current = Math.max(counter.current + 1, index + 1);
            return cloneElement(child as ReactElement<PinInputFieldProps>, { index });
        }

        const props = child.props as { children?: ReactNode };
        if (props.children !== undefined) {
            return cloneElement(child as ReactElement<{ children?: ReactNode }>, {
                children: assignFieldIndices(props.children, counter)
            });
        }

        return child;
    });
}

export interface PinInputProps
    extends OTPInputOptions,
        Pick<InputVariantProps, "size" | "variant">,
        DreamyHostProps<HTMLDreamyProps<"div">, OTPInputOptions, "onChange" | "onSelect" | "size" | "mask"> {
    /**
     * Visually mask entered characters in each slot (renders `•`).
     */
    mask?: boolean;
    /**
     * Marks the pin input and its slots invalid.
     */
    invalid?: boolean;
    /**
     * Focus the input automatically on mount.
     */
    autoFocus?: boolean;
    /**
     * The children of the pin input component (typically `PinInput.Field` elements).
     */
    children?: ReactNode;
}

/**
 * Pin Input component — segmented input for one-time codes powered by UI SDK `OTPInput`.
 *
 * @see Docs https://dreamy-ui.com/docs/components/pin-input
 */
export function Root(props: PinInputProps) {
    const {
        value,
        defaultValue,
        onValueChange,
        onValueCommit,
        maxLength: maxLengthProp,
        pattern,
        inputMode,
        textAlign,
        autoComplete,
        disabled,
        readOnly,
        required,
        invalid,
        mask = false,
        name,
        form,
        controller,
        debug,
        id,
        autoFocus,
        size = "md",
        variant = "outline",
        className,
        style,
        children,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedByProp,
        ...rest
    } = props;

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        isReadOnly: isReadOnlyField = false,
        id: fieldId,
        "aria-describedby": fieldDescribedBy
    } = useFieldProps({
        isDisabled: disabled,
        isRequired: required,
        isInvalid: invalid,
        isReadOnly: readOnly,
        id
    });

    const resolvedDisabled = disabled ?? isDisabledField;
    const resolvedRequired = required ?? isRequiredField;
    const resolvedInvalid = invalid ?? isInvalidField;
    const resolvedReadOnly = readOnly ?? isReadOnlyField;

    const [cssProps, domProps] = splitCssProps(rest);

    const { indexedChildren, fieldCount } = useMemo(() => {
        const counter = { current: 0 };
        const mapped = assignFieldIndices(children, counter);
        return { indexedChildren: mapped, fieldCount: counter.current };
    }, [children]);

    const resolvedMaxLength = maxLengthProp ?? (fieldCount > 0 ? fieldCount : 6);

    const uiValue = useMemo<PinInputUiContextValue>(
        () => ({ size, variant, mask, invalid: resolvedInvalid }),
        [mask, resolvedInvalid, size, variant]
    );

    return (
        <PinInputUiContext.Provider value={uiValue}>
            <UiSdkOTPInput
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkOTPInput>)}
                aria-describedby={ariaDescribedByProp ?? fieldDescribedBy}
                aria-invalid={resolvedInvalid || undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                className={cx(className as string | undefined, css(cssProps))}
                controller={controller}
                data-invalid={dataAttr(resolvedInvalid)}
                data-pin-input=""
                debug={debug}
                defaultValue={defaultValue}
                disabled={resolvedDisabled}
                form={form}
                id={fieldId}
                inputMode={inputMode}
                maxLength={resolvedMaxLength}
                name={name}
                onValueChange={onValueChange}
                onValueCommit={onValueCommit}
                pattern={pattern}
                readOnly={resolvedReadOnly}
                required={resolvedRequired}
                style={style as CSSProperties | undefined}
                textAlign={textAlign}
                value={value}
            >
                {indexedChildren}
            </UiSdkOTPInput>
        </PinInputUiContext.Provider>
    );
}

export interface PinInputGroupProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    children?: ReactNode;
}

/**
 * Pin Input Group — groups a contiguous run of `PinInput.Field` slots.
 */
export function Group(props: PinInputGroupProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkOTPInputGroup
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkOTPInputGroup>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkOTPInputGroup>
    );
}

export interface PinInputSeparatorProps extends Omit<HTMLDreamyProps<"div">, "children"> {
    children?: ReactNode;
}

/**
 * Pin Input Separator — visual divider between groups of slots.
 */
export function Separator(props: PinInputSeparatorProps) {
    const { className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkOTPInputSeparator
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkOTPInputSeparator>)}
            className={cx(className as string | undefined, css(cssProps))}
            style={style as CSSProperties | undefined}
        >
            {children ?? "–"}
        </UiSdkOTPInputSeparator>
    );
}

export interface PinInputFieldProps
    extends Pick<InputVariantProps, "size" | "variant">,
        Omit<HTMLDreamyProps<"div">, "children" | "size"> {
    /**
     * Zero-based slot index. Assigned automatically in render order when omitted.
     */
    index?: number;
}

/**
 * Pin Input Field — a single character slot within the pin input.
 */
export function Field(props: PinInputFieldProps) {
    const ui = useContext(PinInputUiContext);
    const { index = 0, size, variant, className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);
    const recipeClass = input({
        size: size ?? ui.size,
        variant: variant ?? ui.variant,
        inputType: "pin"
    });

    return (
        <UiSdkOTPInputSlot
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkOTPInputSlot>)}
            className={cx(recipeClass, className as string | undefined, css(cssProps))}
            data-invalid={dataAttr(ui.invalid)}
            index={index}
            style={style as CSSProperties | undefined}
        >
            {ui.mask ? (state) => (state.char ? "•" : null) : undefined}
        </UiSdkOTPInputSlot>
    );
}
