import { Portal } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Portal/Docs"
} satisfies Meta;

export function Base() {
    return (
        <Portal>
            <div>Hello from Portal</div>
        </Portal>
    );
}
