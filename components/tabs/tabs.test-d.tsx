import { assertType } from "vitest";
import type { TabListProps, TabPanelProps, TabPanelsProps, TabProps, TabsProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<"horizontal" | "vertical" | undefined>({} as TabsProps["orientation"]);
assertType<boolean | undefined>({} as TabsProps["manual"]);
assertType<string | undefined>({} as TabsProps["value"]);
assertType<string | undefined>({} as TabsProps["defaultValue"]);
assertType<((details: { value: string }) => void) | undefined>({} as TabsProps["onValueChange"]);
assertType<boolean | undefined>({} as TabProps["isDisabled"]);
assertType<boolean | undefined>({} as TabProps["isFocusable"]);

type _HasStateProps = ExpectTrue<
    "value" extends keyof TabsProps
        ? "onValueChange" extends keyof TabsProps
            ? "orientation" extends keyof TabsProps
                ? "manual" extends keyof TabsProps
                    ? true
                    : false
                : false
            : false
        : false
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
    "variant" extends keyof TabsProps ? ("fitted" extends keyof TabsProps ? true : false) : false
>;

const _stateProps: _HasStateProps = true;
const _partProps: _HasPartProps = true;
const _recipeProps: _HasRecipeProps = true;

void (_stateProps && _partProps && _recipeProps);

assertType<TabsProps>({
    children: null,
    orientation: "horizontal",
    manual: true,
    value: "0",
    defaultValue: "1",
    onValueChange: () => {},
    variant: "filled",
    fitted: true
});

assertType<TabProps>({
    children: "Tab",
    isDisabled: false,
    isFocusable: true
});
