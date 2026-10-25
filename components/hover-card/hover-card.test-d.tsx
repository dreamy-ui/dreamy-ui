import { assertType } from "vitest";
import type {
    HoverCardBodyProps,
    HoverCardContentProps,
    HoverCardFooterProps,
    HoverCardHeaderProps,
    HoverCardProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as HoverCardProps["open"]);
assertType<boolean | undefined>({} as HoverCardProps["defaultOpen"]);
assertType<((details: { open: boolean }) => void) | undefined>({} as HoverCardProps["onOpenChange"]);
assertType<boolean | undefined>({} as HoverCardProps["hasArrow"]);
assertType<boolean | undefined>({} as HoverCardProps["usePortal"]);
assertType<number | undefined>({} as HoverCardProps["openDelay"]);
assertType<number | undefined>({} as HoverCardProps["closeDelay"]);
assertType<HoverCardProps["positioning"]>({} as HoverCardProps["positioning"]);
assertType<HoverCardProps["portalProps"]>({} as HoverCardProps["portalProps"]);

type _HasOpenProps = ExpectTrue<
    "open" extends keyof HoverCardProps
        ? "openDelay" extends keyof HoverCardProps
            ? "closeDelay" extends keyof HoverCardProps
                ? "onOpenChange" extends keyof HoverCardProps
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
    open: true,
    defaultOpen: false,
    onOpenChange: () => {},
    hasArrow: true,
    usePortal: true,
    openDelay: 0,
    closeDelay: 0,
    closeOnEscape: true,
    positioning: { placement: "top" }
});
