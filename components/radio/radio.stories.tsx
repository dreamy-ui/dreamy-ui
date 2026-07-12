import { Radio, RadioGroup, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Radio"
} satisfies Meta;

export function Base() {
    return <Radio defaultChecked>Default</Radio>;
}

export function RadioGroup_() {
    return (
        <RadioGroup defaultValue={1}>
            <Radio value={1}>First</Radio>
            <Radio value={2}>Second</Radio>
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
    const [value, setValue] = useState<string | number>("rr");

    return (
        <>
            <Text>Selected: {value}</Text>
            <RadioGroup
                onChange={setValue}
                value={value}
            >
                <Radio value="rr">React Router</Radio>
                <Radio value="next">Next.js</Radio>
                <Radio value="vue">Vue.js</Radio>
            </RadioGroup>
        </>
    );
}
