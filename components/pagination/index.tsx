"use client";

import type { DreamyHostProps } from "@dreamy-ui/react";
import {
    Pagination as UiSdkPagination,
    PaginationEllipsis as UiSdkPaginationEllipsis,
    PaginationFirst as UiSdkPaginationFirst,
    PaginationItem as UiSdkPaginationItem,
    PaginationLast as UiSdkPaginationLast,
    PaginationLink as UiSdkPaginationLink,
    PaginationList as UiSdkPaginationList,
    PaginationNext as UiSdkPaginationNext,
    PaginationPrevious as UiSdkPaginationPrevious,
    type PaginationOptions,
    type PaginationRangeItem,
    createPaginationController
} from "@ui-sdk/react/pagination";
import * as m from "motion/react-m";
import type React from "react";
import {
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    createContext,
    useContext,
    useMemo
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import {
    type ButtonVariantProps,
    type PaginationVariantProps,
    button,
    pagination
} from "styled-system/recipes";
import { Icon } from "../icon";

const { withProvider, withContext } = createStyleContext(pagination, {
    forwardVariants: ["size"]
});

export { createPaginationController };

export interface PaginationTranslations {
    rootLabel: string;
    firstTriggerLabel: string;
    prevTriggerLabel: string;
    nextTriggerLabel: string;
    lastTriggerLabel: string;
    itemLabel: (details: { page: number; pageCount: number }) => string;
}

const DEFAULT_TRANSLATIONS: PaginationTranslations = {
    rootLabel: "Pagination",
    firstTriggerLabel: "First page",
    prevTriggerLabel: "Previous page",
    nextTriggerLabel: "Next page",
    lastTriggerLabel: "Last page",
    itemLabel: ({ page }) => `Page ${page}`
};

export interface PaginationContextValue {
    page: number;
    pageCount: number;
    items: PaginationRangeItem[];
    pageSize: number;
    total: number;
}

interface PaginationUIContextValue extends PaginationContextValue {
    size: ButtonVariantProps["size"];
    translations: PaginationTranslations;
}

const PaginationUIContext = createContext<PaginationUIContextValue>({
    size: "md",
    translations: DEFAULT_TRANSLATIONS,
    page: 1,
    pageCount: 1,
    items: [1],
    pageSize: 10,
    total: 0
});

export interface PaginationRootProps
    extends PaginationOptions,
        PaginationVariantProps,
        DreamyHostProps<HTMLDreamyProps<"nav">, PaginationOptions, "size"> {
    translations?: Partial<PaginationTranslations>;
    children?: ReactNode;
}

type PaginationRootBaseProps = PaginationOptions &
    PaginationVariantProps &
    Omit<React.ComponentPropsWithoutRef<"nav">, keyof PaginationOptions | "size"> & {
        translations?: Partial<PaginationTranslations>;
        children?: ReactNode;
    };

function PaginationRoot(props: PaginationRootBaseProps) {
    const {
        size = "md",
        translations: translationsProp,
        page,
        defaultPage,
        onPageChange,
        pageCount,
        total,
        pageSize,
        siblings,
        boundaries,
        getHref,
        controller,
        debug,
        "aria-label": ariaLabel,
        className,
        style,
        children,
        ...rest
    } = props;

    const translations = useMemo<PaginationTranslations>(
        () => ({ ...DEFAULT_TRANSLATIONS, ...translationsProp }),
        [translationsProp]
    );
    const [cssProps, domProps] = splitCssProps(rest);
    const resolvedPageSize = pageSize ?? 10;

    return (
        <UiSdkPagination
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkPagination>)}
            aria-label={(ariaLabel as string | undefined) ?? translations.rootLabel}
            boundaries={boundaries}
            className={cx(className as string | undefined, css(cssProps))}
            controller={controller}
            debug={debug}
            defaultPage={defaultPage}
            getHref={getHref}
            onPageChange={onPageChange}
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            siblings={siblings}
            style={style as CSSProperties | undefined}
            total={total}
        >
            {(state) => (
                <PaginationUIContext.Provider
                    value={{
                        size: size as ButtonVariantProps["size"],
                        translations,
                        page: state.page,
                        pageCount: state.pageCount,
                        items: state.items,
                        pageSize: resolvedPageSize,
                        total: total ?? state.pageCount * resolvedPageSize
                    }}
                >
                    <UiSdkPaginationList>{children}</UiSdkPaginationList>
                </PaginationUIContext.Provider>
            )}
        </UiSdkPagination>
    );
}

/**
 * Pagination component — navigate between pages of content powered by UI SDK.
 *
 * @see Docs https://dreamy-ui.com/docs/components/pagination
 *
 * @example
 * ```tsx
 * <Pagination.Root total={100} pageSize={10}>
 *   <Pagination.PrevTrigger />
 *   <Pagination.Items />
 *   <Pagination.NextTrigger />
 * </Pagination.Root>
 * ```
 */
