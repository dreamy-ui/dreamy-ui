import { Grid, GridItem } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Grid"
} satisfies Meta;

export function Base() {
    return (
        <Grid
            color="white"
            columns={3}
            w="full"
        >
            <GridItem
                bg="green.400"
                color="black"
                p={2}
            >
                1
            </GridItem>
            <GridItem
                bg="blue.400"
                p={2}
            >
                2
            </GridItem>
            <GridItem
                bg="purple.400"
                p={2}
            >
                3
            </GridItem>
            <GridItem
                bg="green.400"
                color="black"
                p={2}
            >
                1
            </GridItem>
            <GridItem
                bg="blue.400"
                p={2}
            >
                2
            </GridItem>
            <GridItem
                bg="purple.400"
                p={2}
            >
                3
            </GridItem>
        </Grid>
    );
}

export function UsingColSpanAndRowSpan() {
    return (
        <Grid
            color="white"
            columns={3}
            w="full"
        >
            <GridItem
                bg="green.400"
                colSpan={2}
                color="black"
                p={2}
            >
                1
            </GridItem>
            <GridItem
                bg="blue.400"
                p={2}
                rowSpan={2}
            >
                2
            </GridItem>
            <GridItem
                bg="purple.400"
                p={2}
            >
                3
            </GridItem>
        </Grid>
    );
}

export function MinChildWidth() {
    return (
        <Grid
            color="white"
            minChildWidth="150px"
            w="full"
        >
            <GridItem
                bg="green.400"
                color="black"
                p={2}
            >
                1
            </GridItem>
            <GridItem
                bg="blue.400"
                p={2}
            >
                2
            </GridItem>
            <GridItem
                bg="purple.400"
                p={2}
            >
                3
            </GridItem>
            <GridItem
                bg="green.400"
                color="black"
                p={2}
            >
                1
            </GridItem>
            <GridItem
                bg="blue.400"
                p={2}
            >
                2
            </GridItem>
            <GridItem
                bg="purple.400"
                p={2}
            >
                3
            </GridItem>
            <GridItem
                bg="green.400"
                color="black"
                p={2}
            >
                1
            </GridItem>
            <GridItem
                bg="blue.400"
                p={2}
            >
                2
            </GridItem>
            <GridItem
                bg="purple.400"
                p={2}
            >
                3
            </GridItem>
        </Grid>
    );
}
