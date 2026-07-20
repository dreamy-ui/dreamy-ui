import type { RefObject } from "react";
import { assertType } from "vitest";
import type {
    DrawerBodyProps,
    DrawerCloseButtonProps,
    DrawerContentProps,
    DrawerFooterProps,
    DrawerHeaderProps,
    DrawerOverlayProps,
    DrawerProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean>({} as DrawerProps["isOpen"]);
assertType<() => void>({} as DrawerProps["onClose"]);
assertType<boolean | undefined>({} as DrawerProps["closeOnEsc"]);
assertType<boolean | undefined>({} as DrawerProps["closeOnOverlayClick"]);
assertType<boolean | undefined>({} as DrawerProps["trapFocus"]);
assertType<boolean | undefined>({} as DrawerProps["autoFocus"]);
assertType<boolean | undefined>({} as DrawerProps["returnFocusOnClose"]);
assertType<boolean | undefined>({} as DrawerProps["blockScrollOnMount"]);
assertType<boolean | undefined>({} as DrawerProps["useInert"]);
assertType<"inside" | "outside" | undefined>({} as DrawerProps["scrollBehavior"]);
assertType<"left" | "right" | "top" | "bottom" | undefined>({} as DrawerProps["placement"]);
assertType<(() => void) | undefined>({} as DrawerProps["onCloseComplete"]);
assertType<(() => void) | undefined>({} as DrawerProps["onEsc"]);
assertType<(() => void) | undefined>({} as DrawerProps["onOverlayClick"]);

assertType<RefObject<{ focus(): void } | null> | undefined>({} as DrawerProps["initialFocusRef"]);
assertType<RefObject<{ focus(): void } | null> | undefined>({} as DrawerProps["finalFocusRef"]);

type _HasFocusProps = ExpectTrue<
    "initialFocusRef" extends keyof DrawerProps
        ? "finalFocusRef" extends keyof DrawerProps
            ? "trapFocus" extends keyof DrawerProps
                ? "returnFocusOnClose" extends keyof DrawerProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    DrawerOverlayProps extends object
        ? DrawerContentProps extends object
            ? DrawerHeaderProps extends object
                ? DrawerBodyProps extends object
                    ? DrawerFooterProps extends object
                        ? DrawerCloseButtonProps extends object
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

assertType<DrawerProps>({
    isOpen: true,
    onClose: () => {},
    closeOnEsc: true,
    closeOnOverlayClick: true,
    trapFocus: true,
    autoFocus: true,
    returnFocusOnClose: true,
    blockScrollOnMount: true,
    scrollBehavior: "inside",
    placement: "right",
    useInert: true,
    onCloseComplete: () => {},
    onEsc: () => {},
    onOverlayClick: () => {},
    children: null
});

assertType<DrawerProps>({
    isOpen: false,
    onClose: () => {},
    children: null,
    // @ts-expect-error scrollBehavior must be inside or outside
    scrollBehavior: "center"
});

assertType<DrawerProps>({
    isOpen: true,
    onClose: () => {},
    children: null,
    // @ts-expect-error placement must be a valid drawer edge
    placement: "center"
});

assertType<DrawerProps>({
    isOpen: true,
    onClose: () => {},
    children: null,
    // @ts-expect-error trapFocus must be boolean
    trapFocus: "yes"
});
