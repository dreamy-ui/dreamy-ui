"use client";

import { Button as UiSdkButton, type ButtonActionDetails } from "@ui-sdk/react/button";
import {
    type ButtonSuccessIconPart,
    dataAttr,
    defaultMotionVariants,
    isMobile,
    nextTick,
    useMotionVariants,
    useReducedMotion,
    useRipple
} from "@dreamy-ui/react";
import { m } from "motion/react";
import {
    cloneElement,
    isValidElement,
    useCallback,
    useMemo,
    type ComponentProps,
    type ReactElement
} from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ButtonVariantProps, button } from "styled-system/recipes";
import { Ripple } from "../ripple";
import { Span } from "../span";
import { Spinner } from "../spinner";

const StyledButton = dreamy(UiSdkButton, button);

export interface UniversalButtonProps extends ButtonSpinnerOptions {
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
    /**
     * Transforms the button into a success state with a success background and an animated check icon.
     * `isLoading` takes precedence when both are set.
     */
    isSuccess?: boolean;
    /**
     * The icon to be displayed instead of the default animated check icon in the success state
     */
    successIcon?: React.ReactNode;
}

export interface ButtonProps
    extends Omit<HTMLDreamyProps<"button">, "onClick" | "type">,
        ButtonVariantProps,
        UniversalButtonProps {
    /**
     * Runs when the button is pressed. Return a Promise and the button stays
     * pending — `aria-busy`, `aria-disabled` and `data-pending` — until it
     * settles, and ignores further presses meanwhile.
     */
    onClick?: (event: React.MouseEvent<HTMLElement>, details: ButtonActionDetails) => unknown;
    /**
     * What a native button does in a form: `"submit"` submits it and `"reset"`
     * resets it.
     * @defaultValue "button"
     */
    type?: "button" | "submit" | "reset";
    /**
     * Keeps a disabled button in the tab order with `aria-disabled` instead of
     * the native attribute, so it can host a tooltip that says why.
     */
    focusableWhenDisabled?: boolean;
    /**
     * What screen readers hear once an async press has been pending for a
     * second.
     */
    pendingAnnouncement?: string;
    /**
     * Renders the button as another element, like a link.
     */
    render?: ComponentProps<typeof UiSdkButton>["render"];
    debug?: boolean;
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
    /**
     * The text to be displayed next to the check icon in the success state
     */
    successText?: React.ReactNode;
}

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
    isSuccess,
    successText,
    successIcon,
    rightIcon,
    leftIcon,
    children,
    disableRipple,
    spinner,
    spinnerPlacement,
    disabled,
    focusableWhenDisabled,
    pendingAnnouncement,
    render,
    debug,
    type,
    onClick,
    onPointerDown: onPointerDownProp,
    scheme,
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

    const isDisabled = disabled || isLoading;

    const showSuccess = !!isSuccess && !isLoading;
    const isContentHidden = isLoading || showSuccess;
    const statusText = isLoading ? loadingText : showSuccess ? successText : undefined;

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLElement>, details: ButtonActionDetails) => {
            const result = onClick?.(event, details);
            if (disableRipple || isDisabled || isDisabledRipple || isLoading) return result;

            if (isMobile()) {
                onPointerDownRipple(
                    event as unknown as React.PointerEvent<HTMLButtonElement>
                );
                nextTick(() => {
                    nextTick(() => {
                        onRippleClickHandler(
                            event as unknown as React.MouseEvent<HTMLButtonElement>
                        );
                    });
                });
            } else {
                onRippleClickHandler(
                    event as unknown as React.MouseEvent<HTMLButtonElement>
                );
            }
            return result;
        },
        [
            disableRipple,
            isDisabled,
            onClick,
            onRippleClickHandler,
            isDisabledRipple,
            onPointerDownRipple,
            isLoading
        ]
    );

    const onPointerDown = useCallback(
        (event: React.PointerEvent<HTMLButtonElement>) => {
            (onPointerDownProp as React.PointerEventHandler<HTMLButtonElement> | undefined)?.(
                event
            );
            if (
                disableRipple ||
                isDisabled ||
                isDisabledRipple ||
                isMobile() ||
                isLoading
            )
                return;
            onPointerDownRipple(event);
        },
        [
            disableRipple,
            isDisabled,
            onPointerDownRipple,
            isDisabledRipple,
            onPointerDownProp,
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
            data-disabled={dataAttr(disabled === true)}
            data-loading={dataAttr(isLoading)}
            data-success={dataAttr(showSuccess)}
            debug={debug}
            disabled={isDisabled}
            focusableWhenDisabled={focusableWhenDisabled}
            pendingAnnouncement={pendingAnnouncement}
            render={render}
            {...rest}
            // Scheme compound styles would override the success colors
            scheme={showSuccess ? undefined : scheme}
            onClick={handleClick}
            onPointerDown={onPointerDown}
            type={type ?? "button"}
        >
            {leftIcon &&
                !statusText &&
                (isContentHidden ? <span style={{ opacity: 0 }}>{LeftIcon}</span> : LeftIcon)}

            {isLoading && spinnerPlacement !== "end" && (
                <ButtonSpinner
                    loadingText={loadingText}
                    spinnerPlacement={spinnerPlacement}
                >
                    {spinner}
                </ButtonSpinner>
            )}

            {showSuccess && (
                <ButtonIcon
                    data-has-success-text={dataAttr(!!successText)}
                    data-success-icon=""
                >
                    {successIcon ?? <ButtonSuccessCheckIcon />}
                </ButtonIcon>
            )}

            {isContentHidden
                ? statusText || <span style={{ opacity: 0 }}>{children as React.ReactNode}</span>
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
                !statusText &&
                (isContentHidden ? <span style={{ opacity: 0 }}>{RightIcon}</span> : RightIcon)}

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

function ButtonSuccessCheckIcon() {
    const motionVariants = useMotionVariants();
    const reduceMotion = useReducedMotion();
    const variants = motionVariants.buttonSuccessIcon ?? defaultMotionVariants.buttonSuccessIcon;

    return (
        <m.svg
            animate="animate"
            aria-hidden
            custom={"root" satisfies ButtonSuccessIconPart}
            data-success-check=""
            fill="none"
            focusable={false}
            initial={reduceMotion ? false : "initial"}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.25}
            variants={variants}
            viewBox="0 0 24 24"
        >
            <m.path
                custom={"circle" satisfies ButtonSuccessIconPart}
                d="M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20"
                variants={variants}
            />
            <m.path
                custom={"check" satisfies ButtonSuccessIconPart}
                d="m7.75 12.25 2.75 2.75 5.75-6"
                variants={variants}
            />
        </m.svg>
    );
}
