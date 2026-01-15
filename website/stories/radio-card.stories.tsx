import { Flex, Grid, Group, Icon, RadioCard, RadioGroup, Text, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { FaPaypal, FaVuejs } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";
import { RiNextjsLine } from "react-icons/ri";
import { SiApple, SiReactrouter } from "react-icons/si";

export default {
    title: "Radio Card"
} satisfies Meta;

export function Base() {
    return (
        <RadioGroup
            defaultValue="rr"
            full
        >
            <Group
                full
                wrapped
            >
                <RadioCard
                    full
                    title="React Router"
                    value="rr"
                />
                <RadioCard
                    full
                    title="Next.js"
                    value="next"
                />
                <RadioCard
                    full
                    title="Vue.js"
                    value="vue"
                />
            </Group>
        </RadioGroup>
    );
}

export function WithDescription() {
    return (
        <RadioGroup
            defaultValue="rr"
            full
        >
            <Group
                full
                wrapped
            >
                <RadioCard
                    description="Description for React Router"
                    full
                    title="React Router"
                    value="rr"
                />
                <RadioCard
                    description="Description for Next.js"
                    full
                    title="Next.js"
                    value="next"
                />
                <RadioCard
                    description="Description for Vue.js"
                    full
                    title="Vue.js"
                    value="vue"
                />
            </Group>
        </RadioGroup>
    );
}

export function RadioVariant() {
    return (
        <RadioGroup
            defaultValue="outline"
            full
        >
            <Group full>
                <RadioCard
                    description="Description for Outline"
                    full
                    title="Outline"
                    value="outline"
                    variant="outline"
                />
                <RadioCard
                    description="Description for Subtle"
                    full
                    title="Subtle"
                    value="subtle"
                    variant="subtle"
                />
            </Group>
        </RadioGroup>
    );
}

export function Scheme() {
    return (
        <RadioGroup
            defaultValue="primary"
            full
        >
            <Grid
                columns={2}
                full
            >
                <RadioCard
                    description="Description for Primary"
                    full
                    scheme="primary"
                    title="Primary"
                    value="primary"
                />
                <RadioCard
                    description="Description for Secondary"
                    full
                    scheme="secondary"
                    title="Secondary"
                    value="secondary"
                />
                <RadioCard
                    description="Description for Success"
                    full
                    scheme="success"
                    title="Success"
                    value="success"
                />
                <RadioCard
                    description="Description for Warning"
                    full
                    scheme="warning"
                    title="Warning"
                    value="warning"
                />
                <RadioCard
                    description="Description for Error"
                    full
                    scheme="error"
                    title="Error"
                    value="error"
                />
                <RadioCard
                    description="Description for Info"
                    full
                    scheme="info"
                    title="Info"
                    value="info"
                />
                <RadioCard
                    description="Description for None"
                    full
                    scheme="none"
                    title="None"
                    value="none"
                />
            </Grid>
        </RadioGroup>
    );
}

export function Size() {
    return (
        <RadioGroup
            defaultValue="sm"
            full
        >
            <Group
                alignItems="start"
                full
                wrapped
            >
                <RadioCard
                    description="Description for Small"
                    full
                    size="sm"
                    title="Small"
                    value="sm"
                />
                <RadioCard
                    description="Description for Medium"
                    full
                    size="md"
                    title="Medium"
                    value="md"
                />
                <RadioCard
                    description="Description for Large"
                    full
                    size="lg"
                    title="Large"
                    value="lg"
                />
            </Group>
        </RadioGroup>
    );
}

export function Controlled() {
    const [value, setValue] = useState<string | number>("rr");

    return (
        <>
            <Text>Selected: {value}</Text>
            <RadioGroup
                onChange={setValue}
                value={value}
            >
                <Group
                    full
                    wrapped
                >
                    <RadioCard
                        description="Description for React Router"
                        full
                        title="React Router"
                        value="rr"
                    />
                    <RadioCard
                        description="Description for Next.js"
                        full
                        title="Next.js"
                        value="next"
                    />
                    <RadioCard
                        description="Description for Vue.js"
                        full
                        title="Vue.js"
                        value="vue"
                    />
                </Group>
            </RadioGroup>
        </>
    );
}

export function WithIcon() {
    return (
        <RadioGroup
            defaultValue="rr"
            full
        >
            <Group
                full
                wrapped
            >
                <RadioCard
                    description="Description for React Router"
                    full
                    title={
                        <Flex
                            col
                            gap={2}
                        >
                            <Icon
                                as={<SiReactrouter />}
                                boxSize="5"
                                color="fg.medium"
                            />
                            <Text>React Router</Text>
                        </Flex>
                    }
                    value="rr"
                />
                <RadioCard
                    description="Description for Next.js"
                    full
                    title={
                        <Flex
                            col
                            gap={2}
                        >
                            <Icon
                                as={<RiNextjsLine />}
                                boxSize="5"
                                color="fg.medium"
                            />
                            <Text>Next.js</Text>
                        </Flex>
                    }
                    value="next"
                />
                <RadioCard
                    description="Description for Vue.js"
                    full
                    title={
                        <Flex
                            col
                            gap={2}
                        >
                            <Icon
                                as={<FaVuejs />}
                                boxSize="5"
                                color="fg.medium"
                            />
                            <Text>Vue.js</Text>
                        </Flex>
                    }
                    value="vue"
                />
            </Group>
        </RadioGroup>
    );
}

export function HideRadio() {
    return (
        <RadioGroup
            defaultValue="paypal"
            full
        >
            <Group
                full
                wrapped
            >
                <RadioCard
                    full
                    hideRadio
                    title={
                        <Flex
                            center
                            full
                            gap={2}
                            row
                        >
                            <Icon
                                as={<FaPaypal />}
                                boxSize="5"
                                color="fg.medium"
                            />
                            <Text>Paypal</Text>
                        </Flex>
                    }
                    value="paypal"
                />
                <RadioCard
                    full
                    hideRadio
                    title={
                        <Flex
                            center
                            full
                            gap={2}
                            row
                        >
                            <Icon
                                as={<FiCreditCard />}
                                boxSize="5"
                                color="fg.medium"
                            />
                            <Text>Credit Card</Text>
                        </Flex>
                    }
                    value="cc"
                />
                <RadioCard
                    full
                    hideRadio
                    title={
                        <Flex
                            center
                            full
                            gap={2}
                            row
                        >
                            <Icon
                                as={<SiApple />}
                                boxSize="5"
                                color="fg.medium"
                            />
                            <Text>Apple</Text>
                        </Flex>
                    }
                    value="apple"
                />
            </Group>
        </RadioGroup>
    );
}
