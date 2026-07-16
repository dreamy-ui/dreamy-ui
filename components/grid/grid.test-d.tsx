import { assertType } from "vitest";
import type { GridItemProps, GridProps } from "./index";

type ExpectTrue<T extends true> = T;

type _HasGridLayoutProps = ExpectTrue<
    "gap" extends keyof GridProps
        ? "columnGap" extends keyof GridProps
            ? "rowGap" extends keyof GridProps
                ? "columns" extends keyof GridProps
                    ? "minChildWidth" extends keyof GridProps
                        ? true
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasGridItemProps = ExpectTrue<
    "colSpan" extends keyof GridItemProps
        ? "rowSpan" extends keyof GridItemProps
            ? "colStart" extends keyof GridItemProps
                ? "rowStart" extends keyof GridItemProps
                    ? "colEnd" extends keyof GridItemProps
                        ? "rowEnd" extends keyof GridItemProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof GridProps
        ? "color" extends keyof GridProps
            ? "p" extends keyof GridProps
                ? "m" extends keyof GridProps
                    ? "w" extends keyof GridProps
                        ? "h" extends keyof GridProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _columns: GridProps["columns"] = 3;
const _colSpan: GridItemProps["colSpan"] = 2;

const _gridLayout: _HasGridLayoutProps = true;
const _gridItem: _HasGridItemProps = true;
const _styleProps: _HasStyleProps = true;

void (_gridLayout && _gridItem && _styleProps && _columns && _colSpan);

assertType<GridProps>({
    gap: 4,
    columnGap: 2,
    rowGap: 2,
    columns: 3,
    minChildWidth: "200px",
    bg: "primary",
    color: "fg",
    p: 2,
    m: 1,
    w: "full",
    h: "auto",
    className: "custom-grid",
    children: "content"
});

assertType<GridItemProps>({
    colSpan: 2,
    rowSpan: 1,
    colStart: 1,
    rowStart: 1,
    colEnd: 3,
    rowEnd: 2,
    p: 2,
    bg: "bg"
});

assertType<GridProps>({
    // @ts-expect-error columns must be a number
    columns: "three"
});
