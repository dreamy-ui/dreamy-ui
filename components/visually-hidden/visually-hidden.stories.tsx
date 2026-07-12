import { Button, VisuallyHidden, VisuallyHiddenInput } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Visually Hidden"
} satisfies Meta;

export function Base() {
    return (
        <Button
            color="error"
            w="fit-content"
        >
            Destroy
            <VisuallyHidden>Content accessible only to screen readers</VisuallyHidden>
        </Button>
    );
}

export function Input() {
    return (
        <VisuallyHiddenInput
            name="intent"
            value="update"
        />
    );
}
