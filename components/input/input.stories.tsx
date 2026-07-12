import { Field, Icon, Input, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { BiSearch } from "react-icons/bi";

export default {
    title: "Input"
} satisfies Meta;

export function Base() {
    return <Input placeholder="Enter your username" />;
}

export function Sizes() {
    return (
        <VStack w="full">
            <Input
                placeholder="Enter your username"
                size="sm"
            />
            <Input
                placeholder="Enter your username"
                size="md"
            />
            <Input
                placeholder="Enter your username"
                size="lg"
            />
        </VStack>
    );
}

export function Variants() {
    return (
        <VStack w="full">
            <Input
                placeholder="Enter your username"
                variant="outline"
            />
            <Input
                placeholder="Enter your username"
                variant="filled"
            />
            <Input
                placeholder="Enter your username"
                variant="flushed"
            />
            <Input
                placeholder="Enter your username"
                variant="filledOutline"
            />
        </VStack>
    );
}

export function Invalid() {
    return (
        <VStack w="full">
            <Input
                isInvalid
                placeholder="Enter your username"
                variant="outline"
            />
            <Input
                isInvalid
                placeholder="Enter your username"
                variant="filled"
            />
            <Input
                isInvalid
                placeholder="Enter your username"
                variant="flushed"
            />
            <Input
                isInvalid
                placeholder="Enter your username"
                variant="filledOutline"
            />
        </VStack>
    );
}

export function InputGroup_() {
    return (
        <>
            <Input.Group>
                <Input.StartAddon>
                    <Icon
                        as={<BiSearch />}
                        boxSize="5"
                        color="fg.medium"
                    />
                </Input.StartAddon>
                <Input
                    ps="10"
                    placeholder="Search for..."
                />
            </Input.Group>

            <Input.Group>
                <Input.Prefix>$</Input.Prefix>
                <Input placeholder="Product Price" />
            </Input.Group>

            <Input.Group>
                <Input.Prefix>https://</Input.Prefix>
                <Input placeholder="Domain" />
                <Input.Suffix>.com</Input.Suffix>
            </Input.Group>
        </>
    );
}

export function UsageWithField() {
    return (
        <Field.Root>
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
            <Field.Hint>Username should not contain special characters.</Field.Hint>
        </Field.Root>
    );
}
