import type { ChangeDetails } from "@ui-sdk/core";
import type { HoverCardOpenChangeReason } from "@ui-sdk/react/hover-card";
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
assertType<
    ((open: boolean, details: ChangeDetails<HoverCardOpenChangeReason>) => void) | undefined
>({} as HoverCardProps["onOpenChange"]);
assertType<boolean | undefined>({} as HoverCardProps["hasArrow"]);
assertType<number | undefined>({} as HoverCardProps["arrowSize"]);
assertType<number | undefined>({} as HoverCardProps["delay"]);
assertType<number | undefined>({} as HoverCardProps["closeDelay"]);
assertType<boolean | undefined>({} as HoverCardProps["disabled"]);
assertType<HoverCardProps["positioning"]>({} as HoverCardProps["positioning"]);

type _HasOpenProps = ExpectTrue<
    "open" extends keyof HoverCardProps
        ? "delay" extends keyof HoverCardProps
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
    arrowSize: 10,
    delay: 0,
    closeDelay: 0,
    disabled: false,
    positioning: { placement: "top" }
});

assertType<HoverCardProps>({
    // @ts-expect-error legacy openDelay prop removed in favor of delay
    openDelay: 100
});

assertType<HoverCardProps>({
    // @ts-expect-error legacy usePortal prop removed
    usePortal: true
});
