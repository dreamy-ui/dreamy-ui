"use client";

import { ButtonIcon } from "@/components/button/button-icon";
import { ButtonSpinner, type ButtonSpinnerOptions } from "@/components/button/button-spinner";
import { dreamy } from "@/components/factory";
import { Ripple } from "@/components/ripple/ripple";
import { useRipple } from "@/components/ripple/use-ripple";
import { dataAttr } from "@/utils/attr";
import { nextTick } from "@/utils/ticks";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef, useCallback, useMemo } from "react";
import { type ButtonVariantProps, button } from "styled-system/recipes";

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

export interface ButtonProps extends HTMLDreamProps<"button">, ButtonVariantProps, Props {}

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
            spinnerPlacement = "start",
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

                {isLoading && spinnerPlacement === "start" && (
                    <ButtonSpinner
                        loadingText={loadingText}
                        spinnerPlacement={"start"}
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
