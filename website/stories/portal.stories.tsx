import { Portal } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Portal"
} satisfies Meta;

export function Base() {
    return (
        <Portal>
            <div>Hello from Portal</div>
        </Portal>
    );
}
