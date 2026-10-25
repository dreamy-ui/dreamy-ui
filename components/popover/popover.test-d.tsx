import type { RefObject } from "react";
import { assertType } from "vitest";
import type {
    PopoverBodyProps,
    PopoverCloseButtonProps,
    PopoverContentProps,
    PopoverFooterProps,
    PopoverHeaderProps,
    PopoverProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as PopoverProps["open"]);
assertType<boolean | undefined>({} as PopoverProps["defaultOpen"]);
assertType<((details: { open: boolean }) => void) | undefined>({} as PopoverProps["onOpenChange"]);
assertType<boolean | undefined>({} as PopoverProps["closeOnEscape"]);
assertType<boolean | undefined>({} as PopoverProps["closeOnInteractOutside"]);
assertType<boolean | undefined>({} as PopoverProps["restoreFocus"]);
assertType<boolean | undefined>({} as PopoverProps["autoFocus"]);
assertType<boolean | undefined>({} as PopoverProps["hasArrow"]);
assertType<boolean | undefined>({} as PopoverProps["usePortal"]);
assertType<"click" | "hover" | undefined>({} as PopoverProps["trigger"]);
assertType<number | undefined>({} as PopoverProps["openDelay"]);
assertType<number | undefined>({} as PopoverProps["closeDelay"]);
assertType<RefObject<{ focus(): void } | null> | undefined>({} as PopoverProps["initialFocusRef"]);

type _HasOpenProps = ExpectTrue<
    "open" extends keyof PopoverProps
        ? "onOpenChange" extends keyof PopoverProps
            ? "closeOnEscape" extends keyof PopoverProps
                ? true
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    PopoverContentProps extends object
        ? PopoverHeaderProps extends object
            ? PopoverBodyProps extends object
                ? PopoverFooterProps extends object
                    ? PopoverCloseButtonProps extends object
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

const _openProps: _HasOpenProps = true;
const _partProps: _HasPartProps = true;

void (_openProps && _partProps);

assertType<PopoverProps>({
    open: true,
    defaultOpen: false,
    onOpenChange: () => {},
    closeOnEscape: true,
    closeOnInteractOutside: true,
    restoreFocus: true,
    autoFocus: true,
    hasArrow: true,
    usePortal: true,
    trigger: "click",
    openDelay: 200,
    closeDelay: 200,
    positioning: { placement: "bottom" }
});

assertType<PopoverProps>({
    // @ts-expect-error trigger must be click or hover
    trigger: "focus"
});

assertType<PopoverProps>({
    // @ts-expect-error invalid placement token shape is not a string
    positioning: "top"
});
