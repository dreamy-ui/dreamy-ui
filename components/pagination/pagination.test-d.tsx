import { assertType } from "vitest";
import type {
    PaginationEllipsisProps,
    PaginationItemProps,
    PaginationNextTriggerProps,
    PaginationPageTextProps,
    PaginationPrevTriggerProps,
    PaginationRootProps
} from "./index";

type ExpectTrue<T extends true> = T;

assertType<number>({} as PaginationRootProps["count"]);
assertType<number | undefined>({} as PaginationRootProps["page"]);
assertType<number | undefined>({} as PaginationRootProps["defaultPage"]);
assertType<number | undefined>({} as PaginationRootProps["pageSize"]);
assertType<number | undefined>({} as PaginationRootProps["siblingCount"]);
assertType<((details: { page: number }) => void) | undefined>(
    {} as PaginationRootProps["onPageChange"]
);

assertType<number>({} as PaginationItemProps["value"]);
assertType<"short" | "compact" | "long" | undefined>({} as PaginationPageTextProps["format"]);

const _size: PaginationRootProps["size"] = "md";

type _HasCallbackProps = ExpectTrue<"onPageChange" extends keyof PaginationRootProps ? true : false>;

type _HasRecipeProps = ExpectTrue<"size" extends keyof PaginationRootProps ? true : false>;

type _HasStyleProps = ExpectTrue<
    "bg" extends keyof PaginationRootProps
        ? "color" extends keyof PaginationRootProps
            ? "p" extends keyof PaginationRootProps
                ? "m" extends keyof PaginationRootProps
                    ? "w" extends keyof PaginationRootProps
                        ? "h" extends keyof PaginationRootProps
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

type _HasPartProps = ExpectTrue<
    PaginationItemProps extends object
        ? PaginationEllipsisProps extends object
            ? PaginationPrevTriggerProps extends object
                ? PaginationNextTriggerProps extends object
                    ? true
                    : false
                : false
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_callbackProps && _recipeProps && _styleProps && _partProps && _size);

assertType<PaginationRootProps>({
    count: 100,
    page: 1,
    defaultPage: 1,
    pageSize: 10,
    siblingCount: 1,
    onPageChange: () => {},
    size: "md",
    "aria-label": "Pagination",
    className: "custom-pagination",
    bg: "transparent",
    color: "fg",
    p: 2,
    m: 1,
    w: "fit-content",
    h: "auto"
});

assertType<PaginationRootProps["onPageChange"]>(
    // @ts-expect-error onPageChange receives page details, not a bare number
    (_page: number) => {}
);

assertType<PaginationRootProps>({
    count: 10,
    // @ts-expect-error invalid size
    size: "xl"
});
