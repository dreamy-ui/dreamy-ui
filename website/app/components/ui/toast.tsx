"use client";

import { type Status, TRANSITION_EASINGS, dataAttr } from "@dreamy-ui/react";
import { isValidMotionProp, m } from "motion/react";
import { useCallback } from "react";
import { dreamy, isCssProperty } from "styled-system/jsx";
import { toast } from "styled-system/recipes";
import { useStatusIcon } from "./alert";
import { CloseButton } from "./close-button";
import { Icon } from "./icon";
import { Spinner } from "./spinner";
import { Text } from "./text";
import { type IToast, useToast } from "./toast-provider";

const StyledToast = m.create(
    dreamy("div", toast, {
        shouldForwardProp: (prop, variantKeys) =>
            isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
    })
);

export function Toast({ toast }: { toast: IToast }) {
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
                {...toast.containerProps}
            >
                {toast.render(toast)}
            </m.div>
        );
    }

    return (
        <StyledToast
            animate={{ opacity: 1, scale: 1 }}
            data-closable={dataAttr(toast.isClosable)}
            data-status={toast.status}
            data-variant={"default"}
            exit={{ opacity: 0, scale: 0.95 }}
            id={toast.id}
            initial={{ opacity: 0, scale: 0.95 }}
            key={`${toast.id}-toast`}
            layout
            layoutId={toast.id}
            transition={{
                duration: 0.3,
                ease: TRANSITION_EASINGS.easeInOut
            }}
            {...toast.containerProps}
        >
            <m.div
                data-part={"container"}
                layout="position"
            >
                <Text
                    as={"h4"}
                    data-part={"title"}
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
                    onClick={handleClose}
                    size={"xs"}
                />
            )}
        </StyledToast>
    );
}

function ToastIcon({ status }: { status: Status }) {
    const statusIcon = useStatusIcon(status);

    return (
        <Icon
            asChild
            data-part={"icon"}
            role="img"
        >
            {statusIcon}
        </Icon>
    );
}
