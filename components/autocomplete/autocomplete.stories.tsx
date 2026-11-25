import { Autocomplete, HStack, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";

const fruits = [
    { value: "strawberry", label: "Strawberry" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
    { value: "cherry", label: "Cherry" },
    { value: "mango", label: "Mango" }
];

export default {
    title: "Autocomplete"
} satisfies Meta;

export function Base() {
    return (
        <Autocomplete.Root
            items={fruits}
            width="xs"
        >
            <Autocomplete.Input placeholder="Search a fruit..." />
            <Autocomplete.Content />
        </Autocomplete.Root>
    );
}

export function Controlled() {
    const [value, setValue] = useState<string | null>("banana");

    return (
        <Autocomplete.Root
            items={fruits}
            onValueChange={(next) => setValue(next)}
            value={value}
            width="xs"
        >
            <Autocomplete.Input placeholder="Search a fruit..." />
            <Autocomplete.Content />
        </Autocomplete.Root>
    );
}

export function WithIcon() {
    return (
        <Autocomplete.Root
            items={fruits}
            width="xs"
        >
            <Autocomplete.Input
                icon={<LuSearch />}
                placeholder="Search a fruit..."
            />
            <Autocomplete.Content />
        </Autocomplete.Root>
    );
}

export function States() {
    return (
        <VStack align="start">
            <Autocomplete.Root
                defaultValue="strawberry"
                disabled
                items={fruits}
                width="xs"
            >
                <Autocomplete.Input placeholder="Disabled..." />
                <Autocomplete.Content />
            </Autocomplete.Root>
            <Autocomplete.Root
                defaultValue="banana"
                items={fruits}
                readOnly
                width="xs"
            >
                <Autocomplete.Input placeholder="Read only..." />
                <Autocomplete.Content />
            </Autocomplete.Root>
            <Autocomplete.Root
                invalid
                items={fruits}
                width="xs"
            >
                <Autocomplete.Input placeholder="Invalid..." />
                <Autocomplete.Content />
            </Autocomplete.Root>
        </VStack>
    );
}

export function Sizes() {
    return (
        <HStack wrapped>
            {(["sm", "md", "lg"] as const).map((size) => (
                <Autocomplete.Root
                    items={fruits}
                    key={size}
                    size={size}
                    width="xs"
                >
                    <Autocomplete.Input placeholder={`Size ${size}`} />
                    <Autocomplete.Content />
                </Autocomplete.Root>
            ))}
        </HStack>
    );
}
