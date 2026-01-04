import { Checkbox, CheckboxGroup } from "@/ui";
import { CheckboxCard } from "@/ui";
import { VStack } from "@/ui";
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
            <VStack w="250px">
                <CheckboxCard
                    description="Description for Controlled"
                    isChecked={isChecked}
                    onChangeValue={setIsChecked}
                    title="Controlled"
                />
            </VStack>
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
                <VStack
                    align="stretch"
                    w="250px"
                >
                    <CheckboxCard
                        description="Description for Option 1"
                        title="Option 1"
                        value="1"
                    />
                    <CheckboxCard
                        description="Description for Option 2"
                        title="Option 2"
                        value="2"
                    />
                    <CheckboxCard
                        description="Description for Option 3"
                        title="Option 3"
                        value="3"
                    />
                </VStack>
            </CheckboxGroup>
        </>
    );
}
