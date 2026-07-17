import { dataAttr, splitProps } from "@dreamy-ui/react";
import { Children, cloneElement, isValidElement, useMemo } from "react";
import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type FlexProperties, flex } from "styled-system/patterns";
import { type GroupVariantProps, group } from "styled-system/recipes";

export interface GroupProps
    extends Omit<HTMLDreamyProps<"div">, keyof FlexProperties>,
        GroupVariantProps,
        Omit<FlexProperties, "grow"> {
    /**
     * A function that determines if a child should be skipped
     */
    skip?: (child: React.ReactElement) => boolean;
}

const StyledGroup = dreamy("div", group);

/**
 * Group component — groups related controls with shared styling.
 *
 * @see Docs https://dreamy-ui.com/docs/components/group
 *
 * @example
 * ```tsx
 * <Group attached>
 *   <Button>One</Button>
 *   <Button>Two</Button>
 * </Group>
 * ```
 */
export function Group({ children, skip, ...props }: GroupProps) {
    const [patternProps, restProps] = splitProps(props, [
        "align",
        "justify",
        "direction",
        "wrap",
        "basis",
        "shrink"
    ]);

    const styles = flex.raw(patternProps);

    const _children = useMemo(() => {
        const childArray = Children.toArray(children).filter(isValidElement);
        if (childArray.length === 1) return childArray;

        const validChildArray = childArray.filter((child) => !skip?.(child));
        const validChildCount = validChildArray.length;
        if (validChildArray.length === 1) return childArray;

        return childArray.map((child) => {
            const typedChild = child as React.ReactElement<{
                style?: React.CSSProperties;
                "data-group-item"?: string;
                "data-first"?: string | boolean;
                "data-last"?: string | boolean;
                "data-between"?: string | boolean;
            }>;
            const childProps = typedChild.props;
            if (skip?.(typedChild)) return typedChild;
            const index = validChildArray.indexOf(child);
            return cloneElement(typedChild, {
                ...childProps,
                "data-group-item": "",
                "data-first": dataAttr(index === 0),
                "data-last": dataAttr(index === validChildCount - 1),
                "data-between": dataAttr(index > 0 && index < validChildCount - 1),
                style: {
                    "--group-count": validChildCount,
                    "--group-index": index,
                    ...(childProps.style ?? {})
                } as React.CSSProperties
            });
        });
    }, [children, skip]);

    return (
        <StyledGroup
            {...styles}
            {...restProps}
        >
            {_children}
        </StyledGroup>
    );
}
