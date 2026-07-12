import { Kbd } from "@/ui";
import { useActionKey } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Keyboard Key"
} satisfies Meta;

export function Base() {
    return <Kbd>^i</Kbd>;
}

export function Sizes() {
    return (
        <>
            <Kbd size="sm">Esc</Kbd>
            <Kbd size="md">Enter</Kbd>
            <Kbd size="lg">Space</Kbd>
        </>
    );
}

export function PlatformSpecificKbd() {
    const actionKey = useActionKey();

    return <Kbd>{actionKey} + K</Kbd>;
}
