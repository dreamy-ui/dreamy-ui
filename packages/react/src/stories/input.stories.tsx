import { Icon, Input, InputGroup, InputLeftAddon, VStack } from "@/components";
import type { Meta } from "@storybook/react";
import { BiSearch } from "react-icons/bi";

export default {
    title: "Input"
} satisfies Meta;

export function Base() {
    return <Input />;
}

export function WithPlaceholder() {
    return <Input placeholder="Enter your name" />;
}

export function Variants() {
    return (
        <VStack>
            <Input variant="filled" />
            <Input variant="outline" />
            <Input variant="flushed" />
        </VStack>
    );
}

export function InvalidVariants() {
    return (
        <VStack>
            <Input
                isInvalid
                variant="filled"
            />
            <Input
                isInvalid
                variant="outline"
            />
            <Input
                isInvalid
                variant="flushed"
            />
        </VStack>
    );
}

export function Sizes() {
    return (
        <VStack>
            <Input size="sm" />
            <Input size="md" />
            <Input size="lg" />
        </VStack>
    );
}

export function InputGroup_() {
    return (
        <InputGroup>
            <InputLeftAddon>
                <Icon
                    asComp={<BiSearch />}
                    boxSize="5"
                />
            </InputLeftAddon>
            <Input
                pl="10"
                placeholder="Search for..."
            />
        </InputGroup>
    );
}
