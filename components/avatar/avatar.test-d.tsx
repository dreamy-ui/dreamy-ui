import { assertType } from "vitest";
import type { AvatarGroupProps, AvatarProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<string | undefined>({} as AvatarProps["name"]);
assertType<string | undefined>({} as AvatarProps["src"]);
assertType<string | undefined>({} as AvatarProps["srcSet"]);
assertType<"eager" | "lazy" | undefined>({} as AvatarProps["loading"]);
assertType<(() => void) | undefined>({} as AvatarProps["onError"]);
assertType<((name: string) => string) | undefined>({} as AvatarProps["getInitials"]);
assertType<string | undefined>({} as AvatarProps["iconLabel"]);

assertType<number | undefined>({} as AvatarGroupProps["maxAvatars"]);
assertType<string | number | undefined>({} as AvatarGroupProps["spacing"]);

const _size: AvatarProps["size"] = "md";
const _scheme: AvatarProps["scheme"] = "primary";
const _variant: AvatarProps["variant"] = "filled";

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof AvatarProps
        ? "scheme" extends keyof AvatarProps
            ? "variant" extends keyof AvatarProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof AvatarProps
        ? "color" extends keyof AvatarProps
            ? "p" extends keyof AvatarProps
                ? "m" extends keyof AvatarProps
                    ? "w" extends keyof AvatarProps
                        ? "h" extends keyof AvatarProps
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

void (_recipeProps && _styleProps && _size && _scheme && _variant);

assertType<AvatarProps>({
    name: "Alexandra",
    src: "/avatar.png",
    size: "md",
    scheme: "primary",
    variant: "filled",
    iconLabel: "User",
    className: "custom-avatar",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<AvatarGroupProps>({
    maxAvatars: 3,
    spacing: "-0.75rem",
    "aria-label": "Team",
    children: null
});

assertType<AvatarProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<AvatarProps>({
    // @ts-expect-error invalid scheme
    scheme: "invalid"
});
