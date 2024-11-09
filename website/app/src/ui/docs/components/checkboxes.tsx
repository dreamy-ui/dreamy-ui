import { Checkbox, CheckboxCard, CheckboxGroup } from "@dreamy-ui/react";
import { Text, VStack } from "@dreamy-ui/react/rsc";
import { useState } from "react";

export function CheckboxGroupControl() {
    const [value, setValue] = useState<Array<string | number>>(["1"]);

    return (
        <>
            <Text>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                value={value}
                onChange={setValue}
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
                value={value}
                onChange={setValue}
            >
                <VStack w="250px">
                    <CheckboxCard
                        value="1"
                        title="Option 1"
                        description="Description for Option 1"
                    />
                    <CheckboxCard
                        value="2"
                        title="Option 2"
                        description="Description for Option 2"
                    />
                    <CheckboxCard
                        value="3"
                        title="Option 3"
                        description="Description for Option 3"
                    />
                </VStack>
            </CheckboxGroup>
        </>
    );
}
