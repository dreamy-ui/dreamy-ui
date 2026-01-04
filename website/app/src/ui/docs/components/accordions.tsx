import { Accordion } from "@/ui";
import { useState } from "react";

export function ControlledAccordion() {
    const [value, setValue] = useState<number | number[]>(0);

    return (
        <Accordion.Root
            index={value}
            onChange={(i) => setValue(i)}
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <Accordion.Item key={index}>
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}
