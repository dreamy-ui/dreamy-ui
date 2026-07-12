import { Editable, HStack, Text } from "@/ui";
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

export function DoubleClick() {
    return (
        <Editable.Root
            defaultValue="Meow"
            placeholder="Enter an animal sound"
            useDoubleClick
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
            onChange={setValue}
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
            {({ isEditing }) => {
                return (
                    <>
                        <Text>isEditing: {isEditing ? "true" : "false"}</Text>
                        <Editable.Preview />
                        <Editable.Input />
                        <HStack>
                            <Editable.EditButton />
                            <Editable.SubmitButton />
                            <Editable.CancelButton />
                        </HStack>
                    </>
                );
            }}
        </Editable.Root>
    );
}

export function IsPreviewFocusable() {
    return (
        <Editable.Root
            defaultValue="Meow"
            isPreviewFocusable={false}
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

export function SubmitOnBlur() {
    return (
        <Editable.Root
            defaultValue="Meow"
            placeholder="Enter an animal sound"
            submitOnBlur={false}
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

export function SelectAllOnFocus() {
    return (
        <Editable.Root
            defaultValue="Meow"
            placeholder="Enter an animal sound"
            selectAllOnFocus={false}
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
