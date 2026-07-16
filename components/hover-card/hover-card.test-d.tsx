import { assertType } from "vitest";
import type {
    HoverCardBodyProps,
    HoverCardContentProps,
    HoverCardFooterProps,
    HoverCardHeaderProps,
    HoverCardProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as HoverCardProps["isOpen"]);
assertType<boolean | undefined>({} as HoverCardProps["defaultIsOpen"]);
assertType<(() => void) | undefined>({} as HoverCardProps["onOpen"]);
assertType<(() => void) | undefined>({} as HoverCardProps["onClose"]);
assertType<boolean | undefined>({} as HoverCardProps["hasArrow"]);
assertType<boolean | undefined>({} as HoverCardProps["usePortal"]);
assertType<number | undefined>({} as HoverCardProps["openDelay"]);
assertType<number | undefined>({} as HoverCardProps["closeDelay"]);
assertType<boolean | undefined>({} as HoverCardProps["closeOnEsc"]);
assertType<HoverCardProps["positioning"]>({} as HoverCardProps["positioning"]);
assertType<HoverCardProps["portalProps"]>({} as HoverCardProps["portalProps"]);

type _HasOpenProps = ExpectTrue<
    "isOpen" extends keyof HoverCardProps
        ? "openDelay" extends keyof HoverCardProps
            ? "closeDelay" extends keyof HoverCardProps
                ? "onClose" extends keyof HoverCardProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    HoverCardContentProps extends object
        ? HoverCardHeaderProps extends object
            ? HoverCardBodyProps extends object
                ? HoverCardFooterProps extends object
                    ? true
                    : false
                : false
            : false
        : false
>;

const _openProps: _HasOpenProps = true;
const _partProps: _HasPartProps = true;

void (_openProps && _partProps);

assertType<HoverCardProps>({
    isOpen: true,
    defaultIsOpen: false,
    onOpen: () => {},
    onClose: () => {},
    hasArrow: true,
    usePortal: true,
    openDelay: 0,
    closeDelay: 0,
    closeOnEsc: true,
    positioning: { placement: "top" }
});

assertType<HoverCardProps>({
    // @ts-expect-error HoverCard does not accept click trigger override via UseHoverCardProps
    trigger: "click"
});

assertType<HoverCardProps>({
    openDelay: 100,
    // @ts-expect-error openDelay must be a number
    closeDelay: "fast"
});
