import { assertType } from "vitest";
import type { ListItemProps, ListProps } from "./index";

type ExpectTrue<T extends true> = T;

assertType<boolean | undefined>({} as ListProps["ordered"]);
assertType<boolean | undefined>({} as ListProps["unordered"]);

type _HasListFlags = ExpectTrue<
    "ordered" extends keyof ListProps
        ? "unordered" extends keyof ListProps
            ? true
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof ListProps
        ? "color" extends keyof ListProps
            ? "p" extends keyof ListProps
                ? "m" extends keyof ListProps
                    ? "w" extends keyof ListProps
                        ? "h" extends keyof ListProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasItemProps = ExpectTrue<"className" extends keyof ListItemProps ? true : false>;

const _listFlags: _HasListFlags = true;
const _styleProps: _HasStyleProps = true;
const _itemProps: _HasItemProps = true;

void (_listFlags && _styleProps && _itemProps);

assertType<ListProps>({
    ordered: true,
    unordered: false,
    "aria-label": "Items",
    className: "custom-list",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<ListItemProps>({
    className: "list-item",
    children: "Item",
    color: "fg",
    p: 1
});
