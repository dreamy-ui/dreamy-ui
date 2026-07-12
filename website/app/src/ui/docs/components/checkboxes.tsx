import { Checkbox, CheckboxGroup } from "@/ui";
import { CheckboxCard } from "@/ui";
import { Group } from "@/ui";
import { Text } from "@/ui";
import { useState } from "react";

export function ControlledCheckbox() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <Checkbox
                isChecked={isChecked}
                onChangeValue={setIsChecked}
            >
                Controlled
            </Checkbox>
        </>
    );
}

export function ControlledCheckboxCard() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <CheckboxCard.Root
                full
                isChecked={isChecked}
                onChangeValue={setIsChecked}
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
    const [value, setValue] = useState<Array<string | number>>(["1"]);

    return (
        <>
            <Text>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                onChange={setValue}
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
    const [value, setValue] = useState<Array<string | number>>(["1"]);

    return (
        <>
            <Text mb={2}>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                onChange={setValue}
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
