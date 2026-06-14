"use client";

import {
    PaginationProvider,
    type UsePaginationProps,
    usePagination,
    usePaginationContext,
    usePaginationIndicator,
    usePaginationItem,
    usePaginationNextTrigger,
    usePaginationPrevTrigger,
    usePaginationRange
} from "@dreamy-ui/react";
import * as m from "motion/react-m";
import { forwardRef, useMemo } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { type PaginationVariantProps, pagination } from "styled-system/recipes";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";

const { withProvider, withContext } = createStyleContext(pagination, {
    forwardVariants: ["size"]
});

export interface PaginationRootProps
    extends Omit<UsePaginationProps, "size">,
        Omit<HTMLDreamyProps<"nav">, keyof UsePaginationProps>,
        PaginationVariantProps {}

/**
 * Pagination Root component - container for pagination controls
 *
 * @See Docs https://dreamy-ui.com/docs/components/pagination
 */
export const Root = withProvider(
    forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(props, ref) {
        const {
            children,
            count,
            page,
            defaultPage,
            pageSize,
            siblingCount,
            onPageChange,
            size = "md",
            ...rest
        } = props;

        const context = usePagination({
            count,
            page,
            defaultPage,
            pageSize,
            siblingCount,
            onPageChange,
            size: size as any
        });

        return (
            <PaginationProvider value={context}>
                <dreamy.nav
                    ref={ref}
                    {...rest}
                >
                    {children}
                </dreamy.nav>
            </PaginationProvider>
        );
    }),
    "root"
);

export interface PaginationItemProps extends Omit<Partial<IconButtonProps>, "value"> {
    /**
     * The page value for this item
     */
    value: number;
}

/**
 * Pagination Item component - represents a single page number
 */
export const Item = withContext(
    forwardRef<HTMLButtonElement, PaginationItemProps>(function PaginationItem(props, ref) {
        const { value, children, ...rest } = props;
        const itemProps = usePaginationItem({ value, ref });
        const indicatorProps = usePaginationIndicator();

        const { page, size } = usePaginationContext();

        return (
            <IconButton
                size={size}
                variant="ghost"
                {...itemProps}
                {...rest}
            >
                {children ?? value}
                {page === value && <m.div {...indicatorProps} />}
            </IconButton>
        );
    }),
    "item"
);

export interface PaginationEllipsisProps extends HTMLDreamyProps<"span"> {}

/**
 * Pagination Ellipsis component - indicates skipped pages
 */
export const Ellipsis = withContext(
    forwardRef<HTMLSpanElement, PaginationEllipsisProps>(function PaginationEllipsis(props, ref) {
        const { children = "...", ...rest } = props;
        return (
            <dreamy.span
                aria-hidden="true"
                ref={ref}
                {...rest}
            >
                {children}
            </dreamy.span>
        );
    }),
    "ellipsis"
);

export interface PaginationPrevTriggerProps extends Partial<IconButtonProps> {}

/**
 * Pagination Prev Trigger component - navigates to previous page
 */
export const PrevTrigger = withContext(
    forwardRef<HTMLButtonElement, PaginationPrevTriggerProps>(
        function PaginationPrevTrigger(props, ref) {
            const { children, ...rest } = props;
            const prevProps = usePaginationPrevTrigger({ ref });

            const { size } = usePaginationContext();

            return (
                <IconButton
                    size={size}
                    variant="ghost"
                    {...prevProps}
                    {...rest}
                >
                    {children ?? <ChevronLeftIcon />}
                </IconButton>
            );
        }
    ),
    "prevTrigger"
);

export interface PaginationNextTriggerProps extends Partial<IconButtonProps> {}

/**
 * Pagination Next Trigger component - navigates to next page
 */
export const NextTrigger = withContext(
    forwardRef<HTMLButtonElement, PaginationNextTriggerProps>(
        function PaginationNextTrigger(props, ref) {
            const { children, ...rest } = props;
            const nextProps = usePaginationNextTrigger({ ref });

            const { size } = usePaginationContext();

            return (
                <IconButton
                    size={size}
                    variant="ghost"
                    {...nextProps}
                    {...rest}
                >
                    {children ?? <ChevronRightIcon />}
                </IconButton>
            );
        }
    ),
    "nextTrigger"
);

function ChevronLeftIcon() {
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
            <title>Previous</title>
            <path d="m15 18-6-6 6-6" />
        </Icon>
    );
}

function ChevronRightIcon() {
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
            <title>Next</title>
            <path d="m9 18 6-6-6-6" />
        </Icon>
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
 * Pagination Page Text component - displays current page information
 */
export const PageText = forwardRef<HTMLSpanElement, PaginationPageTextProps>(
    function PaginationPageText(props, ref) {
        const { format = "compact", ...rest } = props;
        const context = usePaginationContext();
        const { page, totalPages, pageSize, count } = context;

        const content = useMemo(() => {
            if (format === "short") {
                return `${page} / ${totalPages}`;
            }
            if (format === "compact") {
                return `${page} of ${totalPages}`;
            }
            const start = (page - 1) * pageSize + 1;
            const end = Math.min(page * pageSize, count);
            return `${start}-${end} of ${count}`;
        }, [format, page, totalPages, pageSize, count]);

        return (
            <dreamy.span
                ref={ref}
                {...rest}
            >
                {content}
            </dreamy.span>
        );
    }
);

export interface PageItem {
    /**
     * The page number
     */
    value: number;
    /**
     * The type of the page item
     */
    type: "page" | "ellipsis";
}

export interface PaginationItemsProps {
    /**
     * Render function for page items
     */
    render?: (page: PageItem) => React.ReactNode;
}

/**
 * Pagination Items component - automatically renders page items and ellipsis
 *
 * This is a shortcut component that handles the rendering of pagination items.
 * It uses the pagination context to determine which pages to show and automatically
 * inserts ellipsis where needed based on the sibling count.
 *
 * @example
 * ```tsx
 * <Pagination.Items
 *   render={(page) => (
 *     <IconButton variant="ghost" _selected={{
 *       bg: "primary.500",
 *       color: "primary.fg",
 *     }}>
 *       {page.value}
 *     </IconButton>
 *   )}
 * />
 * ```
 *
 * @See Docs https://dreamy-ui.com/docs/components/pagination
 */
export function Items(props: PaginationItemsProps) {
    const { render } = props;
    const context = usePaginationContext();
    const { page, totalPages, siblingCount } = context;

    const pages = usePaginationRange({
        page,
        totalPages,
        siblingCount
    });

    return (
        <>
            {pages.map((pageItem, index) => {
                if (pageItem.type === "ellipsis") {
                    return <Ellipsis key={`ellipsis-${index}`} />;
                }

                if (render) {
                    return (
                        <Item
                            key={pageItem.value}
                            value={pageItem.value}
                        >
                            {render(pageItem)}
                        </Item>
                    );
                }

                return (
                    <Item
                        key={pageItem.value}
                        value={pageItem.value}
                    />
                );
            })}
        </>
    );
}
