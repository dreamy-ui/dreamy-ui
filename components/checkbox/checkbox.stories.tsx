import { Checkbox, CheckboxGroup, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Checkbox"
} satisfies Meta;

export function Base() {
    return <Checkbox>Default</Checkbox>;
}

export function Scheme() {
    return (
        <VStack>
            <Checkbox
                defaultChecked
                scheme="primary"
            >
                Primary
            </Checkbox>
            <Checkbox
                defaultChecked
                scheme="secondary"
            >
                Secondary
            </Checkbox>
            <Checkbox
                defaultChecked
                scheme="success"
            >
                Success
            </Checkbox>
            <Checkbox
                defaultChecked
                scheme="warning"
            >
                Warning
            </Checkbox>
            <Checkbox
                defaultChecked
                scheme="error"
            >
                Error
            </Checkbox>
            <Checkbox
                defaultChecked
                scheme="info"
            >
                Info
            </Checkbox>
            <Checkbox
                defaultChecked
                scheme="none"
            >
                None
            </Checkbox>
        </VStack>
    );
}

export function Variant() {
    return (
        <VStack>
            <Checkbox variant="outline">Outline</Checkbox>
            <Checkbox variant="solid">Solid</Checkbox>
        </VStack>
    );
}

export function Size() {
    return (
        <VStack>
            <Checkbox size="sm">Small</Checkbox>
            <Checkbox size="md">Medium</Checkbox>
            <Checkbox size="lg">Large</Checkbox>
        </VStack>
    );
}

export function Controlled() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <Checkbox
                isChecked={isChecked}
                onChangeValue={setIsChecked}
            >
                Controlled
            </Checkbox>
        </>
    );
}

export function CheckboxGroupControl() {
    const [value, setValue] = useState<Array<string | number>>(["1"]);

    return (
        <>
            <Text>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                onChange={setValue}
                value={value}
            >
                <Checkbox value="1">Option 1</Checkbox>
                <Checkbox value="2">Option 2</Checkbox>
                <Checkbox value="3">Option 3</Checkbox>
            </CheckboxGroup>
        </>
    );
}
