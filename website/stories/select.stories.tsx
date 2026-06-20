import { Box, HStack, Select, Spinner, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { LuBanana, LuCherry, LuCitrus } from "react-icons/lu";

const fruits = [
    { value: "strawberry", label: "Strawberry" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" }
];

const fruitsWithIcons = [
    { value: "cherry", label: "Cherry", icon: <LuCherry /> },
    { value: "banana", label: "Banana", icon: <LuBanana /> },
    { value: "orange", label: "Orange", icon: <LuCitrus /> }
];

export default {
    title: "Select"
} satisfies Meta;

export function Base() {
    return (
        <Select.Root
            items={fruits}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}

export function Size() {
    return (
        <HStack>
            {(["xs", "sm", "md", "lg"] as const).map((size) => (
                <Select.Root
                    items={fruits}
                    key={size}
                    size={size}
                    width="xs"
                >
                    <Select.Trigger placeholder="Select a favorite fruit" />
                    <Select.Content />
                </Select.Root>
            ))}
        </HStack>
    );
}

export function TriggerVariant() {
    return (
        <HStack>
            {(["outline", "solid"] as const).map((triggerVariant) => (
                <Select.Root
                    items={fruits}
                    key={triggerVariant}
                    triggerVariant={triggerVariant}
                    width="xs"
                >
                    <Select.Trigger placeholder="Select a favorite fruit" />
                    <Select.Content />
                </Select.Root>
            ))}
        </HStack>
    );
}

export function Variant() {
    return (
        <HStack>
            {(["plain", "stretched"] as const).map((variant) => (
                <Select.Root
                    items={fruits}
                    key={variant}
                    variant={variant}
                    width="xs"
                >
                    <Select.Trigger placeholder="Select a favorite fruit" />
                    <Select.Content />
                </Select.Root>
            ))}
        </HStack>
    );
}

export function Controlled() {
    const [value, setValue] = useState<string>("strawberry");

    return (
        <Select.Root
            items={fruits}
            onChangeValue={setValue}
            value={value}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}

export function WithItems() {
    return (
        <Select.Root
            items={fruitsWithIcons}
            renderItem={(item) => (
                <HStack>
                    {item.icon}
                    <Text>{item.label}</Text>
                </HStack>
            )}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}

export function WithOneIcon() {
    return (
        <Select.Root
            items={fruitsWithIcons}
            width="xs"
        >
            <Select.Trigger
                icon={<LuCherry />}
                placeholder="Select a favorite fruit"
            />
            <Select.Content />
        </Select.Root>
    );
}

export function Clearable() {
    return (
        <Select.Root
            isClearable
            items={fruitsWithIcons}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}

export function Multiple() {
    return (
        <Select.Root
            isMultiple
            items={fruits}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}

export function CustomMultipleSelectedText() {
    return (
        <Select.Root
            isMultiple
            items={fruits}
            width="xs"
        >
            <Select.Trigger
                multipleSelectedText={(selected) => `${selected.length} selected`}
                placeholder="Select a favorite fruit"
            />
            <Select.Content />
        </Select.Root>
    );
}

export function AsyncLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<{ value: string; label: string }[]>([]);

    function fetchFruits() {
        if (items.length > 0) return;

        setIsLoading(true);
        setTimeout(() => {
            setItems([
                { value: "Cherry", label: "Cherry" },
                { value: "Banana", label: "Banana" },
                { value: "Orange", label: "Orange" }
            ]);
            setIsLoading(false);
        }, 1000);
    }

    return (
        <Box>
            <Select.Root
                items={items}
                onOpen={fetchFruits}
                width="xs"
            >
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content />
            </Select.Root>
            {isLoading && (
                <Spinner
                    color="primary"
                    py={4}
                />
            )}
        </Box>
    );
}

export function Virtualized() {
    const manyItems = Array.from({ length: 250 }, (_, index) => ({
        value: index.toString(),
        label: `Item ${index + 1}`
    }));

    return (
        <Select.Root
            items={manyItems}
            width="xs"
        >
            <Select.Trigger placeholder="Select a number" />
            <Select.VirtualContent />
        </Select.Root>
    );
}

export function CloseOnSelect() {
    return (
        <Select.Root
            closeOnSelect={false}
            items={fruits}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content />
        </Select.Root>
    );
}
