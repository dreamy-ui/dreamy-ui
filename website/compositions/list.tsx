import { forwardRef } from "react";
import { type ListVariantProps, list } from "styled-system/recipes";
import { dreamy, HTMLDreamyProps } from "./factory";

// DTS build fails if I try to use generics and HTMLDreamProps generic in HTMLDreamProps has to be constant
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
export const List = forwardRef<HTMLOListElement | HTMLUListElement, ListProps>(
	(props, ref) => {
		const { ordered, unordered, ...rest } = props;

		if (ordered && unordered)
			console.warn("List cannot have both ordered and unordered props");

		return (
			<StyledList
				data-type={ordered ? "ordered" : "unordered"}
				as={ordered ? "ol" : "ul"}
				ref={ref}
				{...rest}
			/>
		);
	}
);

export interface ListItemProps extends HTMLDreamyProps<"li"> {}

const StyledListItem = dreamy.li;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
	(props, ref) => {
		return <StyledListItem ref={ref} {...props} />;
	}
);
