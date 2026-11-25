import { Button, Field, HStack, Radio, RadioGroup, Text, VStack } from "@/ui";
import { createRadioGroupController } from "@dreamy-ui/components/radio";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";

export default {
    title: "Radio"
} satisfies Meta;

export function Base() {
    return (
        <Radio
            defaultChecked
            value="default"
        >
            Default
        </Radio>
    );
}

export function RadioGroup_() {
    return (
        <RadioGroup defaultValue="1">
            <Radio value="1">First</Radio>
            <Radio value="2">Second</Radio>
        </RadioGroup>
    );
}

export function Scheme() {
    return (
        <RadioGroup defaultValue="primary">
            <Radio
                scheme="primary"
                value="primary"
            >
                Primary
            </Radio>
            <Radio
                scheme="secondary"
                value="secondary"
            >
                Secondary
            </Radio>
            <Radio
                scheme="success"
                value="success"
            >
                Success
            </Radio>
            <Radio
                scheme="warning"
                value="warning"
            >
                Warning
            </Radio>
            <Radio
                scheme="error"
                value="error"
            >
                Error
            </Radio>
            <Radio
                scheme="info"
                value="info"
            >
                Info
            </Radio>
            <Radio
                scheme="none"
                value="none"
            >
                None
            </Radio>
        </RadioGroup>
    );
}

export function Size() {
    return (
        <RadioGroup defaultValue="md">
            <Radio
                size="sm"
                value="sm"
            >
                Small
            </Radio>
            <Radio
                size="md"
                value="md"
            >
                Medium
            </Radio>
            <Radio
                size="lg"
                value="lg"
            >
                Large
            </Radio>
        </RadioGroup>
    );
}

export function Controlled() {
    const [value, setValue] = useState<string>("rr");

    return (
        <>
            <Text>Selected: {value}</Text>
            <RadioGroup
                onValueChange={(next) => setValue(next ?? "")}
                value={value}
            >
                <Radio value="rr">React Router</Radio>
                <Radio value="next">Next.js</Radio>
                <Radio value="vue">Vue.js</Radio>
            </RadioGroup>
        </>
    );
}

export function ControllerAndReadOnly() {
    const [controller] = useState(() => createRadioGroupController<string>());
    const [value, setValue] = useState<string | null>("pro");

    return (
        <VStack
            align="start"
            gap={4}
        >
            <HStack gap={2}>
                <Button
                    onClick={() => controller.setValue("team")}
                    size="xs"
                    variant="outline"
                >
                    Choose Team
                </Button>
                <Button
                    onClick={() => controller.focus()}
                    size="xs"
                    variant="outline"
                >
                    Focus
                </Button>
            </HStack>
            <RadioGroup
                controller={controller}
                onValueChange={(next) => setValue(next)}
                value={value}
            >
                <Radio value="starter">Starter</Radio>
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
            <Field.Root>
                <Field.Label>Read-only plan</Field.Label>
                <RadioGroup
                    defaultValue="pro"
                    readOnly
                >
                    <Radio value="free">Free</Radio>
                    <Radio value="pro">Pro</Radio>
                </RadioGroup>
            </Field.Root>
        </VStack>
    );
}

export function CustomRender() {
    return (
        <RadioGroup
            aria-label="Notify me about"
            defaultValue="mentions"
            gap={2}
        >
            {[
                { value: "all", label: "Everything" },
                { value: "mentions", label: "Mentions" },
                { value: "none", label: "Nothing" }
            ].map((option) => (
                <Radio
                    key={option.value}
                    render={(props, state) => (
                        <Button
                            {...props}
                            justifyContent="space-between"
                            variant={state.checked ? "solid" : "outline"}
                            w="240px"
                        >
                            <span>{option.label}</span>
                            {state.checked ? <LuCheck /> : null}
                        </Button>
                    )}
                    value={option.value}
                />
            ))}
        </RadioGroup>
    );
}
