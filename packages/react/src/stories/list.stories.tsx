import { List, ListItem } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "List"
} satisfies Meta;

export function Base() {
    return (
        <List>
            <ListItem>First</ListItem>
            <ListItem>Second</ListItem>
            <ListItem>Third</ListItem>
        </List>
    );
}

export function Ordered() {
    return (
        <List ordered>
            <ListItem>First</ListItem>
            <ListItem>Second</ListItem>
            <ListItem>Third</ListItem>
        </List>
    );
}
