"use client";

import { ButtonIcon } from "@/components/button/button-icon";
import { ButtonSpinner, type ButtonSpinnerOptions } from "@/components/button/button-spinner";
import { dream } from "@/components/factory";
import { Ripple } from "@/components/ripple/ripple";
import { useRipple } from "@/components/ripple/use-ripple";
import { nextTick } from "@/utils/ticks";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type ButtonVariantProps, button } from "@dreamy-ui/system/recipes";
import { forwardRef, useCallback } from "react";

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

const StyledButton = styled(dream.button, button);

/**
 * Button component
 *
 * @See Docs https://dream-ui.com/docs/components/button
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

        const isMobile = useCallback(() => {
            const result = navigator.userAgent.match(
                /(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i
            );

            return result !== null;
        }, []);

        const handleClick = useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                rest.onClick?.(e);
                if (disableRipple || isDisabled || isDisabledRipple) return;

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
                isMobile
            ]
        );

        const onPointerDown = useCallback(
            (e: React.PointerEvent<HTMLButtonElement>) => {
                rest.onPointerDown?.(e);
                if (disableRipple || isDisabled || isDisabledRipple || isMobile()) return;
                onPointerDownRipple(e);
            },
            [
                disableRipple,
                isDisabled,
                onPointerDownRipple,
                isDisabledRipple,
                rest.onPointerDown,
                isMobile
            ]
        );

        return (
            <StyledButton
                ref={ref}
                data-loading={isLoading}
                data-disabled={isDisabled}
                disabled={isDisabled || isLoading}
                {...rest}
                onClick={handleClick}
                onPointerDown={onPointerDown}
            >
                {leftIcon && !isLoading && (
                    <ButtonIcon data-part="icon-left">{leftIcon}</ButtonIcon>
                )}

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
                {rightIcon && !isLoading && (
                    <ButtonIcon data-part="icon-right">{rightIcon}</ButtonIcon>
                )}

                {!disableRipple && !isDisabled && !isLoading && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: "hidden",
                            pointerEvents: "none",
                            borderRadius: "inherit"
                        }}
                        data-part="ripple-container"
                    >
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
