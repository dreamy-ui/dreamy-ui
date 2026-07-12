import { Flex, Grid, Group, Icon, RadioCard, RadioGroup, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { FaPaypal, FaVuejs } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";
import { RiNextjsLine } from "react-icons/ri";
import { SiApple, SiReactrouter } from "react-icons/si";
export default {
    title: "Radio Card"
} satisfies Meta;

interface RadioCardOptionProps extends React.ComponentProps<typeof RadioCard.Root> {
    title: React.ReactNode;
    description?: React.ReactNode;
    hideRadio?: boolean;
}

function RadioCardOption(props: RadioCardOptionProps) {
    const { title, description, hideRadio, children, ...rest } = props;

    return (
        <RadioCard.Root {...rest}>
            <RadioCard.Header>
                <RadioCard.Title>{title}</RadioCard.Title>
                {!hideRadio && <RadioCard.Radio />}
            </RadioCard.Header>
            {description ? <RadioCard.Description>{description}</RadioCard.Description> : null}
            {children}
        </RadioCard.Root>
    );
}

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
                <RadioCardOption
                    full
                    title="React Router"
                    value="rr"
                />
                <RadioCardOption
                    full
                    title="Next.js"
                    value="next"
                />
                <RadioCardOption
                    full
                    title="Vue.js"
                    value="vue"
                />
            </Group>
        </RadioGroup>
    );
}

export function Composition() {
    return (
        <RadioGroup
            defaultValue="rr"
            full
        >
            <Group
                full
                wrapped
            >
                <RadioCard.Root
                    full
                    value="rr"
                >
                    <RadioCard.Header>
                        <RadioCard.Title>React Router</RadioCard.Title>
                        <RadioCard.Radio />
                    </RadioCard.Header>
                </RadioCard.Root>
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
                <RadioCardOption
                    description="Description for React Router"
                    full
                    title="React Router"
                    value="rr"
                />
                <RadioCardOption
                    description="Description for Next.js"
                    full
                    title="Next.js"
                    value="next"
                />
                <RadioCardOption
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
                <RadioCardOption
                    description="Description for Outline"
                    full
                    title="Outline"
                    value="outline"
                    variant="outline"
                />
                <RadioCardOption
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
                <RadioCardOption
                    description="Description for Primary"
                    full
                    scheme="primary"
                    title="Primary"
                    value="primary"
                />
                <RadioCardOption
                    description="Description for Secondary"
                    full
                    scheme="secondary"
                    title="Secondary"
                    value="secondary"
                />
                <RadioCardOption
                    description="Description for Success"
                    full
                    scheme="success"
                    title="Success"
                    value="success"
                />
                <RadioCardOption
                    description="Description for Warning"
                    full
                    scheme="warning"
                    title="Warning"
                    value="warning"
                />
                <RadioCardOption
                    description="Description for Error"
                    full
                    scheme="error"
                    title="Error"
                    value="error"
                />
                <RadioCardOption
                    description="Description for Info"
                    full
                    scheme="info"
                    title="Info"
                    value="info"
                />
                <RadioCardOption
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
                <RadioCardOption
                    description="Description for Small"
                    full
                    size="sm"
                    title="Small"
                    value="sm"
                />
                <RadioCardOption
                    description="Description for Medium"
                    full
                    size="md"
                    title="Medium"
                    value="md"
                />
                <RadioCardOption
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
                    <RadioCardOption
                        description="Description for React Router"
                        full
                        title="React Router"
                        value="rr"
                    />
                    <RadioCardOption
                        description="Description for Next.js"
                        full
                        title="Next.js"
                        value="next"
                    />
                    <RadioCardOption
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
                <RadioCardOption
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
                <RadioCardOption
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
                <RadioCardOption
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
                <RadioCardOption
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
                <RadioCardOption
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
                <RadioCardOption
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
