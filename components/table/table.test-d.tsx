import { assertType } from "vitest";
import type {
    TableCaptionProps,
    TableCellProps,
    TableColumnHeaderProps,
    TableRootProps,
    TableTableProps
} from "./index";

type ExpectTrue<T extends true> = T;

const _size: TableRootProps["size"] = "md";
const _variant: TableRootProps["variant"] = "simple";
const _scheme: TableRootProps["scheme"] = "primary";

assertType<boolean | undefined>({} as TableRootProps["interactive"]);
assertType<boolean | undefined>({} as TableRootProps["striped"]);
assertType<boolean | undefined>({} as TableRootProps["withBackground"]);
assertType<boolean | undefined>({} as TableRootProps["showColumnBorder"]);

type _HasRecipeProps = ExpectTrue<
    "size" extends keyof TableRootProps
        ? "variant" extends keyof TableRootProps
            ? "scheme" extends keyof TableRootProps
                ? true
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof TableRootProps
        ? "color" extends keyof TableRootProps
            ? "p" extends keyof TableRootProps
                ? "m" extends keyof TableRootProps
                    ? "w" extends keyof TableRootProps
                        ? "h" extends keyof TableRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    TableTableProps extends object
        ? TableColumnHeaderProps extends object
            ? TableCellProps extends object
                ? TableCaptionProps extends object
                    ? true
                    : false
                : false
            : false
        : false
>;

const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_recipeProps && _styleProps && _partProps && _size && _variant && _scheme);

assertType<TableRootProps>({
    size: "md",
    variant: "simple",
    scheme: "primary",
    interactive: true,
    striped: true,
    withBackground: true,
    showColumnBorder: true,
    className: "custom-table",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto"
});

assertType<TableRootProps>({
    // @ts-expect-error invalid size
    size: "xl"
});

assertType<TableRootProps>({
    // @ts-expect-error invalid variant
    variant: "card"
});
