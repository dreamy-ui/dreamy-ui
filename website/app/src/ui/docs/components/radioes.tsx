import { Group } from "@/ui";
import { Radio, RadioGroup } from "@/ui";
import { RadioCard } from "@/ui";
import { useState } from "react";

export function ControlledRadios() {
    const [value, setValue] = useState<string | number>("rr");

    return (
        <RadioGroup
            onChange={setValue}
            value={value}
        >
            <Radio value="rr">React Router</Radio>
            <Radio value="next">Next.js</Radio>
            <Radio value="vue">Vue.js</Radio>
        </RadioGroup>
    );
}

export function ControlledRadioCards() {
    const [value, setValue] = useState<string | number>("rr");

    return (
        <RadioGroup
            full
            onChange={setValue}
            value={value}
        >
            <Group
                full
                wrapped
            >
                <RadioCard.Root
                    full
                    value="rr"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>React Router</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                    <RadioCard.Description>Description for React Router</RadioCard.Description>
                </RadioCard.Root>
                <RadioCard.Root
                    full
                    value="next"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Next.js</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                    <RadioCard.Description>Description for Next.js</RadioCard.Description>
                </RadioCard.Root>
                <RadioCard.Root
                    full
                    value="vue"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>Vue.js</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                    <RadioCard.Description>Description for Vue.js</RadioCard.Description>
                </RadioCard.Root>
            </Group>
        </RadioGroup>
    );
}
