import type { HTMLDreamProps } from "@/utils/types";
import { type SkeletonVariantProps, skeleton } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";

export interface SkeletonProps extends HTMLDreamProps<"div">, SkeletonVariantProps {}

const StyledSkeleton = dreamy("div", skeleton);

/**
 * Skeleton component.
 *
 * @See Docs https://dream-ui.com/docs/components/skeleton
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
    return (
        <StyledSkeleton
            ref={ref}
            {...props}
        />
    );
});

export interface SkeletonTextProps extends SkeletonProps {
    /**
     * Number of lines to display.
     * @default 1
     */
    lines?: number;
}

/**
 * Skeleton Text component.
 *
 * @See Docs https://dream-ui.com/docs/components/skeleton
 */
export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>((props, ref) => {
    const { lines = 1, ...rest } = props;

    return (
        <div data-skeleton-text-wrapper>
            {Array.from({ length: lines }).map((_, index) => (
                <StyledSkeleton
                    data-skeleton-text
                    key={index}
                    ref={ref}
                    {...rest}
                />
            ))}
        </div>
    );
});
