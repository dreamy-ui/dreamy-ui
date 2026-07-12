import { Button, Group } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Group"
} satisfies Meta;

export function Base() {
    return (
        <Group>
            <Button variant="outline">Button 1</Button>
            <Button variant="outline">Button 2</Button>
            <Button variant="outline">Button 3</Button>
        </Group>
    );
}

export function Attached() {
    return (
        <Group attached>
            <Button variant="outline">Button 1</Button>
            <Button variant="outline">Button 2</Button>
            <Button variant="outline">Button 3</Button>
        </Group>
    );
}

export function Orientation() {
    return (
        <Group orientation="vertical">
            <Button variant="outline">Button 1</Button>
            <Button variant="outline">Button 2</Button>
            <Button variant="outline">Button 3</Button>
        </Group>
    );
}

export function Grow() {
    return (
        <Group
            full
            grow
        >
            <Button variant="outline">Button 1</Button>
            <Button variant="outline">Button 2</Button>
            <Button variant="outline">Button 3</Button>
        </Group>
    );
}
