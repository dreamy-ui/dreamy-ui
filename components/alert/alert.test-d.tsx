import type { ReactNode } from "react";
import { assertType } from "vitest";
import type { AlertProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<"success" | "error" | "info" | "warning" | "loading" | undefined>(
    {} as AlertProps["status"]
);
assertType<ReactNode | undefined>({} as AlertProps["title"]);
assertType<ReactNode | undefined>({} as AlertProps["description"]);
assertType<ReactNode | undefined>({} as AlertProps["icon"]);

type _HasContentProps = ExpectTrue<
    "status" extends keyof AlertProps
        ? "title" extends keyof AlertProps
            ? "description" extends keyof AlertProps
                ? true
                : false
            : false
        : false
>;

type _HasRecipeProps = ExpectTrue<"variant" extends keyof AlertProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof AlertProps
        ? "color" extends keyof AlertProps
            ? "p" extends keyof AlertProps
                ? true
                : false
            : false
        : false
>;

const _contentProps: _HasContentProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_contentProps && _recipeProps && _styleProps);

assertType<AlertProps>({
    status: "error",
    title: "Error",
    description: "Broken",
    variant: "subtle",
    className: "alert",
    bg: "bg",
    color: "fg",
    p: 2
});

assertType<AlertProps>({
    // @ts-expect-error invalid status
    status: "critical"
});

assertType<AlertProps>({
    // @ts-expect-error invalid variant
    variant: "solid"
});
