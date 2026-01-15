import { Button, Card, Divider, Field, Flex, Image, Input, Link, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { HiExternalLink } from "react-icons/hi";

export default {
    title: "Card"
} satisfies Meta;

export function Base() {
    return (
        <Card.Root maxW="sm">
            <Card.Header>
                <Card.Title>Card Title</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Description>
                    This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Curabitur nec odio vel dui euismod fermentum. Curabitur nec odio vel dui euismod
                    fermentum.
                </Card.Description>
            </Card.Body>
        </Card.Root>
    );
}

export function Variants() {
    return (
        <>
            <Card.Root
                maxW="sm"
                variant="elevated"
            >
                <Card.Header>
                    <Card.Title>Elevated</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Description>
                        This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec odio vel
                        dui euismod fermentum.
                    </Card.Description>
                </Card.Body>
            </Card.Root>

            <Card.Root
                maxW="sm"
                variant="outline"
            >
                <Card.Header>
                    <Card.Title>Outline</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Description>
                        This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec odio vel
                        dui euismod fermentum.
                    </Card.Description>
                </Card.Body>
            </Card.Root>
        </>
    );
}

export function WithDivider() {
    return (
        <Card.Root maxW="sm">
            <Card.Header
                alignItems="center"
                gap={4}
                pb={6}
                row
            >
                <Image
                    alt="Dreamy UI logo"
                    boxSize="10"
                    src="https://dreamy-ui.com/dream.svg"
                />
                <Flex
                    align="start"
                    column
                >
                    <Card.Title>Dreamy UI</Card.Title>
                    <Text
                        color="fg.medium"
                        size="sm"
                    >
                        dreamy-ui.com
                    </Text>
                </Flex>
            </Card.Header>
            <Divider />
            <Card.Body>
                <Card.Description>
                    Create dream websites with next-gen DX and crispy UI. Powered by Panda CSS.
                </Card.Description>
            </Card.Body>
            <Divider />
            <Card.Footer pt={6}>
                <Link
                    alignItems="center"
                    display="flex"
                    fontWeight={500}
                    gap={1}
                    href="https://github.com/dreamy-ui/dreamy-ui"
                    isExternal
                >
                    Visit source code on GitHub <HiExternalLink />
                </Link>
            </Card.Footer>
        </Card.Root>
    );
}

export function Sizes() {
    return (
        <>
            <Card.Root
                maxW="sm"
                size="sm"
            >
                <Card.Header>
                    <Card.Title>Small Card</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Description>
                        This is the small card body. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec
                        odio vel dui euismod fermentum.
                    </Card.Description>
                </Card.Body>
            </Card.Root>

            <Card.Root
                maxW="sm"
                size="md"
            >
                <Card.Header>
                    <Card.Title>Medium Card</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Description>
                        This is the medium card body. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec
                        odio vel dui euismod fermentum.
                    </Card.Description>
                </Card.Body>
            </Card.Root>

            <Card.Root
                maxW="sm"
                size="lg"
            >
                <Card.Header>
                    <Card.Title>Large Card</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Description>
                        This is the large card body. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Curabitur nec odio vel dui euismod fermentum. Curabitur nec
                        odio vel dui euismod fermentum.
                    </Card.Description>
                </Card.Body>
            </Card.Root>
        </>
    );
}

export function WithForm() {
    return (
        <Card.Root w="md">
            <Card.Header>
                <Card.Title>Form Card</Card.Title>
                <Card.Description>Fill in the form below to create an account</Card.Description>
            </Card.Header>
            <Card.Body gap={4}>
                <Field.Root
                    full
                    label="Email"
                >
                    <Input
                        full
                        name="email"
                        placeholder="Email"
                    />
                </Field.Root>
                <Field.Root
                    full
                    label="Password"
                >
                    <Input
                        full
                        name="password"
                        placeholder="Password"
                    />
                </Field.Root>
            </Card.Body>
            <Card.Footer justifyContent="end">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Sign in</Button>
            </Card.Footer>
        </Card.Root>
    );
}

export function AsLink() {
    return (
        <Card.Root
            as="a"
            href="https://github.com/dreamy-ui/dreamy-ui"
            maxW="sm"
            target="_blank"
        >
            <Card.Header
                alignItems="center"
                gap={4}
                row
            >
                <Image
                    alt="Dreamy UI logo"
                    boxSize="10"
                    src="https://dreamy-ui.com/dream.svg"
                />
                <Flex
                    align="start"
                    column
                >
                    <Card.Title>Dreamy UI</Card.Title>
                    <Text
                        color="fg.medium"
                        size="sm"
                    >
                        dreamy-ui.com
                    </Text>
                </Flex>
            </Card.Header>
            <Card.Body>
                <Card.Description>
                    Create dream websites with next-gen DX and crispy UI. Powered by Panda CSS.
                </Card.Description>
            </Card.Body>
            <Card.Footer>
                <Link
                    alignItems="center"
                    display="flex"
                    fontWeight={500}
                    gap={1}
                    href="https://github.com/dreamy-ui/dreamy-ui"
                    isExternal
                >
                    Star on GitHub <HiExternalLink />
                </Link>
            </Card.Footer>
        </Card.Root>
    );
}
