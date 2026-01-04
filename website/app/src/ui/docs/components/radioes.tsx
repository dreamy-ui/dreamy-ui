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
                <RadioCard
                    description="Description for React Router"
                    full
                    title="React Router"
                    value="rr"
                />
                <RadioCard
                    description="Description for Next.js"
                    full
                    title="Next.js"
                    value="next"
                />
                <RadioCard
                    description="Description for Vue.js"
                    full
                    title="Vue.js"
                    value="vue"
                />
            </Group>
        </RadioGroup>
    );
}
