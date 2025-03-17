import { splitProps } from "@/utils";
import { dataAttr } from "@/utils/attr";
import type { HTMLDreamProps } from "@/utils/types";
import { Children, cloneElement, forwardRef, isValidElement, useMemo } from "react";
import { type FlexProperties, flex } from "styled-system/patterns";
import { type GroupVariantProps, group } from "styled-system/recipes";
import { dreamy } from "../factory";

const StyledGroup = dreamy("div", group);

export interface GroupProps
    extends Omit<HTMLDreamProps<"div">, keyof FlexProperties>,
        GroupVariantProps,
        Omit<FlexProperties, "grow"> {
    /**
     * A function that determines if a child should be skipped
     */
    skip?: (child: React.ReactElement) => boolean;
}

export const Group = forwardRef<HTMLDivElement, GroupProps>(({ children, skip, ...props }, ref) => {
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
            const childProps = child.props as any;
            if (skip?.(child)) return child;
            const index = validChildArray.indexOf(child);
            return cloneElement(child, {
                ...childProps,
                "data-group-item": "",
                "data-first": dataAttr(index === 0),
                "data-last": dataAttr(index === validChildCount - 1),
                "data-between": dataAttr(index > 0 && index < validChildCount - 1),
                style: {
                    "--group-count": validChildCount,
                    "--group-index": index,
                    ...(childProps?.style ?? {})
                }
            } as any);
        });
    }, [children, skip]);

    return (
        <StyledGroup
            ref={ref}
            {...styles}
            {...restProps}
        >
            {_children}
        </StyledGroup>
    );
});

Group.displayName = "Group";
