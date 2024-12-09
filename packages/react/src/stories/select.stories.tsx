import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Select"
} satisfies Meta;

export function Base() {
    return (
        <Select>
            <SelectTrigger placeholder="Select a favorite fruit" />
            <SelectContent>
                <SelectItem value="strawberry">Strawberry</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
        </Select>
    );
}

export function Size() {
    return (
        <>
            <Select size="xs">
                <SelectTrigger placeholder="Select a favorite fruit" />
                <SelectContent>
                    <SelectItem value="strawberry">Strawberry</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
            </Select>
            <Select size="sm">
                <SelectTrigger placeholder="Select a favorite fruit" />
                <SelectContent>
                    <SelectItem value="strawberry">Strawberry</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
            </Select>
            <Select size="md">
                <SelectTrigger placeholder="Select a favorite fruit" />
                <SelectContent>
                    <SelectItem value="strawberry">Strawberry</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
            </Select>
            <Select size="lg">
                <SelectTrigger placeholder="Select a favorite fruit" />
                <SelectContent>
                    <SelectItem value="strawberry">Strawberry</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
            </Select>
        </>
    );
}
