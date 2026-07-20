import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ListVariantProps, list } from "styled-system/recipes";

export interface ListProps extends HTMLDreamyProps<"ol">, ListVariantProps {
    ordered?: boolean;
    unordered?: boolean;
}

const StyledList = dreamy("ol", list);

/**
 * List component — ordered or unordered list container.
 *
 * @see Docs https://dreamy-ui.com/docs/components/list
 *
 * @example
 * ```tsx
 * <List.Root>
 *   <List.Item>First item</List.Item>
 *   <List.Item>Second item</List.Item>
 * </List.Root>
 * ```
 */
export function Root(props: ListProps) {
    const { ordered, unordered, ...rest } = props;

    if (ordered && unordered) console.warn("List cannot have both ordered and unordered props");

    return (
        <StyledList
            as={ordered ? "ol" : "ul"}
            data-type={ordered ? "ordered" : "unordered"}
            {...rest}
        />
    );
}

export interface ListItemProps extends HTMLDreamyProps<"li"> {}

/**
 * List Item — single entry in the list.
 */
export function Item(props: ListItemProps) {
    return <dreamy.li {...props} />;
}
