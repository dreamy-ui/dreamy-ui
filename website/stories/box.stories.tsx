import { Box } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Box"
} satisfies Meta;

export function Base() {
    return (
        <Box
            bg="green.400"
            color="black"
            fontWeight={500}
            h="100px"
            p={3}
            rounded="l2"
            w="250px"
        >
            This is a box
        </Box>
    );
}
