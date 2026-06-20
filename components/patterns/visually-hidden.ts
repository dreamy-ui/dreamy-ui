import { definePattern } from "@pandacss/dev";

export const visuallyHidden = definePattern({
    jsx: ["VisuallyHidden", "VisuallyHiddenInput"],
    transform(props) {
        return {
            srOnly: true,
            ...props
        };
    }
});
