import { Box, Grid } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
    title: "Grid"
} satisfies Meta;

function GridItem() {
    return (
        <Box
            bg={"primary"}
            p={2}
        >
            Grid
        </Box>
    );
}

export function Base() {
    return (
        <Grid columns={2}>
            {Array.from({ length: 8 }).map((_, index) => (
                <GridItem key={index} />
            ))}
        </Grid>
    );
}

export function Gap() {
    return (
        <Grid
            columns={2}
            gap="4"
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <GridItem key={index} />
            ))}
        </Grid>
    );
}

export function RowGap() {
    return (
        <Grid
            columns={2}
            rowGap="4"
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <GridItem key={index} />
            ))}
        </Grid>
    );
}

export function ColumnGap() {
    return (
        <Grid
            columns={2}
            columnGap="4"
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <GridItem key={index} />
            ))}
        </Grid>
    );
}
