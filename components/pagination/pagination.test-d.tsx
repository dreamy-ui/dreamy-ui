import type { ChangeDetails } from "@ui-sdk/core";
import type { PaginationPageChangeReason } from "@ui-sdk/react/pagination";
import { assertType } from "vitest";
import type {
    PaginationEllipsisProps,
    PaginationFirstTriggerProps,
    PaginationItemProps,
    PaginationLastTriggerProps,
    PaginationNextTriggerProps,
    PaginationPageTextProps,
    PaginationPrevTriggerProps,
    PaginationRootProps
} from "./index";

type ExpectTrue<T extends true> = T;
type KnownKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

assertType<number | undefined>({} as PaginationRootProps["total"]);
assertType<number | undefined>({} as PaginationRootProps["pageCount"]);
assertType<number | undefined>({} as PaginationRootProps["page"]);
assertType<number | undefined>({} as PaginationRootProps["defaultPage"]);
assertType<number | undefined>({} as PaginationRootProps["pageSize"]);
assertType<number | undefined>({} as PaginationRootProps["siblings"]);
assertType<number | undefined>({} as PaginationRootProps["boundaries"]);
assertType<((page: number) => string) | undefined>({} as PaginationRootProps["getHref"]);
assertType<
    ((page: number, details: ChangeDetails<PaginationPageChangeReason>) => void) | undefined
>({} as PaginationRootProps["onPageChange"]);

assertType<number>({} as PaginationItemProps["page"]);
assertType<"short" | "compact" | "long" | undefined>({} as PaginationPageTextProps["format"]);

const _size: PaginationRootProps["size"] = "md";

type _HasCallbackProps = ExpectTrue<
    "onPageChange" extends KnownKeys<PaginationRootProps> ? true : false
>;

type _HasRecipeProps = ExpectTrue<"size" extends KnownKeys<PaginationRootProps> ? true : false>;

type _HasNoLegacyProps = ExpectTrue<
    "count" extends KnownKeys<PaginationRootProps>
        ? false
        : "siblingCount" extends KnownKeys<PaginationRootProps>
          ? false
          : "boundaryCount" extends KnownKeys<PaginationRootProps>
            ? false
            : true
>;

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
                    ? PaginationFirstTriggerProps extends object
                        ? PaginationLastTriggerProps extends object
                            ? true
                            : false
                        : false
                    : false
                : false
            : false
        : false
>;

const _callbackProps: _HasCallbackProps = true;
const _recipeProps: _HasRecipeProps = true;
const _noLegacyProps: _HasNoLegacyProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_callbackProps && _recipeProps && _noLegacyProps && _styleProps && _partProps && _size);

assertType<PaginationRootProps>({
    total: 100,
    page: 1,
    defaultPage: 1,
    pageSize: 10,
    siblings: 1,
    boundaries: 1,
    getHref: (page) => `/posts?page=${page}`,
    onPageChange: () => {},
    translations: { nextTriggerLabel: "Next", itemLabel: ({ page }) => `Page ${page}` },
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

assertType<PaginationRootProps>({
    total: 10,
    // @ts-expect-error invalid size
    size: "3xl"
});
