import { HStack, Text, Tooltip } from "@/ui";
import type { Meta } from "@storybook/react-vite";

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
                openDelay={1000}
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
                closeOnClick={false}
                content="I am not closed on click"
            >
                <Text w="fit-content">Close on click false</Text>
            </Tooltip>
            <Tooltip
                closeOnPointerDown={false}
                content="I am not closed on pointer down"
            >
                <Text w="fit-content">Close on pointer down false</Text>
            </Tooltip>
            <Tooltip
                closeOnEsc={false}
                content="I am not closed on esc key"
            >
                <Text w="fit-content">Close on esc key false</Text>
            </Tooltip>
            <Tooltip
                closeOnScroll
                content="I am closed on scroll"
            >
                <Text w="fit-content">Close on scroll</Text>
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

export function DisablePortal() {
    return (
        <Tooltip
            content="I am rendered directly in the parent component"
            disablePortal
        >
            <Text w="fit-content">Disable portal</Text>
        </Tooltip>
    );
}
