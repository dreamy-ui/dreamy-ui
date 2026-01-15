import { HStack, Select, Spinner, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { LuBanana, LuCherry, LuCitrus } from "react-icons/lu";

export default {
    title: "Select"
} satisfies Meta;

export function Base() {
    return (
        <Select.Root width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                <Select.Item value="strawberry">Strawberry</Select.Item>
                <Select.Item value="banana">Banana</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}

export function Size() {
    return (
        <HStack>
            <Select.Root
                size="xs"
                width="xs"
            >
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content>
                    <Select.Item value="strawberry">Strawberry</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
            </Select.Root>
            <Select.Root
                size="sm"
                width="xs"
            >
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content>
                    <Select.Item value="strawberry">Strawberry</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
            </Select.Root>
            <Select.Root
                size="md"
                width="xs"
            >
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content>
                    <Select.Item value="strawberry">Strawberry</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
            </Select.Root>
            <Select.Root
                size="lg"
                width="xs"
            >
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content>
                    <Select.Item value="strawberry">Strawberry</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
            </Select.Root>
        </HStack>
    );
}

export function Variant() {
    return (
        <HStack>
            <Select.Root
                variant="outline"
                width="xs"
            >
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content>
                    <Select.Item value="strawberry">Strawberry</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
            </Select.Root>
            <Select.Root
                variant="solid"
                width="xs"
            >
                <Select.Trigger placeholder="Select a favorite fruit" />
                <Select.Content>
                    <Select.Item value="strawberry">Strawberry</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="orange">Orange</Select.Item>
                </Select.Content>
            </Select.Root>
        </HStack>
    );
}

export function Controlled() {
    const [value, setValue] = useState<string>("strawberry");

    return (
        <Select.Root
            onChangeValue={setValue}
            value={value}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                <Select.Item value="strawberry">Strawberry</Select.Item>
                <Select.Item value="banana">Banana</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}

export function WithOptionIcons() {
    return (
        <Select.Root width="xs">
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                <Select.Item value="cherry">
                    <HStack>
                        <LuCherry />
                        <Text>Cherry</Text>
                    </HStack>
                </Select.Item>
                <Select.Item value="banana">
                    <HStack>
                        <LuBanana />
                        <Text>Banana</Text>
                    </HStack>
                </Select.Item>
                <Select.Item value="orange">
                    <HStack>
                        <LuCitrus />
                        <Text>Orange</Text>
                    </HStack>
                </Select.Item>
            </Select.Content>
        </Select.Root>
    );
}

export function WithOneIcon() {
    return (
        <Select.Root width="xs">
            <Select.Trigger
                icon={<LuCherry />}
                placeholder="Select a favorite fruit"
            />
            <Select.Content>
                <Select.Item value="cherry">Cherry</Select.Item>
                <Select.Item value="banana">Banana</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}

export function Clearable() {
    return (
        <Select.Root
            isClearable
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                <Select.Item value="cherry">Cherry</Select.Item>
                <Select.Item value="banana">Banana</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}

export function Multiple() {
    return (
        <Select.Root
            isMultiple
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                <Select.Item value="strawberry">Strawberry</Select.Item>
                <Select.Item value="banana">Banana</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}

export function AsyncLoading() {
    const [isLoading, setIsLoading] = useState(true);
    const [fruits, setFruits] = useState<string[]>([]);

    function fetchFruits() {
        if (fruits.length > 0) return;

        setTimeout(() => {
            setFruits(["Cherry", "Banana", "Orange"]);
            setIsLoading(false);
        }, 1000);
    }

    return (
        <Select.Root
            onOpen={fetchFruits}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                {isLoading && (
                    <Spinner
                        color="primary"
                        py={4}
                    />
                )}
                {fruits.map((fruit) => (
                    <Select.Item
                        key={fruit}
                        value={fruit}
                    >
                        {fruit}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
}

export function Virtualized() {
    return (
        <Select.Root width="xs">
            <Select.Trigger placeholder="Select a number" />
            <Select.VirtualContent>
                {Array.from({ length: 250 }).map((_, index) => (
                    <Select.Item
                        key={index}
                        value={index.toString()}
                    >
                        Item {index + 1}
                    </Select.Item>
                ))}
            </Select.VirtualContent>
        </Select.Root>
    );
}

export function CloseOnSelect() {
    return (
        <Select.Root
            closeOnSelect={false}
            width="xs"
        >
            <Select.Trigger placeholder="Select a favorite fruit" />
            <Select.Content>
                <Select.Item value="strawberry">Strawberry</Select.Item>
                <Select.Item value="banana">Banana</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
            </Select.Content>
        </Select.Root>
    );
}
