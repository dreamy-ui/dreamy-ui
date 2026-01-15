import { Switch, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Switch"
} satisfies Meta;

export function Base() {
    return <Switch>Default</Switch>;
}

export function Scheme() {
    return (
        <VStack>
            <Switch
                defaultChecked
                scheme="primary"
            >
                Primary
            </Switch>
            <Switch
                defaultChecked
                scheme="secondary"
            >
                Secondary
            </Switch>
            <Switch
                defaultChecked
                scheme="success"
            >
                Success
            </Switch>
            <Switch
                defaultChecked
                scheme="warning"
            >
                Warning
            </Switch>
            <Switch
                defaultChecked
                scheme="error"
            >
                Error
            </Switch>
            <Switch
                defaultChecked
                scheme="info"
            >
                Info
            </Switch>
            <Switch
                defaultChecked
                scheme="none"
            >
                None
            </Switch>
        </VStack>
    );
}

export function Size() {
    return (
        <VStack>
            <Switch size="sm">Sm</Switch>
            <Switch size="md">Md</Switch>
            <Switch size="lg">Lg</Switch>
        </VStack>
    );
}

export function Controlled() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <Switch
                isChecked={isChecked}
                onChangeValue={setIsChecked}
            >
                Controlled
            </Switch>
        </>
    );
}
