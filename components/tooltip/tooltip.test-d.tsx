import type { ChangeDetails } from "@ui-sdk/core";
import type { TooltipOpenChangeReason } from "@ui-sdk/react/tooltip";
import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { TooltipProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ReactNode>({} as TooltipProps["children"]);
assertType<ReactNode | undefined>({} as TooltipProps["content"]);
assertType<string | undefined>({} as TooltipProps["aria-label"]);
assertType<boolean | undefined>({} as TooltipProps["shouldWrapChildren"]);
assertType<boolean | undefined>({} as TooltipProps["hasArrow"]);
assertType<boolean | undefined>({} as TooltipProps["disabled"]);
assertType<number | undefined>({} as TooltipProps["arrowSize"]);
assertType<number | undefined>({} as TooltipProps["delay"]);
assertType<number | undefined>({} as TooltipProps["closeDelay"]);
assertType<boolean | undefined>({} as TooltipProps["open"]);
assertType<boolean | undefined>({} as TooltipProps["defaultOpen"]);
assertType<boolean | undefined>({} as TooltipProps["closeOnPress"]);
assertType<boolean | undefined>({} as TooltipProps["toggleable"]);
assertType<
    ((open: boolean, details: ChangeDetails<TooltipOpenChangeReason>) => void) | undefined
>({} as TooltipProps["onOpenChange"]);
assertType<TooltipProps["positioning"]>({} as TooltipProps["positioning"]);

type _HasUiSdkProps = ExpectTrue<
    "content" extends keyof TooltipProps
        ? "delay" extends keyof TooltipProps
            ? "closeDelay" extends keyof TooltipProps
                ? "onOpenChange" extends keyof TooltipProps
                    ? "closeOnPress" extends keyof TooltipProps
                        ? true
                        : false
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

const _uiSdkProps: _HasUiSdkProps = true;
const _styleProps: _HasStyleProps = true;

void (_uiSdkProps && _styleProps);

assertType<TooltipProps>({
    children: "trigger",
    content: "tip",
    "aria-label": "sr tip",
    shouldWrapChildren: true,
    hasArrow: true,
    arrowSize: 12,
    disabled: false,
    delay: 0,
    closeDelay: 0,
    closeOnPress: false,
    toggleable: true,
    open: true,
    defaultOpen: false,
    onOpenChange: () => {},
    positioning: { placement: "top" },
    side: "bottom",
    align: "start",
    bg: "bg.panel",
    color: "fg",
    p: 2
});

assertType<TooltipProps>({
    children: "x",
    content: "y",
    // @ts-expect-error delay must be a number
    delay: "slow"
});

type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

type _NoLegacyProps = ExpectTrue<
    "openDelay" extends KnownKeys<TooltipProps>
        ? false
        : "closeOnEsc" extends KnownKeys<TooltipProps>
          ? false
          : "onOpen" extends KnownKeys<TooltipProps>
            ? false
            : "onClose" extends KnownKeys<TooltipProps>
              ? false
              : true
>;

const _noLegacyProps: _NoLegacyProps = true;
void _noLegacyProps;

assertType<TooltipProps>({
    children: "x",
    // @ts-expect-error positioning expects an object
    positioning: "top"
});
