import { CloseButton } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Close Button"
} satisfies Meta;

export function Base() {
    return (
        <CloseButton
            aria-label="Close Modal"
            w="fit-content"
        />
    );
}
