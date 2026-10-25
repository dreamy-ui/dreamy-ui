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

assertType<boolean | undefined>({} as DrawerProps["open"]);
assertType<boolean | undefined>({} as DrawerProps["defaultOpen"]);
assertType<((details: { open: boolean }) => void) | undefined>({} as DrawerProps["onOpenChange"]);
assertType<boolean | undefined>({} as DrawerProps["closeOnEscape"]);
assertType<boolean | undefined>({} as DrawerProps["closeOnInteractOutside"]);
assertType<boolean | undefined>({} as DrawerProps["trapFocus"]);
assertType<boolean | undefined>({} as DrawerProps["autoFocus"]);
assertType<boolean | undefined>({} as DrawerProps["restoreFocus"]);
assertType<boolean | undefined>({} as DrawerProps["blockScrollOnMount"]);
assertType<boolean | undefined>({} as DrawerProps["useInert"]);
assertType<"inside" | "outside" | undefined>({} as DrawerProps["scrollBehavior"]);
assertType<(() => void) | undefined>({} as DrawerProps["onCloseComplete"]);

assertType<RefObject<{ focus(): void } | null> | undefined>({} as DrawerProps["initialFocusRef"]);
assertType<RefObject<{ focus(): void } | null> | undefined>({} as DrawerProps["finalFocusRef"]);

type _HasFocusProps = ExpectTrue<
    "initialFocusRef" extends keyof DrawerProps
        ? "finalFocusRef" extends keyof DrawerProps
            ? "trapFocus" extends keyof DrawerProps
                ? "restoreFocus" extends keyof DrawerProps
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

assertType<DrawerProps>({
    open: false,
    onOpenChange: () => {},
    children: null,
    // @ts-expect-error scrollBehavior must be inside or outside
    scrollBehavior: "center"
});

assertType<DrawerProps>({
    open: true,
    onOpenChange: () => {},
    children: null,
    // @ts-expect-error trapFocus must be boolean
    trapFocus: "yes"
});
