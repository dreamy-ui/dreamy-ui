"use client";

import { TRANSITION_EASINGS, type Toast, dataAttr, useToast } from "@dreamy-ui/react";
import { isValidMotionProp, m } from "motion/react";
import { useCallback } from "react";
import { isCssProperty } from "styled-system/jsx";
import { toast } from "styled-system/recipes";
import { useStatusIcon } from "./alert";
import { CloseButton } from "./close-button";
import { type Status, dreamy } from "./factory";
import { Icon } from "./icon";
import { Spinner } from "./spinner";
import { Text } from "./text";

const StyledToast = dreamy(m.div, toast, {
    shouldForwardProp: (prop, variantKeys) =>
        isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
});

function ToastIcon({ status }: { status: Status }) {
    const statusIcon = useStatusIcon(status);
    return (
        <Icon
            role="img"
            data-part={"icon"}
            asChild
        >
            {statusIcon}
        </Icon>
    );
}

export function ToastComponent({ toast }: { toast: Toast }) {
    const { removeToast } = useToast();

    const handleClose = useCallback(() => {
        removeToast(toast.id);
    }, [removeToast, toast.id]);

    if (toast.render) {
        return (
            <m.div
                style={{
                    zIndex: "var(--z-index-toast)",
                    pointerEvents: "auto"
                }}
                {...{
                    layout: "position",
                    layoutId: toast.id,
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.95 },
                    transition: {
                        duration: 0.3,
                        ease: TRANSITION_EASINGS.easeInOut
                    }
                }}
                {...(toast.containerProps as any)}
            >
                {toast.render(toast)}
            </m.div>
        );
    }

    return (
        <StyledToast
            {...{
                layout: true,
                layoutId: toast.id,
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.95 },
                transition: {
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.easeInOut
                }
            }}
            key={`${toast.id}-toast`}
            id={toast.id}
            data-status={toast.status}
            data-variant={"default"}
            data-closable={dataAttr(toast.isClosable)}
            {...(toast.containerProps as any)}
        >
            <m.div
                layout="position"
                data-part={"container"}
            >
                <Text
                    data-part={"title"}
                    as={"h4"}
                >
                    {toast.status === "loading" ? (
                        <Spinner
                            color={"info"}
                            size={"sm"}
                        />
                    ) : (
                        <ToastIcon status={toast.status} />
                    )}
                    {toast.title}
                </Text>
                {toast.description && <Text data-part={"description"}>{toast.description}</Text>}
            </m.div>
            {toast.rightContent}
            {toast.isClosable && (
                <CloseButton
                    data-part={"close"}
                    size={"xs"}
                    onClick={handleClose}
                />
            )}
        </StyledToast>
    );
}