export const Root: (props: PaginationRootProps) => React.JSX.Element = withProvider(
    PaginationRoot,
    "root",
    {
        // `page` is also a CSS property, so the style factory would strip it otherwise.
        forwardProps: ["page"]
    } as never
) as (props: PaginationRootProps) => React.JSX.Element;

export interface PaginationContextProps {
    children: (state: PaginationContextValue) => ReactNode;
}

/**
 * Render prop component that exposes the current pagination state (`page`, `pageCount`, `items`, `pageSize`, `total`).
 */
export function Context({ children }: PaginationContextProps) {
    const { page, pageCount, items, pageSize, total } = useContext(PaginationUIContext);
    return <>{children({ page, pageCount, items, pageSize, total })}</>;
}

export interface PaginationItemProps
    extends Omit<HTMLDreamyProps<"button">, "page" | "children" | "size"> {
    /**
     * The page number for this item (1-based).
     */
    page: number;
    render?: ReactElement;
    children?: ReactNode;
}

type PaginationItemBaseProps = Omit<React.ComponentPropsWithoutRef<"button">, "page" | "children" | "size"> & {
    page: number;
    render?: ReactElement;
    children?: ReactNode;
};

/**
 * Pagination Item — a single page number button or link.
 */
export const Item: (props: PaginationItemProps) => React.JSX.Element = withContext(
    function PaginationItem(props: PaginationItemBaseProps) {
    const { page: itemPage, render, children, className, style, ...rest } = props;
    const { size, translations, pageCount } = useContext(PaginationUIContext);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkPaginationItem>
            <UiSdkPaginationLink
                aria-label={translations.itemLabel({ page: itemPage, pageCount })}
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkPaginationLink>)}
                className={cx(
                    button({ variant: "ghost", size }),
                    className as string | undefined,
                    css(cssProps)
                )}
                data-type="icon-button"
                page={itemPage}
                render={render}
                style={style as CSSProperties | undefined}
            >
                {(state) => (
                    <>
                        {children ?? itemPage}
                        {state.current && <m.div data-part="indicator" />}
                    </>
                )}
            </UiSdkPaginationLink>
        </UiSdkPaginationItem>
    );
}, "item", {
    forwardProps: ["page"]
} as never) as (props: PaginationItemProps) => React.JSX.Element;

export interface PaginationEllipsisProps extends Omit<HTMLDreamyProps<"span">, "children"> {
    children?: ReactNode;
}

/**
 * Pagination Ellipsis — indicates skipped pages.
 */
export const Ellipsis = withContext(function PaginationEllipsis(props: PaginationEllipsisProps) {
    const { children = "…", className, style, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkPaginationItem>
            <UiSdkPaginationEllipsis
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkPaginationEllipsis>)}
                className={cx(className as string | undefined, css(cssProps))}
                style={style as CSSProperties | undefined}
            >
                {children}
            </UiSdkPaginationEllipsis>
        </UiSdkPaginationItem>
    );
}, "ellipsis");

export interface PaginationTriggerProps extends Omit<HTMLDreamyProps<"button">, "children" | "size"> {
    render?: ReactElement;
    children?: ReactNode;
}

export interface PaginationFirstTriggerProps extends PaginationTriggerProps {}
export interface PaginationPrevTriggerProps extends PaginationTriggerProps {}
export interface PaginationNextTriggerProps extends PaginationTriggerProps {}
export interface PaginationLastTriggerProps extends PaginationTriggerProps {}

/**
 * Pagination First Trigger — navigates to the first page.
 */
export const FirstTrigger = withContext(function PaginationFirstTrigger(
    props: PaginationFirstTriggerProps
) {
    const { children, render, className, style, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkPaginationItem>
            <UiSdkPaginationFirst
                aria-label={translations.firstTriggerLabel}
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkPaginationFirst>)}
                className={cx(
                    button({ variant: "ghost", size }),
                    className as string | undefined,
                    css(cssProps)
                )}
                data-type="icon-button"
                render={render}
                style={style as CSSProperties | undefined}
            >
                {children ?? <ChevronsLeftIcon />}
            </UiSdkPaginationFirst>
        </UiSdkPaginationItem>
    );
}, "firstTrigger");

/**
 * Pagination Prev Trigger — navigates to the previous page.
 */
