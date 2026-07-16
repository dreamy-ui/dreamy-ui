import type { ComponentProps } from "react";
import { assertType } from "vitest";
import * as Card from "./index";

type ExpectTrue<T extends true> = T;
type CardRootProps = ComponentProps<typeof Card.Root>;
type CardTitleProps = ComponentProps<typeof Card.Title>;

const _size: CardRootProps["size"] = "md";
const _variant: CardRootProps["variant"] = "outline";

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof CardRootProps
        ? "variant" extends keyof CardRootProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof CardRootProps
        ? "color" extends keyof CardRootProps
            ? "p" extends keyof CardRootProps
                ? "m" extends keyof CardRootProps
                    ? "w" extends keyof CardRootProps
                        ? "h" extends keyof CardRootProps
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

void (_recipeProps && _styleProps && _size && _variant);

assertType<CardRootProps>({
    size: "lg",
    variant: "elevated",
    className: "custom-card",
    bg: "bg.panel",
    color: "fg",
    p: 4,
    m: 2,
    w: "full",
    h: "auto"
});

assertType<CardTitleProps>({
    as: "h2",
    children: "Title"
});

assertType<CardRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<CardRootProps>({
    // @ts-expect-error invalid variant
    variant: "ghost"
});
