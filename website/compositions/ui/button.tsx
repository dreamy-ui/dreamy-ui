"use client";

import { dataAttr, nextTick, useRipple } from "@dreamy-ui/react";
import { dreamy } from "@dreamy-ui/react/rsc";
import { cloneElement, forwardRef, isValidElement, useCallback, useMemo } from "react";
import { css, cx } from "styled-system/css";
import { type ButtonVariantProps, button } from "styled-system/recipes";
import { Box } from "./box";
import type { HTMLDreamyProps } from "./factory";
import { Ripple } from "./ripple";
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

interface Props extends UniversalButtonProps {
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

export interface ButtonProps extends HTMLDreamyProps<"button">, ButtonVariantProps, Props {}

const StyledButton = dreamy("button", button);

/**
 * Button component
 *
 * @See Docs https://dreamy-ui.com/docs/components/button
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            isLoading,
            loadingText,
            isDisabled,
            rightIcon,
            leftIcon,
            children,
            disableRipple,
            spinner,
            spinnerPlacement,
            ...rest
        },
        ref
    ) => {
        const {
            onClick: onRippleClickHandler,
            onClear: onClearRipple,
            ripples,
            currentRipple,
            onPointerDown: onPointerDownRipple,
            isDisabled: isDisabledRipple
        } = useRipple();

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
                if (disableRipple || isDisabled || isDisabledRipple || isMobile() || isLoading)
                    return;
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
                ref={ref}
                data-loading={dataAttr(isLoading)}
                data-disabled={dataAttr(isDisabled)}
                disabled={isDisabled || isLoading}
                {...rest}
                type={rest.type || "button"}
                onClick={handleClick}
                onPointerDown={onPointerDown}
            >
                {leftIcon &&
                    (isLoading ? <span style={{ opacity: 0 }}>{LeftIcon}</span> : LeftIcon)}

                {isLoading && spinnerPlacement !== "end" && (
                    <ButtonSpinner
                        loadingText={loadingText}
                        spinnerPlacement={spinnerPlacement}
                    >
                        {spinner}
                    </ButtonSpinner>
                )}

                {isLoading
                    ? loadingText || <span style={{ opacity: 0 }}>{children}</span>
                    : children}

                {isLoading && spinnerPlacement === "end" && (
                    <ButtonSpinner
                        loadingText={loadingText}
                        spinnerPlacement={"end"}
                    >
                        {spinner}
                    </ButtonSpinner>
                )}
                {rightIcon &&
                    (isLoading ? <span style={{ opacity: 0 }}>{RightIcon}</span> : RightIcon)}

                {!disableRipple && !isDisabled && (
                    <div data-part="ripple-container">
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "relative"
                            }}
                        >
                            <Ripple
                                onClear={onClearRipple}
                                currentRipple={currentRipple}
                                ripples={ripples}
                            />
                        </div>
                    </div>
                )}
            </StyledButton>
        );
    }
);

function isMobile() {
    const result = navigator.userAgent.match(
        /(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i
    );

    return result !== null;
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
        <Box
            {...rest}
            data-part={
                spinnerPlacement === "start"
                    ? "icon-left"
                    : spinnerPlacement === "end"
                      ? "icon-right"
                      : undefined
            }
            className={cx(
                css({
                    display: "flex",
                    alignItems: "center",
                    position: loadingText ? "relative" : "absolute",
                    lineHeight: "normal"
                }),
                rest.className
            )}
        >
            {children}
        </Box>
    );
}

ButtonSpinner.displayName = "ButtonSpinner";

interface ButtonIconProps extends HTMLDreamyProps<"span"> {}

function ButtonIcon(props: ButtonIconProps) {
    const { children, className, ...rest } = props;

    const _children = isValidElement(children)
        ? cloneElement<any>(children, {
              "aria-hidden": true,
              focusable: false
          })
        : children;

    return (
        <Box
            as={"span"}
            {...rest}
        >
            {_children}
        </Box>
    );
}

ButtonIcon.displayName = "ButtonIcon";
