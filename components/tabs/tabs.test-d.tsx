import { assertType } from "vitest";
import type { TabListProps, TabPanelProps, TabPanelsProps, TabProps, TabsProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<"horizontal" | "vertical" | undefined>({} as TabsProps["orientation"]);
assertType<boolean | undefined>({} as TabsProps["isManual"]);
assertType<number | undefined>({} as TabsProps["index"]);
assertType<number | undefined>({} as TabsProps["defaultIndex"]);
assertType<((index: number) => void) | undefined>({} as TabsProps["onChange"]);
assertType<boolean | undefined>({} as TabProps["isDisabled"]);
assertType<boolean | undefined>({} as TabProps["isFocusable"]);

type _HasStateProps = ExpectTrue<
    "index" extends keyof TabsProps
        ? "onChange" extends keyof TabsProps
            ? "orientation" extends keyof TabsProps
                ? "isManual" extends keyof TabsProps
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
    isManual: true,
    index: 0,
    defaultIndex: 1,
    onChange: () => {},
    variant: "filled",
    fitted: true
});

assertType<TabProps>({
    children: "Tab",
    isDisabled: true,
    isFocusable: true
});

assertType<TabsProps>({
    children: null,
    // @ts-expect-error invalid orientation
    orientation: "diagonal"
});

assertType<TabsProps>({
    children: null,
    // @ts-expect-error invalid variant
    variant: "pills"
});