export const PrevTrigger = withContext(function PaginationPrevTrigger(
    props: PaginationPrevTriggerProps
) {
    const { children, render, className, style, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkPaginationItem>
            <UiSdkPaginationPrevious
                aria-label={translations.prevTriggerLabel}
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkPaginationPrevious>)}
                className={cx(
                    button({ variant: "ghost", size }),
                    className as string | undefined,
                    css(cssProps)
                )}
                data-type="icon-button"
                render={render}
                style={style as CSSProperties | undefined}
            >
                {children ?? <ChevronLeftIcon />}
            </UiSdkPaginationPrevious>
        </UiSdkPaginationItem>
    );
}, "prevTrigger");

/**
 * Pagination Next Trigger — navigates to the next page.
 */
export const NextTrigger = withContext(function PaginationNextTrigger(
    props: PaginationNextTriggerProps
) {
    const { children, render, className, style, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkPaginationItem>
            <UiSdkPaginationNext
                aria-label={translations.nextTriggerLabel}
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkPaginationNext>)}
                className={cx(
                    button({ variant: "ghost", size }),
                    className as string | undefined,
                    css(cssProps)
                )}
                data-type="icon-button"
                render={render}
                style={style as CSSProperties | undefined}
            >
                {children ?? <ChevronRightIcon />}
            </UiSdkPaginationNext>
        </UiSdkPaginationItem>
    );
}, "nextTrigger");

/**
 * Pagination Last Trigger — navigates to the last page.
 */
export const LastTrigger = withContext(function PaginationLastTrigger(
    props: PaginationLastTriggerProps
) {
    const { children, render, className, style, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkPaginationItem>
            <UiSdkPaginationLast
                aria-label={translations.lastTriggerLabel}
                {...(domProps as unknown as React.ComponentProps<typeof UiSdkPaginationLast>)}
                className={cx(
                    button({ variant: "ghost", size }),
                    className as string | undefined,
                    css(cssProps)
                )}
                data-type="icon-button"
                render={render}
                style={style as CSSProperties | undefined}
            >
                {children ?? <ChevronsRightIcon />}
            </UiSdkPaginationLast>
        </UiSdkPaginationItem>
    );
}, "lastTrigger");

interface ChevronIconProps {
    title: string;
    paths: string[];
}

function ChevronIcon(props: ChevronIconProps) {
    const { title, paths } = props;

    return (
        <Icon
            aria-hidden="true"
            boxSize={"6"}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <title>{title}</title>
            {paths.map((d) => (
                <path
                    d={d}
                    key={d}
                />
            ))}
        </Icon>
    );
}

function ChevronsLeftIcon() {
    return (
        <ChevronIcon
            paths={["m11 17-5-5 5-5", "m18 17-5-5 5-5"]}
            title="First"
        />
    );
}

function ChevronLeftIcon() {
    return (
        <ChevronIcon
            paths={["m15 18-6-6 6-6"]}
            title="Previous"
        />
    );
}

function ChevronRightIcon() {
    return (
        <ChevronIcon
            paths={["m9 18 6-6-6-6"]}
            title="Next"
        />
    );
}

function ChevronsRightIcon() {
    return (
        <ChevronIcon
            paths={["m6 17 5-5-5-5", "m13 17 5-5-5-5"]}
            title="Last"
        />
    );
}

export interface PaginationPageTextProps extends HTMLDreamyProps<"span"> {
    /**
     * Format of the text
     * - "short": "1 / 10"
     * - "compact": "1 of 10"
     * - "long": "1-10 of 100"
     * @default "compact"
     */
    format?: "short" | "compact" | "long";
}

/**
 * Pagination Page Text — displays current page information.
 */
export function PageText(props: PaginationPageTextProps) {
    const { format = "compact", ...rest } = props;
    const { page, pageCount, pageSize, total } = useContext(PaginationUIContext);

    const content = useMemo(() => {
        if (format === "short") {
            return `${page} / ${pageCount}`;
        }
        if (format === "compact") {
            return `${page} of ${pageCount}`;
        }
        const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, total);
        return `${start}-${end} of ${total}`;
    }, [format, page, pageCount, pageSize, total]);

    return (
        <UiSdkPaginationItem>
            <dreamy.span {...rest}>{content}</dreamy.span>
        </UiSdkPaginationItem>
    );
}

export interface PaginationItemsProps {
    /**
     * Render function for custom page item content.
     */
    render?: (page: number) => ReactNode;
}

/**
 * Pagination Items — automatically renders page items and ellipses.
 */
export function Items(props: PaginationItemsProps) {
    const { render } = props;
    const { items } = useContext(PaginationUIContext);

    return (
        <>
            {items.map((item) => {
                if (typeof item !== "number") {
                    return <Ellipsis key={item} />;
                }

                return (
                    <Item
                        key={item}
                        page={item}
                    >
                        {render?.(item)}
                    </Item>
                );
            })}
        </>
    );
}
