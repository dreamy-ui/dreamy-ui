"use client";

import {
    type IToast,
    type Status,
    TRANSITION_EASINGS,
    type ToastWithoutRender,
    dataAttr,
    mergeMotionRefs,
    useReducedMotion
} from "@dreamy-ui/react";
import {
    Toast as UiSdkToast,
    ToastAction as UiSdkToastAction,
    ToastClose as UiSdkToastClose,
    ToastDescription as UiSdkToastDescription,
    ToastRegion as UiSdkToastRegion,
    ToastTitle as UiSdkToastTitle,
    createToaster,
    toast as uiSdkToast
} from "@ui-sdk/react/toast";
import * as m from "motion/react-m";
import type React from "react";
import { cx } from "styled-system/css";
import { toast as toastRecipe } from "styled-system/recipes";
import { StatusIcon } from "./alert";
import { CloseButton } from "./close-button";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

export {
    UiSdkToastAction as ToastAction,
    UiSdkToastClose as ToastClose,
    UiSdkToastDescription as ToastDescription,
    UiSdkToastRegion as ToastRegion,
    UiSdkToastTitle as ToastTitle,
    createToaster,
    uiSdkToast
};

export interface ToastProps {
    toast: IToast;
    leaving?: boolean;
    reduceMotion?: boolean;
    registerElement?: (id: string, el: HTMLElement | null) => void;
    onExitAnimationComplete?: (id: string) => void;
}

/**
 * Toast component — notification rendered inside a UI SDK `ToastRegion`.
 *
 * @see Docs https://dreamy-ui.com/docs/components/toast
 */
export function Toast({
    toast,
    leaving = false,
    reduceMotion: reduceMotionProp,
    registerElement,
    onExitAnimationComplete
}: ToastProps) {
    const globalReduceMotion = useReducedMotion();
    const reduceMotion = reduceMotionProp ?? globalReduceMotion ?? false;

    const motionRender = (partProps: React.ComponentProps<"li">) => {
        const { ref: partRef, style: partStyle, children: partChildren, ...restPartProps } =
            partProps as React.ComponentPropsWithRef<"li">;

        return (
            <m.li
                {...(restPartProps as Record<string, unknown>)}
                animate={leaving ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                layout={reduceMotion ? false : "position"}
                onAnimationComplete={() => {
                    if (leaving) {
                        onExitAnimationComplete?.(toast.id);
                    }
                }}
                ref={mergeMotionRefs(partRef, (el) => {
                    registerElement?.(toast.id, el as HTMLElement | null);
                })}
                style={partStyle}
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.3, ease: TRANSITION_EASINGS.easeInOut }
                }
            >
                {partChildren}
            </m.li>
        );
    };

    if (toast.render) {
        return (
            <UiSdkToast
                className={toast.containerProps?.className as string | undefined}
                id={toast.id}
                render={motionRender}
                style={{
                    zIndex: "var(--z-index-toast)",
                    pointerEvents: "auto",
                    listStyle: "none",
                    ...(toast.containerProps?.style as React.CSSProperties | undefined)
                }}
            >
                {toast.render(toast as unknown as ToastWithoutRender)}
            </UiSdkToast>
        );
    }

    const recipeClass = toastRecipe();
    const containerClassName = toast.containerProps?.className as string | undefined;

    return (
        <UiSdkToast
            className={cx(recipeClass, containerClassName)}
            data-closable={dataAttr(toast.isClosable)}
            data-status={toast.status}
            data-variant="default"
            id={toast.id}
            render={motionRender}
            style={toast.containerProps?.style as React.CSSProperties | undefined}
        >
            <div data-part="container">
                <UiSdkToastTitle
                    data-part="title"
                    render={<h4 />}
                >
                    {toast.status === "loading" ? (
                        <Spinner
                            color="info"
                            size="sm"
                        />
                    ) : (
                        <ToastIcon status={toast.status} />
                    )}
                    {toast.title}
                </UiSdkToastTitle>
                {toast.description ? (
                    <UiSdkToastDescription
                        data-part="description"
                        render={<p />}
                    >
                        {toast.description}
                    </UiSdkToastDescription>
                ) : null}
            </div>
            {toast.rightContent}
            {toast.isClosable ? (
                <UiSdkToastClose
                    data-part="close"
                    render={<CloseButton size="xs" />}
                />
            ) : null}
        </UiSdkToast>
    );
}

function ToastIcon({ status }: { status: Status }) {
    return (
        <Icon
            aria-hidden="true"
            asChild
            data-part="icon"
        >
            <StatusIcon status={status} />
        </Icon>
    );
}
