import { dreamy } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef } from "react";
import { type ListVariantProps, list } from "styled-system/recipes";

// DTS build fails if I try to use generics and HTMLDreamProps generic in HTMLDreamProps has to be constant
export interface ListProps extends HTMLDreamProps<"ol">, ListVariantProps {
    ordered?: boolean;
    unordered?: boolean;
}

const StyledList = dreamy("ol", list);

/**
 * List component
 *
 * @See Docs https://dreamy-ui.com/docs/components/list
 */
export const List = forwardRef<HTMLOListElement | HTMLUListElement, ListProps>((props, ref) => {
    const { ordered, unordered, ...rest } = props;

    if (ordered && unordered) console.warn("List cannot have both ordered and unordered props");

    return (
        <StyledList
            data-type={ordered ? "ordered" : "unordered"}
            as={ordered ? "ol" : "ul"}
            ref={ref}
            {...rest}
        />
    );
});

export interface ListItemProps extends HTMLDreamProps<"li"> {}

const StyledListItem = dreamy.li;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>((props, ref) => {
    return (
        <StyledListItem
            ref={ref}
            {...props}
        />
    );
});
