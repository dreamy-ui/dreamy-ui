import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { TooltipProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ReactNode>({} as TooltipProps["children"]);
assertType<ReactNode | undefined>({} as TooltipProps["content"]);
assertType<string | undefined>({} as TooltipProps["aria-label"]);
assertType<boolean | undefined>({} as TooltipProps["shouldWrapChildren"]);
assertType<boolean | undefined>({} as TooltipProps["hasArrow"]);
assertType<boolean | undefined>({} as TooltipProps["isDisabled"]);
assertType<boolean | undefined>({} as TooltipProps["disablePortal"]);
assertType<boolean | undefined>({} as TooltipProps["closeOnEsc"]);
assertType<number | undefined>({} as TooltipProps["openDelay"]);
assertType<number | undefined>({} as TooltipProps["closeDelay"]);
assertType<(() => void) | undefined>({} as TooltipProps["onOpen"]);
assertType<(() => void) | undefined>({} as TooltipProps["onClose"]);
assertType<TooltipProps["positioning"]>({} as TooltipProps["positioning"]);
assertType<TooltipProps["portalProps"]>({} as TooltipProps["portalProps"]);

type _HasA11yProps = ExpectTrue<
    "content" extends keyof TooltipProps
        ? "aria-label" extends keyof TooltipProps
            ? "closeOnEsc" extends keyof TooltipProps
                ? "shouldWrapChildren" extends keyof TooltipProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof TooltipProps
        ? "color" extends keyof TooltipProps
            ? "p" extends keyof TooltipProps
                ? true
                : false
            : false
        : false
>;

const _a11yProps: _HasA11yProps = true;
const _styleProps: _HasStyleProps = true;

void (_a11yProps && _styleProps);

assertType<TooltipProps>({
    children: "trigger",
    content: "tip",
    "aria-label": "sr tip",
    shouldWrapChildren: true,
    hasArrow: true,
    isDisabled: false,
    disablePortal: false,
    closeOnEsc: true,
    openDelay: 0,
    closeDelay: 0,
    onOpen: () => {},
    onClose: () => {},
    positioning: { placement: "top" },
    bg: "bg.panel",
    color: "fg",
    p: 2
});

assertType<TooltipProps>({
    children: "x",
    content: "y",
    // @ts-expect-error openDelay must be a number
    openDelay: "slow"
});

assertType<TooltipProps>({
    children: "x",
    // @ts-expect-error positioning expects an object
    positioning: "top"
});
