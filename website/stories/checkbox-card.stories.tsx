import { CheckboxCard, CheckboxGroup, Flex, Grid, Group, Icon, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { FaPaypal, FaVuejs } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";
import { RiNextjsLine } from "react-icons/ri";
import { SiApple, SiReactrouter } from "react-icons/si";

export default {
    title: "Checkbox Card"
} satisfies Meta;

interface CheckboxCardOptionProps extends React.ComponentProps<typeof CheckboxCard.Root> {
    title: React.ReactNode;
    description?: React.ReactNode;
    hideCheckbox?: boolean;
}

function CheckboxCardOption(props: CheckboxCardOptionProps) {
    const { title, description, hideCheckbox, children, ...rest } = props;

    return (
        <CheckboxCard.Root {...rest}>
            <CheckboxCard.Header>
                <CheckboxCard.Title>{title}</CheckboxCard.Title>
                {!hideCheckbox && <CheckboxCard.Checkbox />}
            </CheckboxCard.Header>
            {description ? <CheckboxCard.Description>{description}</CheckboxCard.Description> : null}
            {children}
        </CheckboxCard.Root>
    );
}

export function Base() {
    return (
        <CheckboxCardOption
            description="This is a description"
            title="Default Checkbox Card"
        />
    );
}

export function Composition() {
    return (
        <CheckboxCard.Root>
            <CheckboxCard.Header>
                <CheckboxCard.Title>Checkbox Card</CheckboxCard.Title>
                <CheckboxCard.Checkbox />
            </CheckboxCard.Header>
        </CheckboxCard.Root>
    );
}

export function WithDescription() {
    return (
        <Group
            full
            wrapped
        >
            <CheckboxCardOption
                description="Description for React Router"
                full
                title="React Router"
            />
            <CheckboxCardOption
                description="Description for Next.js"
                full
                title="Next.js"
            />
            <CheckboxCardOption
                description="Description for Vue.js"
                full
                title="Vue.js"
            />
        </Group>
    );
}

export function Variant() {
    return (
        <Group full>
            <CheckboxCardOption
                description="Description for Outline variant"
                full
                title="Outline variant"
                variant="outline"
            />
            <CheckboxCardOption
                description="Description for Subtle variant"
                full
                title="Subtle variant"
                variant="subtle"
            />
        </Group>
    );
}

export function CheckboxVariant() {
    return (
        <Group full>
            <CheckboxCardOption
                checkboxVariant="solid"
                description="Description for Solid variant"
                full
                title="Solid variant"
            />
            <CheckboxCardOption
                checkboxVariant="outline"
                description="Description for Outline variant"
                full
                title="Outline variant"
            />
        </Group>
    );
}

export function Scheme() {
    return (
        <Grid
            columns={2}
            full
        >
            <CheckboxCardOption
                defaultChecked
                description="Description for Primary"
                full
                scheme="primary"
                title="Primary"
            />
            <CheckboxCardOption
                defaultChecked
                description="Description for Secondary"
                full
                scheme="secondary"
                title="Secondary"
            />
            <CheckboxCardOption
                defaultChecked
                description="Description for Success"
                full
                scheme="success"
                title="Success"
            />
            <CheckboxCardOption
                defaultChecked
                description="Description for Warning"
                full
                scheme="warning"
                title="Warning"
            />
            <CheckboxCardOption
                defaultChecked
                description="Description for Error"
                full
                scheme="error"
                title="Error"
            />
            <CheckboxCardOption
                defaultChecked
                description="Description for Info"
                full
                scheme="info"
                title="Info"
            />
        </Grid>
    );
}

export function Size() {
    return (
        <Group
            alignItems="start"
            full
            wrapped
        >
            <CheckboxCardOption
                description="Description for Small"
                full
                size="sm"
                title="Small"
            />
            <CheckboxCardOption
                description="Description for Medium"
                full
                size="md"
                title="Medium"
            />
            <CheckboxCardOption
                description="Description for Large"
                full
                size="lg"
                title="Large"
            />
        </Group>
    );
}

export function Controlled() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <CheckboxCardOption
                description="Description for Controlled"
                full
                isChecked={isChecked}
                onChangeValue={setIsChecked}
                title="Controlled"
            />
        </>
    );
}

export function CheckboxCardGroup() {
    const [value, setValue] = useState<Array<string | number>>(["1"]);

    return (
        <>
            <Text>Selected: {value.join(", ")}</Text>
            <CheckboxGroup
                onChange={setValue}
                value={value}
            >
                <Group
                    full
                    wrapped
                >
                    <CheckboxCardOption
                        description="Description for Option 1"
                        full
                        title="Option 1"
                        value="1"
                    />
                    <CheckboxCardOption
                        description="Description for Option 2"
                        full
                        title="Option 2"
                        value="2"
                    />
                    <CheckboxCardOption
                        description="Description for Option 3"
                        full
                        title="Option 3"
                        value="3"
                    />
                </Group>
            </CheckboxGroup>
        </>
    );
}

export function WithIcon() {
    return (
        <Group
            full
            wrapped
        >
            <CheckboxCardOption
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
            />
            <CheckboxCardOption
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
            />
            <CheckboxCardOption
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
            />
        </Group>
    );
}

export function HideCheckbox() {
    return (
        <Group
            full
            wrapped
        >
            <CheckboxCardOption
                full
                hideCheckbox
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
            />
            <CheckboxCardOption
                full
                hideCheckbox
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
            />
            <CheckboxCardOption
                full
                hideCheckbox
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
            />
        </Group>
    );
}
