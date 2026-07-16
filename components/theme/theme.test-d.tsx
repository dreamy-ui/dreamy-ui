import { assertType } from "vitest";
import type { DarkThemeProps, LightThemeProps, ThemeProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<ThemeProps>({} as DarkThemeProps);
assertType<ThemeProps>({} as LightThemeProps);

type _HasCommonProps = ExpectTrue<
    "className" extends keyof ThemeProps
        ? "children" extends keyof ThemeProps
            ? "id" extends keyof ThemeProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof ThemeProps
        ? "color" extends keyof ThemeProps
            ? "p" extends keyof ThemeProps
                ? true
                : false
            : false
        : false
>;

type _DarkEqualsTheme = ExpectTrue<
    keyof DarkThemeProps extends keyof ThemeProps
        ? keyof ThemeProps extends keyof DarkThemeProps
            ? true
            : false
        : false
>;

type _LightEqualsTheme = ExpectTrue<
    keyof LightThemeProps extends keyof ThemeProps
        ? keyof ThemeProps extends keyof LightThemeProps
            ? true
            : false
        : false
>;

const _common: _HasCommonProps = true;
const _style: _HasStyleProps = true;
const _dark: _DarkEqualsTheme = true;
const _light: _LightEqualsTheme = true;

void (_common && _style && _dark && _light);

assertType<DarkThemeProps>({
    className: "dark-scope",
    id: "dark",
    children: "content",
    bg: "bg",
    color: "fg",
    p: 2
});

assertType<LightThemeProps>({
    className: "light-scope",
    id: "light",
    children: "content",
    bg: "bg",
    color: "fg",
    p: 2
});

assertType<ThemeProps>({
    // @ts-expect-error children must be valid React nodes when explicitly typed incorrectly
    children: (_value: symbol) => _value
});
