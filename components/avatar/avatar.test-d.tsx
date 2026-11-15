import { assertType } from "vitest";
import type { ChangeDetails } from "@ui-sdk/core";
import type {
    AvatarLoadingStatus,
    AvatarLoadingStatusChangeReason
} from "@ui-sdk/react/avatar";
import type { AvatarGroupProps, AvatarProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<string | undefined>({} as AvatarProps["name"]);
assertType<string | undefined>({} as AvatarProps["src"]);
assertType<string | undefined>({} as AvatarProps["srcSet"]);
assertType<"eager" | "lazy" | undefined>({} as AvatarProps["loading"]);
assertType<(() => void) | undefined>({} as AvatarProps["onError"]);
assertType<((name: string) => string) | undefined>({} as AvatarProps["getInitials"]);
assertType<string | undefined>({} as AvatarProps["iconLabel"]);
assertType<
    | ((
          status: AvatarLoadingStatus,
          details: ChangeDetails<AvatarLoadingStatusChangeReason>
      ) => void)
    | undefined
>({} as AvatarProps["onLoadingStatusChange"]);
assertType<"" | "anonymous" | "use-credentials" | undefined>(
    {} as AvatarProps["crossOrigin"]
);

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
    onLoadingStatusChange: () => {},
    crossOrigin: "anonymous",
    className: "custom-avatar",
    bg: "transparent",
    color: "fg",
    p: 0,
    m: 0,
    w: "40px",
    h: "40px"
});

assertType<AvatarGroupProps>({
    maxAvatars: 3,
    spacing: "-0.5rem",
    children: null
});
