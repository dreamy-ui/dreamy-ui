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

assertType<boolean | undefined>({} as PopoverProps["isOpen"]);
assertType<boolean | undefined>({} as PopoverProps["defaultIsOpen"]);
assertType<(() => void) | undefined>({} as PopoverProps["onOpen"]);
assertType<(() => void) | undefined>({} as PopoverProps["onClose"]);
assertType<boolean | undefined>({} as PopoverProps["closeOnEsc"]);
assertType<boolean | undefined>({} as PopoverProps["closeOnBlur"]);
assertType<boolean | undefined>({} as PopoverProps["returnFocusOnClose"]);
assertType<boolean | undefined>({} as PopoverProps["autoFocus"]);
assertType<boolean | undefined>({} as PopoverProps["hasArrow"]);
assertType<boolean | undefined>({} as PopoverProps["usePortal"]);
assertType<"click" | "hover" | undefined>({} as PopoverProps["trigger"]);
assertType<number | undefined>({} as PopoverProps["openDelay"]);
assertType<number | undefined>({} as PopoverProps["closeDelay"]);
assertType<RefObject<{ focus(): void } | null> | undefined>({} as PopoverProps["initialFocusRef"]);

type _HasOpenProps = ExpectTrue<
    "isOpen" extends keyof PopoverProps
        ? "onOpen" extends keyof PopoverProps
            ? "onClose" extends keyof PopoverProps
                ? "closeOnEsc" extends keyof PopoverProps
                    ? true
                    : false
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
    isOpen: true,
    defaultIsOpen: false,
    onOpen: () => {},
    onClose: () => {},
    closeOnEsc: true,
    closeOnBlur: true,
    returnFocusOnClose: true,
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
