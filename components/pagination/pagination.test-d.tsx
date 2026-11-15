import type { PaginationPageChangeDetails } from "@ark-ui/react/pagination";
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

assertType<number | undefined>({} as PaginationRootProps["count"]);
assertType<number | undefined>({} as PaginationRootProps["page"]);
assertType<number | undefined>({} as PaginationRootProps["defaultPage"]);
assertType<number | undefined>({} as PaginationRootProps["pageSize"]);
assertType<number | undefined>({} as PaginationRootProps["defaultPageSize"]);
assertType<number | undefined>({} as PaginationRootProps["siblingCount"]);
assertType<number | undefined>({} as PaginationRootProps["boundaryCount"]);
assertType<((details: PaginationPageChangeDetails) => void) | undefined>(
    {} as PaginationRootProps["onPageChange"]
);

assertType<number>({} as PaginationItemProps["value"]);
assertType<number | undefined>({} as PaginationEllipsisProps["index"]);
assertType<"short" | "compact" | "long" | undefined>({} as PaginationPageTextProps["format"]);

const _size: PaginationRootProps["size"] = "md";

type _HasCallbackProps = ExpectTrue<"onPageChange" extends keyof PaginationRootProps ? true : false>;

type _HasRecipeProps = ExpectTrue<"size" extends keyof PaginationRootProps ? true : false>;

type _HasNoLinkProps = ExpectTrue<
    "getPageUrl" extends keyof PaginationRootProps ? false : true
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
const _noLinkProps: _HasNoLinkProps = true;
const _styleProps: _HasStyleProps = true;
const _partProps: _HasPartProps = true;

void (_callbackProps && _recipeProps && _noLinkProps && _styleProps && _partProps && _size);

assertType<PaginationRootProps>({
    count: 100,
    page: 1,
    defaultPage: 1,
    pageSize: 10,
    siblingCount: 1,
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

assertType<PaginationRootProps["onPageChange"]>(
    // @ts-expect-error onPageChange receives page details, not a bare number
    (_page: number) => {}
);

assertType<PaginationRootProps>({
    count: 10,
    // @ts-expect-error invalid size
    size: "3xl"
});
