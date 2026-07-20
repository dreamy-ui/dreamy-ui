"use client";

import { dataAttr, isMobile, nextTick, useRipple } from "@dreamy-ui/react";
import { cloneElement, isValidElement, useCallback, useMemo, type ReactElement } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ButtonVariantProps, button } from "styled-system/recipes";
import { Ripple } from "./ripple";
import { Span } from "./span";
import { Spinner } from "./spinner";

export interface UniversalButtonProps extends ButtonSpinnerOptions {
    /**
     * Disables the whole button
     */
    isDisabled?: boolean;
    /**
     * Transforms the button into a loading state and disables the button
     */
    isLoading?: boolean;
    /**
     * Disables the ripple effect
     */
    disableRipple?: boolean;
    /**
     * The spinner to be displayed instead of the default spinner
     */
    spinner?: React.ReactNode;
}

export interface ButtonProps
    extends HTMLDreamyProps<"button">,
        ButtonVariantProps,
        UniversalButtonProps {
    /**
     * The icon to be displayed on the right side of the button
     */
    rightIcon?: React.ReactNode;
    /**
     * The icon to be displayed on the left side of the button
     */
    leftIcon?: React.ReactNode;
    /**
     * The loading text to be displayed
     */
    loadingText?: React.ReactNode;
}

const StyledButton = dreamy("button", button);

/**
 * Button component — triggers an action or event.
 *
 * @see Docs https://dreamy-ui.com/docs/components/button
 *
 * @example
 * ```tsx
 * <Button>Save</Button>
 * ```
 */
export function Button({
    isLoading,
    loadingText,
    isDisabled,
    rightIcon,
    leftIcon,
    children,
    disableRipple,
    spinner,
    spinnerPlacement,
    disabled,
    ...rest
}: ButtonProps) {
    const {
        onClick: onRippleClickHandler,
        onClear: onClearRipple,
        ripples,
        currentRipple,
        onPointerDown: onPointerDownRipple,
        isDisabled: isDisabledRipple
    } = useRipple();

    isDisabled = isDisabled || disabled;

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            rest.onClick?.(e);
            if (disableRipple || isDisabled || isDisabledRipple) return;

            if (isLoading) return;
            if (isMobile()) {
                onPointerDownRipple(e);
                nextTick(() => {
                    nextTick(() => {
                        onRippleClickHandler(e);
                    });
                });
            } else {
                onRippleClickHandler(e);
            }
        },
        [
            disableRipple,
            isDisabled,
            onRippleClickHandler,
            isDisabledRipple,
            rest.onClick,
            onPointerDownRipple,
            isLoading
        ]
    );

    const onPointerDown = useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
            rest.onPointerDown?.(e);
            if (disableRipple || isDisabled || isDisabledRipple || isMobile() || isLoading) return;
            onPointerDownRipple(e);
        },
        [
            disableRipple,
            isDisabled,
            onPointerDownRipple,
            isDisabledRipple,
            rest.onPointerDown,
            isLoading
        ]
    );

    const LeftIcon = useMemo(
        () => (leftIcon ? <ButtonIcon data-part="icon-left">{leftIcon}</ButtonIcon> : null),
        [leftIcon]
    );
    const RightIcon = useMemo(
        () => (rightIcon ? <ButtonIcon data-part="icon-right">{rightIcon}</ButtonIcon> : null),
        [rightIcon]
    );

    return (
        <StyledButton
            data-disabled={dataAttr(isDisabled)}
            data-loading={dataAttr(isLoading)}
            disabled={isDisabled || isLoading}
            {...rest}
            onClick={handleClick}
            onPointerDown={onPointerDown}
            type={rest.type || "button"}
        >
            {leftIcon &&
                !loadingText &&
                (isLoading ? <span style={{ opacity: 0 }}>{LeftIcon}</span> : LeftIcon)}

            {isLoading && spinnerPlacement !== "end" && (
                <ButtonSpinner
                    loadingText={loadingText}
                    spinnerPlacement={spinnerPlacement}
                >
                    {spinner}
                </ButtonSpinner>
            )}

            {isLoading ? loadingText || <span style={{ opacity: 0 }}>{children}</span> : children}

            {isLoading && spinnerPlacement === "end" && (
                <ButtonSpinner
                    loadingText={loadingText}
                    spinnerPlacement={"end"}
                >
                    {spinner}
                </ButtonSpinner>
            )}
            {rightIcon &&
                !loadingText &&
                (isLoading ? <span style={{ opacity: 0 }}>{RightIcon}</span> : RightIcon)}

            {!disableRipple && (
                <div data-part="ripple-container">
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative"
                        }}
                    >
                        <Ripple
                            currentRipple={currentRipple}
                            onClear={onClearRipple}
                            ripples={ripples}
                        />
                    </div>
                </div>
            )}
        </StyledButton>
    );
}

interface ButtonSpinnerOptions {
    loadingText?: React.ReactNode;
    spinnerPlacement?: "start" | "end";
}

interface ButtonSpinnerProps extends HTMLDreamyProps<"div">, ButtonSpinnerOptions {}

function ButtonSpinner(props: ButtonSpinnerProps) {
    const {
        loadingText,
        spinnerPlacement,
        children = (
            <Spinner
                color="currentColor"
                size={"sm"}
            />
        ),
        ...rest
    } = props;

    return (
        <Span
            {...rest}
            data-has-loading-text={dataAttr(!!loadingText)}
            data-part={
                spinnerPlacement === "start"
                    ? "icon-left"
                    : spinnerPlacement === "end"
                      ? "icon-right"
                      : undefined
            }
            data-spinner=""
        >
            {children}
        </Span>
    );
}

interface ButtonIconProps extends HTMLDreamyProps<"span"> {}

function ButtonIcon(props: ButtonIconProps) {
    const { children, className, ...rest } = props;

    const _children = isValidElement(children)
        ? cloneElement(
              children as ReactElement<{
                  "aria-hidden"?: boolean;
                  focusable?: boolean;
              }>,
              {
                  "aria-hidden": true,
                  focusable: false
              }
          )
        : children;

    return <Span {...rest}>{_children}</Span>;
}
