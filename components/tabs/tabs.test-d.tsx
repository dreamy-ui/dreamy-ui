import type { ChangeDetails } from "@ui-sdk/core";
import type { TabsValueChangeReason } from "@ui-sdk/react/tabs";
import { assertType } from "vitest";
import type { TabListProps, TabPanelProps, TabPanelsProps, TabProps, TabsProps } from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<"horizontal" | "vertical" | undefined>({} as TabsProps["orientation"]);
assertType<"automatic" | "manual" | undefined>({} as TabsProps["activation"]);
assertType<string | null | undefined>({} as TabsProps["value"]);
assertType<string | null | undefined>({} as TabsProps["defaultValue"]);
assertType<
    ((value: string | null, details: ChangeDetails<TabsValueChangeReason>) => void) | undefined
>({} as TabsProps["onValueChange"]);
assertType<boolean | undefined>({} as TabProps["disabled"]);

type _HasStateProps = ExpectTrue<
    "value" extends KnownKeys<TabsProps>
        ? "onValueChange" extends KnownKeys<TabsProps>
            ? "orientation" extends KnownKeys<TabsProps>
                ? "activation" extends KnownKeys<TabsProps>
                    ? "loop" extends KnownKeys<TabsProps>
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

type _NoLegacyProps = ExpectTrue<
    "manual" extends KnownKeys<TabsProps>
        ? false
        : "activationMode" extends KnownKeys<TabsProps>
          ? false
          : "isDisabled" extends KnownKeys<TabProps>
            ? false
            : true
>;

type _HasPartProps = ExpectTrue<
    TabListProps extends object
        ? TabProps extends object
            ? TabPanelsProps extends object
                ? TabPanelProps extends object
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<
    "variant" extends KnownKeys<TabsProps>
        ? "fitted" extends KnownKeys<TabsProps>
            ? true
            : false
        : false
>;

const _stateProps: _HasStateProps = true;
const _noLegacyProps: _NoLegacyProps = true;
const _partProps: _HasPartProps = true;
const _recipeProps: _HasRecipeProps = true;

void (_stateProps && _noLegacyProps && _partProps && _recipeProps);

assertType<TabsProps>({
    children: null,
    orientation: "horizontal",
    activation: "manual",
    value: "0",
    defaultValue: "1",
    onValueChange: () => {},
    variant: "filled",
    fitted: true
});

assertType<TabProps>({
    children: "Tab",
    disabled: false
});
