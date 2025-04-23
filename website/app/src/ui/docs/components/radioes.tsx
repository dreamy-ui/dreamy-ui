import { Radio, RadioCard, RadioGroup } from "@dreamy-ui/react";
import { Group } from "@dreamy-ui/react/rsc";
import { useState } from "react";

export function ControlledRadios() {
    const [value, setValue] = useState<string | number>("rr");

    return (
        <RadioGroup
            value={value}
            onChange={setValue}
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
            value={value}
            onChange={setValue}
            full
        >
            <Group
                full
                wrapped
            >
                <RadioCard
                    full
                    value="rr"
                    title="React Router"
                    description="Description for React Router"
                />
                <RadioCard
                    full
                    value="next"
                    title="Next.js"
                    description="Description for Next.js"
                />
                <RadioCard
                    full
                    value="vue"
                    title="Vue.js"
                    description="Description for Vue.js"
                />
            </Group>
        </RadioGroup>
    );
}
