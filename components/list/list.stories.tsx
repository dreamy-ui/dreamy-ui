import { List } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "List"
} satisfies Meta;

export function Base() {
    return (
        <List.Root>
            <List.Item>i5-10400f</List.Item>
            <List.Item>RTX 4060ti</List.Item>
            <List.Item>32GB RAM</List.Item>
        </List.Root>
    );
}

export function OrderedList() {
    return (
        <List.Root ordered>
            <List.Item>i5-10400f</List.Item>
            <List.Item>RTX 4060ti</List.Item>
            <List.Item>32GB RAM</List.Item>
        </List.Root>
    );
}
