import { Checkbox, Icon, VStack } from "@/components";
import type { Meta } from "@storybook/react";
import { BiPlus } from "react-icons/bi";

export default {
    title: "Checkbox"
} satisfies Meta;

export function Base() {
    return <Checkbox>Checkbox</Checkbox>;
}

export function Variants() {
    return (
        <VStack>
            <Checkbox variant="solid">Solid</Checkbox>
            <Checkbox variant="outline">Outline</Checkbox>
        </VStack>
    );
}

export function Sizes() {
    return (
        <VStack>
            <Checkbox size="sm">Small</Checkbox>
            <Checkbox size="md">Medium</Checkbox>
            <Checkbox size="lg">Large</Checkbox>
        </VStack>
    );
}

export function Schemes() {
    return (
        <VStack>
            <Checkbox scheme="primary">Primary</Checkbox>
            <Checkbox scheme="secondary">Secondary</Checkbox>
            <Checkbox scheme="success">Success</Checkbox>
            <Checkbox scheme="warning">Warning</Checkbox>
            <Checkbox scheme="error">Error</Checkbox>
            <Checkbox scheme="info">Info</Checkbox>
        </VStack>
    );
}

export function CustomIcon() {
    return (
        <Checkbox
            icon={
                <Icon
                    as={BiPlus}
                    /**
                     * this can be done via controlled checkbox to show/hide the icon and not rely on the color
                     */
                    color={"bg"}
                />
            }
        >
            Custom Icon
        </Checkbox>
    );
}
