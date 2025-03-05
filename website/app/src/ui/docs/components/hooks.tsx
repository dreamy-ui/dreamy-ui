import { Button, useColorMode, useReducedMotion } from "@dreamy-ui/react";
import { Flex, Text } from "@dreamy-ui/react/rsc";

export function UseColorMode() {
    const { colorMode, setColorMode, toggleColorMode } = useColorMode()

    return (
        <Flex col gap={2}>
            <Text>Current color mode: {colorMode}</Text>
            <Flex wrapped gap={2}>
                <Button onClick={() => setColorMode("light")}>Light</Button>
                <Button onClick={() => setColorMode("dark")}>Dark</Button>
                <Button onClick={toggleColorMode}>Toggle</Button>
            </Flex>
        </Flex>
    )
}

export function UseReducedMotion() {
    const isReducedMotion = useReducedMotion()

    return (
        <Text>Is reduced motion: {isReducedMotion ? "Yes" : "No"}</Text>
    )
}