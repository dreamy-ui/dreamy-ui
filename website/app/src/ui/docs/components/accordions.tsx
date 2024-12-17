import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@dreamy-ui/react";
import { useState } from "react";

export function ControlledAccordion() {
    const [value, setValue] = useState<number | number[]>(0);

    return (
        <Accordion
            index={value}
            onChange={(i) => setValue(i)}
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <AccordionItem key={index}>
                    <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                    <AccordionContent>Hi!</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
