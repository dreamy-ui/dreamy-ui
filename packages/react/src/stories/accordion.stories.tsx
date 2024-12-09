import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Accordion"
} satisfies Meta;

export function Base() {
    return (
        <Accordion>
            {Array.from({ length: 3 }).map((_, index) => (
                <AccordionItem key={index}>
                    <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                    <AccordionContent>Hi!</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export function Sizes() {
    return (
        <>
            <Accordion size={"sm"}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AccordionItem key={index}>
                        <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                        <AccordionContent>Hi!</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Accordion size={"md"}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AccordionItem key={index}>
                        <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                        <AccordionContent>Hi!</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Accordion size={"lg"}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AccordionItem key={index}>
                        <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                        <AccordionContent>Hi!</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </>
    );
}

export function Variants() {
    return (
        <>
            <Accordion variant={"outline"}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AccordionItem key={index}>
                        <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                        <AccordionContent>Hi!</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Accordion variant={"solid"}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AccordionItem key={index}>
                        <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                        <AccordionContent>Hi!</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Accordion variant={"subtle"}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AccordionItem key={index}>
                        <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                        <AccordionContent>Hi!</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </>
    );
}

export function AllowToggle() {
    return (
        <Accordion allowToggle>
            <AccordionItem>
                <AccordionTrigger>Item 1</AccordionTrigger>
                <AccordionContent>Hi!</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export function MultipleOpen() {
    return (
        <Accordion allowMultiple>
            {Array.from({ length: 3 }).map((_, index) => (
                <AccordionItem key={index}>
                    <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                    <AccordionContent>Hi!</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export function DefaultIndex() {
    return (
        <Accordion defaultIndex={[1]}>
            {Array.from({ length: 3 }).map((_, index) => (
                <AccordionItem key={index}>
                    <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                    <AccordionContent>Hi!</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
