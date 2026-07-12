import { Badge, Grid, HStack, Icon, Progress, Stat, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { LuDollarSign } from "react-icons/lu";

export default {
    title: "Stat"
} satisfies Meta;

export function Base() {
    return (
        <Stat.Root>
            <Stat.Label>Unique visitors</Stat.Label>
            <Stat.ValueText>192.1k</Stat.ValueText>
        </Stat.Root>
    );
}

export function WithHint() {
    return (
        <Stat.Root>
            <Stat.Label>Revenue</Stat.Label>
            <Stat.ValueText>$935.40</Stat.ValueText>
            <Stat.Hint>+12% from last month</Stat.Hint>
        </Stat.Root>
    );
}

export function WithIndicators() {
    return (
        <HStack gap={8}>
            <Stat.Root>
                <Stat.Label>Sales</Stat.Label>
                <Stat.ValueText>$4,200</Stat.ValueText>
                <Badge
                    px={0}
                    scheme="success"
                    variant="plain"
                >
                    <Stat.UpIndicator />
                    12%
                </Badge>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Conversions</Stat.Label>
                <Stat.ValueText>2.4%</Stat.ValueText>
                <Badge
                    px={0}
                    scheme="error"
                    variant="plain"
                >
                    <Stat.DownIndicator />
                    1.2%
                </Badge>
            </Stat.Root>
        </HStack>
    );
}

export function WithBadgeIndicators() {
    return (
        <HStack gap={8}>
            <Stat.Root>
                <Stat.Label>Sales</Stat.Label>
                <HStack>
                    <Stat.ValueText>$4,200</Stat.ValueText>
                    <Badge
                        scheme="success"
                        variant="subtle"
                    >
                        <Stat.UpIndicator />
                        12%
                    </Badge>
                </HStack>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Conversions</Stat.Label>
                <HStack>
                    <Stat.ValueText>2.4%</Stat.ValueText>
                    <Badge
                        scheme="error"
                        variant="subtle"
                    >
                        <Stat.DownIndicator />
                        1.2%
                    </Badge>
                </HStack>
            </Stat.Root>
        </HStack>
    );
}

export function WithValueUnits() {
    return (
        <Stat.Root>
            <Stat.Label>Time to complete</Stat.Label>
            <Stat.ValueText>
                3 <Stat.ValueUnit>hr</Stat.ValueUnit>
                20 <Stat.ValueUnit>min</Stat.ValueUnit>
            </Stat.ValueText>
        </Stat.Root>
    );
}

export function Sizes() {
    return (
        <VStack
            align="start"
            gap={6}
        >
            <Stat.Root size="sm">
                <Stat.Label>Small</Stat.Label>
                <Stat.ValueText>1,234</Stat.ValueText>
            </Stat.Root>
            <Stat.Root size="md">
                <Stat.Label>Medium</Stat.Label>
                <Stat.ValueText>1,234</Stat.ValueText>
            </Stat.Root>
            <Stat.Root size="lg">
                <Stat.Label>Large</Stat.Label>
                <Stat.ValueText>1,234</Stat.ValueText>
            </Stat.Root>
        </VStack>
    );
}

export function WithIcon() {
    return (
        <Stat.Root
            border="1px solid"
            borderColor="border"
            full
            maxW="240px"
            p={4}
            rounded="md"
        >
            <HStack justify="space-between">
                <Stat.Label>Sales</Stat.Label>
                <Icon
                    asChild
                    color="fg.medium"
                >
                    <LuDollarSign />
                </Icon>
            </HStack>
            <Stat.ValueText>$4.24k</Stat.ValueText>
        </Stat.Root>
    );
}

export function WithProgress() {
    return (
        <Stat.Root
            full
            maxW="240px"
        >
            <Stat.Label>This week</Stat.Label>
            <Stat.ValueText>$1,340</Stat.ValueText>
            <Stat.Hint mb={2}>+12% from last week</Stat.Hint>
            <Progress
                aria-label="Progress"
                scheme="success"
                value={75}
            />
        </Stat.Root>
    );
}

export function MultipleStats() {
    return (
        <Grid
            columns={3}
            gap={8}
        >
            <Stat.Root>
                <Stat.Label>Total Users</Stat.Label>
                <Stat.ValueText>8,456</Stat.ValueText>
                <Stat.Hint>+12% from last month</Stat.Hint>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Revenue</Stat.Label>
                <Stat.ValueText>$23,456</Stat.ValueText>
                <Stat.Hint>+5% from last month</Stat.Hint>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Conversion Rate</Stat.Label>
                <Stat.ValueText>3.2%</Stat.ValueText>
                <Stat.Hint>-2% from last month</Stat.Hint>
            </Stat.Root>
        </Grid>
    );
}
