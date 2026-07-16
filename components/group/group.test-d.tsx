import { assertType } from "vitest";
import type { GroupProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasRecipeProps = ExpectTrue<
    "orientation" extends keyof GroupProps
        ? "attached" extends keyof GroupProps
            ? "grow" extends keyof GroupProps
                ? "stacking" extends keyof GroupProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasLayoutProps = ExpectTrue<
    "align" extends keyof GroupProps
        ? "justify" extends keyof GroupProps
            ? "direction" extends keyof GroupProps
                ? "wrap" extends keyof GroupProps
                    ? true
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof GroupProps
        ? "color" extends keyof GroupProps
            ? "p" extends keyof GroupProps
                ? "m" extends keyof GroupProps
                    ? "w" extends keyof GroupProps
                        ? "h" extends keyof GroupProps
                            ? "gap" extends keyof GroupProps
                                ? true
                                : false
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _orientation: GroupProps["orientation"] = "horizontal";
const _attached: GroupProps["attached"] = true;
const _stacking: GroupProps["stacking"] = "first-on-top";

const _recipeProps: _HasRecipeProps = true;
const _layoutProps: _HasLayoutProps = true;
const _styleProps: _HasStyleProps = true;

void (_recipeProps && _layoutProps && _styleProps && _orientation && _attached && _stacking);

assertType<GroupProps>({
    orientation: "vertical",
    attached: true,
    grow: true,
    stacking: "last-on-top",
    align: "center",
    justify: "flex-start",
    direction: "row",
    wrap: "nowrap",
    skip: function skipChild() {
        return false;
    },
    role: "group",
    "aria-label": "Text alignment",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto",
    gap: 2,
    className: "custom-group",
    children: "content"
});

assertType<GroupProps>({
    // @ts-expect-error invalid orientation
    orientation: "diagonal"
});

assertType<GroupProps>({
    // @ts-expect-error invalid stacking
    stacking: "middle-on-top"
});
