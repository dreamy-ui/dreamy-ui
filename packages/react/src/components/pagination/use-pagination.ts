import { useControllableState } from "@/hooks/use-controllable-state";
import { createContext } from "@/provider/create-context";
import { callAllHandlers } from "@/utils";
import { dataAttr } from "@/utils/attr";
import type { MotionProps } from "motion/react";
import { useCallback, useId, useMemo } from "react";

/* -------------------------------------------------------------------------------------------------
 * usePagination - The root react hook that manages pagination state
 * -----------------------------------------------------------------------------------------------*/

export interface UsePaginationProps {
    /**
     * The current page (1-indexed)
     */
    page?: number;
    /**
     * The default page (1-indexed, for uncontrolled mode)
     */
    defaultPage?: number;
    /**
     * Total number of items
     */
    count: number;
    /**
     * Number of items per page
     * @default 10
     */
    pageSize?: number;
    /**
     * Number of siblings to show on each side of the current page
     * @default 1
     */
    siblingCount?: number;
    /**
     * Callback when page changes
     */
    onPageChange?: (details: { page: number }) => void;
}

export function usePagination(props: UsePaginationProps) {
    const {
        count,
        pageSize = 10,
        siblingCount = 1,
        onPageChange,
        page: pageProp,
        defaultPage = 1
    } = props;

    const id = useId();

    const totalPages = Math.ceil(count / pageSize);

    const [page, setPage] = useControllableState({
        defaultValue: defaultPage,
        value: pageProp,
        onChange: (value) => {
            onPageChange?.({ page: value });
        }
    });

    const canGoPrev = page > 1;
    const canGoNext = page < totalPages;

    const goToPrevPage = useCallback(() => {
        if (canGoPrev) {
            setPage((prev) => prev - 1);
        }
    }, [canGoPrev, setPage]);

    const goToNextPage = useCallback(() => {
        if (canGoNext) {
            setPage((prev) => prev + 1);
        }
    }, [canGoNext, setPage]);

    const goToPage = useCallback(
        (pageNumber: number) => {
            const validPage = Math.min(Math.max(1, pageNumber), totalPages);
            setPage(validPage);
        },
        [totalPages, setPage]
    );

    return {
        page,
        totalPages,
        count,
        pageSize,
        siblingCount,
        canGoPrev,
        canGoNext,
        goToPrevPage,
        goToNextPage,
        goToPage,
        id
    };
}

export type UsePaginationReturn = ReturnType<typeof usePagination>;

export const [PaginationProvider, usePaginationContext] = createContext<UsePaginationReturn>({
    name: "PaginationContext",
    errorMessage:
        "usePaginationContext: `context` is undefined. Seems you forgot to wrap pagination components within <Pagination.Root />"
});

/* -------------------------------------------------------------------------------------------------
 * usePaginationItem - Hook for individual page items
 * -----------------------------------------------------------------------------------------------*/

export interface UsePaginationItemProps {
    /**
     * The page value for this item
     */
    value: number;
    /**
     * Ref to the button element
     */
    ref?: React.Ref<any>;
    /**
     * Click handler
     */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function usePaginationItem(props: UsePaginationItemProps) {
    const { value, onClick, ref } = props;
    const context = usePaginationContext();
    const isSelected = context.page === value;

    const handleClick = useCallback(
        (_e: React.MouseEvent<HTMLButtonElement>) => {
            context.goToPage(value);
        },
        [value, context]
    );

    return {
        ref,
        "aria-current": isSelected ? ("page" as const) : undefined,
        "aria-label": `Page ${value}`,
        "data-selected": dataAttr(isSelected),
        type: "button" as const,
        onClick: callAllHandlers(onClick, handleClick)
    };
}

export interface UsePaginationIndicatorProps extends MotionProps {
    ref?: React.Ref<any>;
}

export function usePaginationIndicator(props?: UsePaginationIndicatorProps) {
    const { id } = usePaginationContext();

    return {
        ...props,
        "data-part": "indicator",
        layoutId: `pagination-indicator-${id}`,
        layout: true
    } satisfies MotionProps & { "data-part": string };
}

/* -------------------------------------------------------------------------------------------------
 * usePaginationPrevTrigger - Hook for previous page button
 * -----------------------------------------------------------------------------------------------*/

export interface UsePaginationPrevTriggerProps {
    /**
     * Ref to the button element
     */
    ref?: React.Ref<any>;
    /**
     * Click handler
     */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function usePaginationPrevTrigger(props: UsePaginationPrevTriggerProps) {
    const { onClick, ref } = props;
    const context = usePaginationContext();
    const isDisabled = !context.canGoPrev;

    const handleClick = useCallback(
        (_e: React.MouseEvent<HTMLButtonElement>) => {
            if (!isDisabled) {
                context.goToPrevPage();
            }
        },
        [isDisabled, context]
    );

    return {
        ref,
        "aria-label": "Previous page",
        disabled: isDisabled,
        type: "button" as const,
        onClick: callAllHandlers(onClick, handleClick)
    };
}

/* -------------------------------------------------------------------------------------------------
 * usePaginationNextTrigger - Hook for next page button
 * -----------------------------------------------------------------------------------------------*/

export interface UsePaginationNextTriggerProps {
    /**
     * Ref to the button element
     */
    ref?: React.Ref<any>;
    /**
     * Click handler
     */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function usePaginationNextTrigger(props: UsePaginationNextTriggerProps) {
    const { onClick, ref } = props;
    const context = usePaginationContext();
    const isDisabled = !context.canGoNext;

    const handleClick = useCallback(
        (_e: React.MouseEvent<HTMLButtonElement>) => {
            if (!isDisabled) {
                context.goToNextPage();
            }
        },
        [isDisabled, context]
    );

    return {
        ref,
        "aria-label": "Next page",
        disabled: isDisabled,
        type: "button" as const,
        onClick: callAllHandlers(onClick, handleClick)
    };
}

/* -------------------------------------------------------------------------------------------------
 * usePaginationRange - Hook to calculate pagination range with ellipsis
 * -----------------------------------------------------------------------------------------------*/

export interface UsePaginationRangeOptions {
    /**
     * The current page (1-indexed)
     */
    page: number;
    /**
     * Total number of pages
     */
    totalPages: number;
    /**
     * Number of siblings to show on each side
     * @default 1
     */
    siblingCount?: number;
}

export function usePaginationRange(options: UsePaginationRangeOptions) {
    const { page, totalPages, siblingCount = 1 } = options;

    return useMemo(() => {
        const DOTS = "ellipsis" as const;

        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => ({
                type: "page" as const,
                value: i + 1
            }));
        }

        const leftSiblingIndex = Math.max(page - siblingCount, 1);
        const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => ({
                type: "page" as const,
                value: i + 1
            }));

            return [
                ...leftRange,
                { type: DOTS, value: 0 },
                { type: "page" as const, value: lastPageIndex }
            ];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from({ length: rightItemCount }, (_, i) => ({
                type: "page" as const,
                value: totalPages - rightItemCount + i + 1
            }));

            return [
                { type: "page" as const, value: firstPageIndex },
                { type: DOTS, value: 0 },
                ...rightRange
            ];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => ({
                    type: "page" as const,
                    value: leftSiblingIndex + i
                })
            );

            return [
                { type: "page" as const, value: firstPageIndex },
                { type: DOTS, value: 0 },
                ...middleRange,
                { type: DOTS, value: 0 },
                { type: "page" as const, value: lastPageIndex }
            ];
        }

        return [];
    }, [page, totalPages, siblingCount]);
}
