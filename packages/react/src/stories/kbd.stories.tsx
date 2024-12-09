import { Kbd, VStack } from "@/components";
import { useActionKey } from "@/hooks";
import type { Meta } from "@storybook/react";

export default {
    title: "Kbd"
} satisfies Meta;

export function Base() {
    return <Kbd>Ctrl</Kbd>;
}

export function Sizes() {
    return (
        <VStack>
            <Kbd size="sm">Ctrl</Kbd>
            <Kbd size="md">Ctrl</Kbd>
            <Kbd size="lg">Ctrl</Kbd>
        </VStack>
    );
}

export function WithActionkeyHook() {
    const actionKey = useActionKey();

    return <Kbd>{actionKey}</Kbd>;
}
