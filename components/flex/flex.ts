import { definePattern } from "@pandacss/dev";

export const flex = definePattern({
    jsx: ["Flex", "Group"],
    transform(props) {
        return {
            display: "flex",
            ...props
        };
    }
});
