import { Button, HStack, Text, Tooltip, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Tooltip"
} satisfies Meta;

export function Base() {
    return (
        <Tooltip content="I am visible on hover">
            <Text w="fit-content">Hover me</Text>
        </Tooltip>
    );
}

export function OpenCloseDelay() {
    return (
        <HStack>
            <Tooltip
                content="I am visible on hover after 1000 milliseconds"
                delay={1000}
            >
                <Text w="fit-content">Hover me (1s open)</Text>
            </Tooltip>
            <Tooltip
                closeDelay={1000}
                content="I am closed after 1000 milliseconds"
            >
                <Text w="fit-content">Hover me (1s close)</Text>
            </Tooltip>
        </HStack>
    );
}

export function CloseHandlers() {
    return (
        <HStack>
            <Tooltip
                closeOnPress={false}
                content="I stay open when the trigger is pressed"
            >
                <Button
                    size="sm"
                    variant="outline"
                >
                    Keep open on press
                </Button>
            </Tooltip>
            <Tooltip
                content="Tap or press to toggle on touch and keyboard"
                toggleable
            >
                <Button
                    size="sm"
                    variant="outline"
                >
                    Toggleable
                </Button>
            </Tooltip>
            <Tooltip
                content="Escape dismissal is canceled"
                onOpenChange={(next, details) => {
                    if (!next && details.reason === "escape-key") {
                        details.cancel();
                    }
                }}
            >
                <Button
                    size="sm"
                    variant="outline"
                >
                    Cancel Escape
                </Button>
            </Tooltip>
        </HStack>
    );
}

export function Arrow() {
    return (
        <HStack>
            <Tooltip
                content="I have no arrow"
                hasArrow={false}
            >
                <Text w="fit-content">No arrow</Text>
            </Tooltip>
            <Tooltip
                arrowSize={15}
                content="I have an arrow"
            >
                <Text w="fit-content">Arrow size 15</Text>
            </Tooltip>
        </HStack>
    );
}

export function Controlled() {
    const [open, setOpen] = useState(false);

    return (
        <VStack align="start">
            <Button
                onClick={() => setOpen((prev) => !prev)}
                size="sm"
                variant="outline"
            >
                {open ? "Close" : "Open"} tooltip
            </Button>
            <Tooltip
                content="Controlled tooltip content"
                onOpenChange={(next) => setOpen(next)}
                open={open}
            >
                <Button size="sm">Trigger</Button>
            </Tooltip>
        </VStack>
    );
}

export function States() {
    return (
        <HStack>
            <Tooltip
                content="Disabled tooltip"
                disabled
            >
                <Button
                    size="sm"
                    variant="outline"
                >
                    Disabled
                </Button>
            </Tooltip>
            <Tooltip
                content="Reduced motion tooltip"
                delay={0}
                reduceMotion
            >
                <Button
                    size="sm"
                    variant="outline"
                >
                    Reduced motion
                </Button>
            </Tooltip>
        </HStack>
    );
}
