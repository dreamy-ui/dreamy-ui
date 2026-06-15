import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type SkeletonVariantProps, skeleton } from "styled-system/recipes";

export interface SkeletonProps extends HTMLDreamyProps<"div">, SkeletonVariantProps {}

const StyledSkeleton = dreamy("div", skeleton);

/**
 * Skeleton component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/skeleton
 */
export function Skeleton(props: SkeletonProps) {
    return <StyledSkeleton {...props} />;
}

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
 * @See Docs https://dreamy-ui.com/docs/components/skeleton
 */
export function SkeletonText(props: SkeletonTextProps) {
    const { lines = 1, ...rest } = props;

    return (
        <div data-skeleton-text-wrapper>
            {Array.from({ length: lines }).map((_, index) => (
                <StyledSkeleton
                    data-skeleton-text
                    key={index}
                    {...rest}
                />
            ))}
        </div>
    );
}
