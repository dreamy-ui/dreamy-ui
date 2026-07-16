import { assertType } from "vitest";
import type {
    EmptyStateDescriptionProps,
    EmptyStateIndicatorProps,
    EmptyStateRootProps,
    EmptyStateTitleProps
} from "./index";

type ExpectTrue<T extends true> = T;

const _size: EmptyStateRootProps["size"] = "md";

type _HasRecipeProps = ExpectTrue<"size" extends keyof EmptyStateRootProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof EmptyStateRootProps
        ? "color" extends keyof EmptyStateRootProps
            ? "p" extends keyof EmptyStateRootProps
                ? "m" extends keyof EmptyStateRootProps
                    ? "w" extends keyof EmptyStateRootProps
                        ? "h" extends keyof EmptyStateRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;

void (_recipeProps && _styleProps && _size);

assertType<EmptyStateRootProps>({
    size: "lg",
    className: "custom-empty",
    bg: "bg.panel",
    color: "fg",
    p: 4,
    m: 2,
    w: "full",
    h: "auto"
});

assertType<EmptyStateTitleProps>({
    as: "h2",
    children: "No results"
});

assertType<EmptyStateDescriptionProps>({
    children: "Try again"
});

assertType<EmptyStateIndicatorProps>({
    "aria-hidden": true
});

assertType<EmptyStateRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});
