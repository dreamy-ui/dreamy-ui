import { Editable, Flex, HStack, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Editable"
} satisfies Meta;

export function Base() {
    return (
        <Editable.Root
            defaultValue="Meow"
            placeholder="Enter an animal sound"
        >
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>
    );
}

export function Variants() {
    return (
        <HStack
            alignItems="flex-start"
            gap={8}
        >
            <Flex
                flexDirection="column"
                gap={1}
            >
                <Text
                    color="fg.medium"
                    fontSize="sm"
                >
                    plain
                </Text>
                <Editable.Root
                    defaultValue="Plain"
                    placeholder="Enter text"
                    variant="plain"
                >
                    <Editable.Preview />
                    <Editable.Input />
                </Editable.Root>
            </Flex>
            <Flex
                flexDirection="column"
                gap={1}
            >
                <Text
                    color="fg.medium"
                    fontSize="sm"
                >
                    soft
                </Text>
                <Editable.Root
                    defaultValue="Soft"
                    placeholder="Enter text"
                    variant="soft"
                >
                    <Editable.Preview />
                    <Editable.Input />
                </Editable.Root>
            </Flex>
        </HStack>
    );
}

export function DoubleClick() {
    return (
        <Editable.Root
            activationMode="dblclick"
            defaultValue="Meow"
            placeholder="Enter an animal sound"
        >
            <Editable.Preview />
            <Editable.Input />
        </Editable.Root>
    );
}

export function Controlled() {
    const [value, setValue] = useState("Meow");

    return (
        <Editable.Root
            onValueChange={setValue}
            value={value}
        >
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>
    );
}

export function AccessingInternalState() {
    return (
        <Editable.Root
            defaultValue="Meow"
            placeholder="Enter an animal sound"
        >
            {({ editing }) => (
                <>
                    <Text>editing: {editing ? "true" : "false"}</Text>
                    <Editable.Preview />
                    <Editable.Input />
                    <HStack>
                        <Editable.EditButton />
                        <Editable.SubmitButton />
                        <Editable.CancelButton />
                    </HStack>
                </>
            )}
        </Editable.Root>
    );
}

export function NonFocusablePreview() {
    return (
        <Editable.Root
            activationMode="none"
            defaultValue="Meow"
            placeholder="Enter an animal sound"
        >
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>
    );
}

export function SubmitEnterOnly() {
    return (
        <Editable.Root
            defaultValue="Meow"
            placeholder="Enter an animal sound"
            submitMode="enter"
        >
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>
    );
}

export function SelectOnFocusDisabled() {
    return (
        <Editable.Root
            defaultValue="Meow"
            placeholder="Enter an animal sound"
            selectOnFocus={false}
        >
            <Editable.Preview />
            <Editable.Input />
            <HStack>
                <Editable.EditButton />
                <Editable.SubmitButton />
                <Editable.CancelButton />
            </HStack>
        </Editable.Root>
    );
}
