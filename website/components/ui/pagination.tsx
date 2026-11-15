"use client";

import {
    Pagination as ArkPagination,
    type PaginationEllipsisProps as ArkPaginationEllipsisProps,
    type PaginationRootProps as ArkPaginationRootProps,
    usePaginationContext
} from "@ark-ui/react/pagination";
import * as m from "motion/react-m";
import { createContext, useContext, useId, useMemo } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type PaginationVariantProps, pagination } from "styled-system/recipes";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";

const { withProvider, withContext } = createStyleContext(pagination, {
    forwardVariants: ["size"]
});

type PaginationTranslations = Required<NonNullable<ArkPaginationRootProps["translations"]>>;

const DEFAULT_TRANSLATIONS: PaginationTranslations = {
    rootLabel: "Pagination",
    firstTriggerLabel: "First page",
    prevTriggerLabel: "Previous page",
    nextTriggerLabel: "Next page",
    lastTriggerLabel: "Last page",
    itemLabel: ({ page }) => `Page ${page}`
};

interface PaginationUIContextValue {
    size: IconButtonProps["size"];
    translations: PaginationTranslations;
}

const PaginationUIContext = createContext<PaginationUIContextValue>({
    size: "md",
    translations: DEFAULT_TRANSLATIONS
});

export interface PaginationRootProps
    extends Omit<ArkPaginationRootProps, "type" | "getPageUrl">,
        Omit<HTMLDreamyProps<"nav">, keyof ArkPaginationRootProps>,
        PaginationVariantProps {}

/**
 * Pagination component — navigate between pages of content.
 *
 * @see Docs https://dreamy-ui.com/docs/components/pagination
 *
 * @example
 * ```tsx
 * <Pagination.Root count={100} pageSize={10}>
 *   <Pagination.PrevTrigger />
 *   <Pagination.Items />
 *   <Pagination.NextTrigger />
 * </Pagination.Root>
 * ```
 */
export const Root = withProvider(function PaginationRoot(props: PaginationRootProps) {
    const { size = "md", translations: translationsProp, ...rest } = props;

    const translations = useMemo(
        () => ({ ...DEFAULT_TRANSLATIONS, ...translationsProp }) as PaginationTranslations,
        [translationsProp]
    );

    const uiContext = useMemo(
        () => ({ size: size as PaginationUIContextValue["size"], translations }),
        [size, translations]
    );

    return (
        <PaginationUIContext.Provider value={uiContext}>
            <ArkPagination.Root
                translations={translations}
                {...rest}
            />
        </PaginationUIContext.Provider>
    );
}, "root", {
    // `page` is also a CSS property, so the style factory would strip it otherwise.
    forwardProps: ["page"]
});

/**
 * Render prop component that exposes the Ark pagination API (`page`, `pages`, `setPage`, ...).
 */
export const Context = ArkPagination.Context;

export interface PaginationItemProps extends Omit<Partial<IconButtonProps>, "value" | "type"> {
    /**
     * The page value for this item
     */
    value: number;
}

/**
 * Pagination Item — a single page number button.
 */
export const Item = withContext(function PaginationItem(props: PaginationItemProps) {
    const { value, children, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);
    const { page, totalPages } = usePaginationContext();

    return (
        <ArkPagination.Item
            asChild
            type="page"
            value={value}
        >
            <IconButton
                aria-label={translations.itemLabel({ page: value, totalPages })}
                size={size}
                variant="ghost"
                {...rest}
            >
                {children ?? value}
                {page === value && <m.div data-part="indicator" />}
            </IconButton>
        </ArkPagination.Item>
    );
}, "item");

export interface PaginationEllipsisProps
    extends Omit<HTMLDreamyProps<"span">, keyof ArkPaginationEllipsisProps>,
        Partial<Pick<ArkPaginationEllipsisProps, "index">> {
    children?: React.ReactNode;
}

/**
 * Pagination Ellipsis — indicates skipped pages.
 */
