import { Accordion } from "@/ui";
import { useState } from "react";

const items = ["item-1", "item-2", "item-3"];

export function ControlledAccordion() {
    const [value, setValue] = useState<string[]>(["item-1"]);

    return (
        <Accordion.Root
            value={value}
            onValueChange={(details) => setValue(details.value)}
        >
            {items.map((itemValue, index) => (
                <Accordion.Item
                    key={itemValue}
                    value={itemValue}
                >
                    <Accordion.Trigger>Item {index + 1}</Accordion.Trigger>
                    <Accordion.Content>Hi!</Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}
