import { Group, Radio, RadioCard, RadioGroup } from "@/ui";
import { useState } from "react";

export function ControlledRadios() {
    const [value, setValue] = useState<string | null>("rr");

    return (
        <RadioGroup
            onValueChange={(next) => setValue(next)}
            value={value}
        >
            <Radio value="rr">React Router</Radio>
            <Radio value="next">Next.js</Radio>
            <Radio value="vue">Vue.js</Radio>
        </RadioGroup>
    );
}

export function ControlledRadioCards() {
    const [value, setValue] = useState<string | null>("rr");

    return (
        <RadioGroup
            full
            onValueChange={(next) => setValue(next)}
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
