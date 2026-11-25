import { Checkbox, CheckboxCard, CheckboxGroup, Group, Text } from "@/ui";
import { useState } from "react";

export function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
        <>
            <Text>Selected: {checked ? "true" : "false"}</Text>
            <Checkbox
                checked={checked}
                onCheckedChange={(next) => setChecked(next === true)}
            >
                Controlled
            </Checkbox>
        </>
    );
}

export function ControlledCheckboxCard() {
    const [checked, setChecked] = useState(false);

    return (
        <>
            <Text>Selected: {checked ? "true" : "false"}</Text>
            <CheckboxCard.Root
                checked={checked}
                full
                onCheckedChange={(next) => setChecked(next === true)}
            >
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Controlled</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
                <CheckboxCard.Description>Description for Controlled</CheckboxCard.Description>
            </CheckboxCard.Root>
        </>
    );
}

export function CheckboxGroupControl() {
    const [value, setValue] = useState<string[]>(["1"]);

    return (
        <>
            <Text>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                onValueChange={(next) => setValue(next)}
                value={value}
            >
                <Checkbox value="1">Option 1</Checkbox>
                <Checkbox value="2">Option 2</Checkbox>
                <Checkbox value="3">Option 3</Checkbox>
            </CheckboxGroup>
        </>
    );
}

export function CheckboxCardGroupControl() {
    const [value, setValue] = useState<string[]>(["1"]);

    return (
        <>
            <Text mb={2}>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                onValueChange={(next) => setValue(next)}
                value={value}
            >
                <Group
                    full
                    wrapped
                >
                    <CheckboxCard.Root
                        full
                        value="1"
                    >
                        <CheckboxCard.Header>
                            <CheckboxCard.Title>Option 1</CheckboxCard.Title>
                            <CheckboxCard.Checkbox />
                        </CheckboxCard.Header>
                        <CheckboxCard.Description>Description for Option 1</CheckboxCard.Description>
                    </CheckboxCard.Root>
                    <CheckboxCard.Root
                        full
                        value="2"
                    >
                        <CheckboxCard.Header>
                            <CheckboxCard.Title>Option 2</CheckboxCard.Title>
                            <CheckboxCard.Checkbox />
                        </CheckboxCard.Header>
                        <CheckboxCard.Description>Description for Option 2</CheckboxCard.Description>
                    </CheckboxCard.Root>
                    <CheckboxCard.Root
                        full
                        value="3"
                    >
                        <CheckboxCard.Header>
                            <CheckboxCard.Title>Option 3</CheckboxCard.Title>
                            <CheckboxCard.Checkbox />
                        </CheckboxCard.Header>
                        <CheckboxCard.Description>Description for Option 3</CheckboxCard.Description>
                    </CheckboxCard.Root>
                </Group>
            </CheckboxGroup>
        </>
    );
}
