import { Box } from "@/components/box";
import type { HTMLDreamProps } from "@/utils/types";
import { cloneElement, isValidElement } from "react";

interface Props extends HTMLDreamProps<"span"> {}

export function ButtonIcon(props: Props) {
    const { children, className, ...rest } = props;

    const _children = isValidElement(children)
        ? cloneElement<any>(children, {
              "aria-hidden": true,
              focusable: false
          })
        : children;

    return (
        <Box
            as={"span"}
            {...rest}
        >
            {_children}
        </Box>
    );
}
