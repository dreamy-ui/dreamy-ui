import { Divider, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Divider"
} satisfies Meta;

export function Base() {
    return <Divider />;
}

export function Orientation() {
    return (
        <>
            <Text semibold>Horizontal</Text>
            <Divider orientation="horizontal" />

            <Text
                mt={4}
                semibold
            >
                Vertical
            </Text>
            <Divider
                h="100px"
                orientation="vertical"
            />
        </>
    );
}
