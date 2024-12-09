import { Radio, RadioGroup } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Radio"
} satisfies Meta;

export function Base() {
    return (
        <RadioGroup>
            <Radio value={1}>First</Radio>
            <Radio value={2}>Second</Radio>
            <Radio value={3}>Third</Radio>
        </RadioGroup>
    );
}

export function Size() {
    return (
        <RadioGroup>
            <Radio
                value={1}
                size="sm"
            >
                Small
            </Radio>
            <Radio
                value={2}
                size="md"
            >
                Medium
            </Radio>
            <Radio
                value={3}
                size="lg"
            >
                Large
            </Radio>
        </RadioGroup>
    );
}

export function Schemes() {
    return (
        <RadioGroup>
            <Radio
                value={1}
                scheme="primary"
            >
                Primary
            </Radio>
            <Radio
                value={2}
                scheme="secondary"
            >
                Secondary
            </Radio>
            <Radio
                value={3}
                scheme="success"
            >
                Success
            </Radio>
            <Radio
                value={4}
                scheme="warning"
            >
                Warning
            </Radio>
            <Radio
                value={5}
                scheme="error"
            >
                Error
            </Radio>
            <Radio
                value={6}
                scheme="info"
            >
                Info
            </Radio>
        </RadioGroup>
    );
}
