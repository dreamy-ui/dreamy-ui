import { type HTMLDreamyProps, dreamy } from "styled-system/jsx";
import { type ListVariantProps, list } from "styled-system/recipes";

export interface ListProps extends HTMLDreamyProps<"ol">, ListVariantProps {
    ordered?: boolean;
    unordered?: boolean;
}

const StyledList = dreamy("ol", list);

/**
 * List component
 *
 * @See Docs https://dreamy-ui.com/docs/components/list
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
 * ListItem component
 *
 * @See Docshttps://dreamy-ui.com/docs/components/list
 */
export function Item(props: ListItemProps) {
    return <dreamy.li {...props} />;
}
