import { CheckboxCard, CheckboxGroup, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Checkbox Card"
} satisfies Meta;

export function Base() {
    return (
        <VStack w="250px">
            <CheckboxCard
                description="This is a description"
                title="Default Checkbox Card"
            />
        </VStack>
    );
}

export function Variant() {
    return (
        <VStack
            align="stretch"
            w="250px"
        >
            <CheckboxCard
                description="Description for Outline variant"
                title="Outline variant"
                variant="outline"
            />
            <CheckboxCard
                description="Description for Subtle variant"
                title="Subtle variant"
                variant="subtle"
            />
        </VStack>
    );
}

export function CheckboxVariant() {
    return (
        <VStack
            align="stretch"
            w="250px"
        >
            <CheckboxCard
                checkboxVariant="solid"
                description="Description for Solid variant"
                title="Solid variant"
            />
            <CheckboxCard
                checkboxVariant="outline"
                description="Description for Outline variant"
                title="Outline variant"
            />
        </VStack>
    );
}

export function Scheme() {
    return (
        <VStack
            align="stretch"
            w="250px"
        >
            <CheckboxCard
                defaultChecked
                description="Description for Primary"
                scheme="primary"
                title="Primary"
            />
            <CheckboxCard
                defaultChecked
                description="Description for Secondary"
                scheme="secondary"
                title="Secondary"
            />
            <CheckboxCard
                defaultChecked
                description="Description for Success"
                scheme="success"
                title="Success"
            />
            <CheckboxCard
                defaultChecked
                description="Description for Warning"
                scheme="warning"
                title="Warning"
            />
            <CheckboxCard
                defaultChecked
                description="Description for Error"
                scheme="error"
                title="Error"
            />
            <CheckboxCard
                defaultChecked
                description="Description for Info"
                scheme="info"
                title="Info"
            />
        </VStack>
    );
}

export function Size() {
    return (
        <VStack
            align="stretch"
            w="250px"
        >
            <CheckboxCard
                description="Description for Small"
                size="sm"
                title="Small"
            />
            <CheckboxCard
                description="Description for Medium"
                size="md"
                title="Medium"
            />
            <CheckboxCard
                description="Description for Large"
                size="lg"
                title="Large"
            />
        </VStack>
    );
}

export function Controlled() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <VStack
                align="stretch"
                w="250px"
            >
                <CheckboxCard
                    description="Description for Controlled"
                    isChecked={isChecked}
                    onChangeValue={setIsChecked}
                    title="Controlled"
                />
            </VStack>
        </>
    );
}

export function CheckboxCardGroup() {
    const [value, setValue] = useState<Array<string | number>>(["1"]);

    return (
        <>
            <Text>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                onChange={setValue}
                value={value}
            >
                <CheckboxCard
                    description="Description for Option 1"
                    title="Option 1"
                    value="1"
                />
                <CheckboxCard
                    description="Description for Option 2"
                    title="Option 2"
                    value="2"
                />
                <CheckboxCard
                    description="Description for Option 3"
                    title="Option 3"
                    value="3"
                />
            </CheckboxGroup>
        </>
    );
}
