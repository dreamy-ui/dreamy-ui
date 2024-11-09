import { dream } from "@/components/factory";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { type ListVariantProps, list } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";

// DTS build fails if I try to use generics and HTMLDreamProps generic in HTMLDreamProps has to be constant
export interface ListProps extends HTMLDreamProps<"ol">, ListVariantProps {
    ordered?: boolean;
    unordered?: boolean;
}

const StyledList = styled(dream.ol, list);

/**
 * List component
 *
 * @See Docs https://dream-ui.com/docs/components/list
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

const StyledListItem = styled(dream.li);

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>((props, ref) => {
    return (
        <StyledListItem
            ref={ref}
            {...props}
        />
    );
});
