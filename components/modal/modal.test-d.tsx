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

assertType<boolean | undefined>({} as ModalProps["open"]);
assertType<boolean | undefined>({} as ModalProps["defaultOpen"]);
assertType<((details: { open: boolean }) => void) | undefined>({} as ModalProps["onOpenChange"]);
assertType<boolean | undefined>({} as ModalProps["closeOnEscape"]);
assertType<boolean | undefined>({} as ModalProps["closeOnInteractOutside"]);
assertType<boolean | undefined>({} as ModalProps["trapFocus"]);
assertType<boolean | undefined>({} as ModalProps["autoFocus"]);
assertType<boolean | undefined>({} as ModalProps["restoreFocus"]);
assertType<boolean | undefined>({} as ModalProps["blockScrollOnMount"]);
assertType<boolean | undefined>({} as ModalProps["useInert"]);
assertType<"inside" | "outside" | undefined>({} as ModalProps["scrollBehavior"]);
assertType<(() => void) | undefined>({} as ModalProps["onCloseComplete"]);

assertType<RefObject<{ focus(): void } | null> | undefined>({} as ModalProps["initialFocusRef"]);
assertType<RefObject<{ focus(): void } | null> | undefined>({} as ModalProps["finalFocusRef"]);

type _HasFocusProps = ExpectTrue<
    "initialFocusRef" extends keyof ModalProps
        ? "finalFocusRef" extends keyof ModalProps
            ? "trapFocus" extends keyof ModalProps
                ? "restoreFocus" extends keyof ModalProps
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
    open: true,
    onOpenChange: () => {},
    closeOnEscape: true,
    closeOnInteractOutside: true,
    trapFocus: true,
    autoFocus: true,
    restoreFocus: true,
    blockScrollOnMount: true,
    scrollBehavior: "inside",
    useInert: true,
    onCloseComplete: () => {},
    children: null
});

assertType<ModalProps>({
    open: false,
    onOpenChange: () => {},
    children: null,
    // @ts-expect-error scrollBehavior must be inside or outside
    scrollBehavior: "center"
});

assertType<ModalProps>({
    open: true,
    onOpenChange: () => {},
    children: null,
    // @ts-expect-error trapFocus must be boolean
    trapFocus: "yes"
});
