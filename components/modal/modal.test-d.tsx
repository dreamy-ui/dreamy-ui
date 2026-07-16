import type { RefObject } from "react";
import { assertType } from "vitest";
import type {
    ModalBodyProps,
    ModalCloseButtonProps,
    ModalContentProps,
    ModalFooterProps,
    ModalHeaderProps,
    ModalOverlayProps,
    ModalProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean>({} as ModalProps["isOpen"]);
assertType<() => void>({} as ModalProps["onClose"]);
assertType<boolean | undefined>({} as ModalProps["closeOnEsc"]);
assertType<boolean | undefined>({} as ModalProps["closeOnOverlayClick"]);
assertType<boolean | undefined>({} as ModalProps["trapFocus"]);
assertType<boolean | undefined>({} as ModalProps["autoFocus"]);
assertType<boolean | undefined>({} as ModalProps["returnFocusOnClose"]);
assertType<boolean | undefined>({} as ModalProps["blockScrollOnMount"]);
assertType<boolean | undefined>({} as ModalProps["useInert"]);
assertType<"inside" | "outside" | undefined>({} as ModalProps["scrollBehavior"]);
assertType<(() => void) | undefined>({} as ModalProps["onCloseComplete"]);
assertType<(() => void) | undefined>({} as ModalProps["onEsc"]);
assertType<(() => void) | undefined>({} as ModalProps["onOverlayClick"]);

assertType<RefObject<{ focus(): void } | null> | undefined>({} as ModalProps["initialFocusRef"]);
assertType<RefObject<{ focus(): void } | null> | undefined>({} as ModalProps["finalFocusRef"]);

type _HasFocusProps = ExpectTrue<
    "initialFocusRef" extends keyof ModalProps
        ? "finalFocusRef" extends keyof ModalProps
            ? "trapFocus" extends keyof ModalProps
                ? "returnFocusOnClose" extends keyof ModalProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    ModalOverlayProps extends object
        ? ModalContentProps extends object
            ? ModalHeaderProps extends object
                ? ModalBodyProps extends object
                    ? ModalFooterProps extends object
                        ? ModalCloseButtonProps extends object
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _focusProps: _HasFocusProps = true;
const _partProps: _HasPartProps = true;

void (_focusProps && _partProps);

assertType<ModalProps>({
    isOpen: true,
    onClose: () => {},
    closeOnEsc: true,
    closeOnOverlayClick: true,
    trapFocus: true,
    autoFocus: true,
    returnFocusOnClose: true,
    blockScrollOnMount: true,
    scrollBehavior: "inside",
    useInert: true,
    onCloseComplete: () => {},
    onEsc: () => {},
    onOverlayClick: () => {},
    children: null
});

assertType<ModalProps>({
    isOpen: false,
    onClose: () => {},
    children: null,
    // @ts-expect-error scrollBehavior must be inside or outside
    scrollBehavior: "center"
});

assertType<ModalProps>({
    isOpen: true,
    onClose: () => {},
    children: null,
    // @ts-expect-error trapFocus must be boolean
    trapFocus: "yes"
});
