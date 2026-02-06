import { Button, EmptyState, Group, List, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { HiColorSwatch } from "react-icons/hi";
import { LuShoppingCart } from "react-icons/lu";

export default {
    title: "EmptyState"
} satisfies Meta;

export function Base() {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <LuShoppingCart />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>Your cart is empty</EmptyState.Title>
                    <EmptyState.Description>
                        Explore our products and add items to your cart
                    </EmptyState.Description>
                </VStack>
            </EmptyState.Content>
        </EmptyState.Root>
    );
}

export function Sizes() {
    return (
        <VStack gap={8}>
            <EmptyState.Root size="sm">
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <LuShoppingCart />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>Your cart is empty</EmptyState.Title>
                        <EmptyState.Description>
                            Explore our products and add items to your cart
                        </EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>

            <EmptyState.Root size="md">
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <LuShoppingCart />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>Your cart is empty</EmptyState.Title>
                        <EmptyState.Description>
                            Explore our products and add items to your cart
                        </EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>

            <EmptyState.Root size="lg">
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <LuShoppingCart />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>Your cart is empty</EmptyState.Title>
                        <EmptyState.Description>
                            Explore our products and add items to your cart
                        </EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        </VStack>
    );
}

export function WithAction() {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <HiColorSwatch />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>Start adding tokens</EmptyState.Title>
                    <EmptyState.Description>
                        Add a new design token to get started
                    </EmptyState.Description>
                </VStack>
                <Group attached>
                    <Button>Create token</Button>
                    <Button variant="outline">Import</Button>
                </Group>
            </EmptyState.Content>
        </EmptyState.Root>
    );
}

export function WithList() {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <HiColorSwatch />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>No results found</EmptyState.Title>
                    <EmptyState.Description>
                        Try adjusting your search
                    </EmptyState.Description>
                </VStack>
                <List.Root variant="marker">
                    <List.Item>Try removing filters</List.Item>
                    <List.Item>Try different keywords</List.Item>
                </List.Root>
            </EmptyState.Content>
        </EmptyState.Root>
    );
}