export const Ellipsis = withContext(function PaginationEllipsis(props: PaginationEllipsisProps) {
    const { children = "...", index, ...rest } = props;
    const fallbackId = useId();

    return (
        <ArkPagination.Ellipsis
            asChild
            index={index ?? 0}
        >
            <dreamy.span
                aria-hidden="true"
                {...(index === undefined && { id: fallbackId })}
                {...rest}
            >
                {children}
            </dreamy.span>
        </ArkPagination.Ellipsis>
    );
}, "ellipsis");

export interface PaginationFirstTriggerProps extends Partial<IconButtonProps> {}

/**
 * Pagination First Trigger - navigates to the first page.
 */
export const FirstTrigger = withContext(function PaginationFirstTrigger(
    props: PaginationFirstTriggerProps
) {
    const { children, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);

    return (
        <ArkPagination.FirstTrigger asChild>
            <IconButton
                aria-label={translations.firstTriggerLabel}
                size={size}
                variant="ghost"
                {...rest}
            >
                {children ?? <ChevronsLeftIcon />}
            </IconButton>
        </ArkPagination.FirstTrigger>
    );
}, "firstTrigger");

export interface PaginationPrevTriggerProps extends Partial<IconButtonProps> {}

/**
 * Pagination Prev Trigger — navigates to the previous page.
 */
export const PrevTrigger = withContext(function PaginationPrevTrigger(
    props: PaginationPrevTriggerProps
) {
    const { children, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);

    return (
        <ArkPagination.PrevTrigger asChild>
            <IconButton
                aria-label={translations.prevTriggerLabel}
                size={size}
                variant="ghost"
                {...rest}
            >
                {children ?? <ChevronLeftIcon />}
            </IconButton>
        </ArkPagination.PrevTrigger>
    );
}, "prevTrigger");

export interface PaginationNextTriggerProps extends Partial<IconButtonProps> {}

/**
 * Pagination Next Trigger — navigates to the next page.
 */
export const NextTrigger = withContext(function PaginationNextTrigger(
    props: PaginationNextTriggerProps
) {
    const { children, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);

    return (
        <ArkPagination.NextTrigger asChild>
            <IconButton
                aria-label={translations.nextTriggerLabel}
                size={size}
                variant="ghost"
                {...rest}
            >
                {children ?? <ChevronRightIcon />}
            </IconButton>
        </ArkPagination.NextTrigger>
    );
}, "nextTrigger");

export interface PaginationLastTriggerProps extends Partial<IconButtonProps> {}

/**
 * Pagination Last Trigger - navigates to the last page.
 */
export const LastTrigger = withContext(function PaginationLastTrigger(
    props: PaginationLastTriggerProps
) {
    const { children, ...rest } = props;
    const { size, translations } = useContext(PaginationUIContext);

    return (
        <ArkPagination.LastTrigger asChild>
            <IconButton
                aria-label={translations.lastTriggerLabel}
                size={size}
                variant="ghost"
                {...rest}
            >
                {children ?? <ChevronsRightIcon />}
            </IconButton>
        </ArkPagination.LastTrigger>
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
    const { page, totalPages, pageRange, count } = usePaginationContext();

    const content = useMemo(() => {
        if (format === "short") {
            return `${page} / ${totalPages}`;
        }
        if (format === "compact") {
            return `${page} of ${totalPages}`;
        }
        return `${pageRange.start + 1}-${pageRange.end} of ${count}`;
    }, [format, page, totalPages, pageRange, count]);

    return <dreamy.span {...rest}>{content}</dreamy.span>;
}

export interface PageItem {
    /**
     * The page number
     */
    value: number;
    /**
     * The type of the page item
     */
    type: "page";
}

export interface PaginationItemsProps {
    /**
     * Render function for page items
     */
    render?: (page: PageItem) => React.ReactNode;
}

/**
 * Pagination Items — automatically renders page items and ellipsis.
 */
export function Items(props: PaginationItemsProps) {
    const { render } = props;
    const { pages } = usePaginationContext();

    return (
        <>
            {pages.map((pageItem, index) => {
                if (pageItem.type === "ellipsis") {
                    return (
                        <Ellipsis
                            index={index}
                            key={`ellipsis-${index}`}
                        />
                    );
                }

                return (
                    <Item
                        key={pageItem.value}
                        value={pageItem.value}
                    >
                        {render?.(pageItem)}
                    </Item>
                );
            })}
        </>
    );
}
