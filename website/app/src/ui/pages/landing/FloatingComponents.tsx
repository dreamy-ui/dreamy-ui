import { Card } from "@/ui";
import { Field } from "@/ui";
import { Flex } from "@/ui";
import { Grid } from "@/ui";
import { Heading } from "@/ui";
import { Input } from "@/ui";
import { PinInput } from "@/ui";
import { Spinner } from "@/ui";
import { Switch } from "@/ui";
import { Text } from "@/ui";
import { useColorMode } from "@dreamy-ui/react";
import ExploreComponents from "./ExploreComponents";

export default function FloatingComponents() {
    const { colorMode, toggleColorMode } = useColorMode();

    const components = [
        {
            title: "Field",
            component: (
                <Field.Root
                    isRequired
                    // full
                    maxW={"270px"}
                >
                    <Field.Label>Username</Field.Label>
                    <Input
                        full
                        maxLength={16}
                        minLength={3}
                        placeholder="CatLover"
                    />
                    <Field.Hint>Enter a public username</Field.Hint>
                </Field.Root>
            )
        },
        {
            title: "Spinner",
            component: (
                <Flex
                    center
                    col
                    gap={4}
                >
                    <Spinner color={"primary"} />
                    <Flex
                        col
                        gap={2}
                        textCenter
                    >
                        <Heading size={"md"}>Loading...</Heading>
                        <Text
                            color={"fg.medium"}
                            size={"sm"}
                        >
                            This make take a while
                        </Text>
                    </Flex>
                </Flex>
            )
        },

        {
            title: "Switch",
            component: (
                <Field.Root
                    orientation="horizontal"
                    w={"xs"}
                >
                    <Field.Label>Dark mode</Field.Label>
                    <Switch
                        isChecked={colorMode === "dark"}
                        onChangeValue={toggleColorMode}
                    />
                </Field.Root>
            )
        },
        {
            title: "Pin Input",
            component: (
                <PinInput.Root defaultValue="2137">
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                    <PinInput.Field />
                </PinInput.Root>
            )
        }
    ];

    return (
        <Flex
            col
            gap={10}
        >
            <Grid
                columns={{
                    base: 1,
                    md: 2
                    // xl: 4
                }}
                full
            >
                {components.map((component, i) => (
                    <Card.Root
                        bg={"transparent"}
                        center
                        key={`component-${i}`}
                        relative
                        variant={"outline"}
                        // full
                        // p={4}
                        // pt={14}
                        // rounded={"md"}
                        // bg={"alpha.50"}
                        // borderColor={"border"}
                        // borderWidth={1}
                        // center
                        // col
                        // gap={"10!"}
                        // animation={"downUp 5s {easings.easeInOut} infinite"}
                        // animationDelay={`${i * 0.5}s`}
                    >
                        <Card.Body
                            // maxW={"xs"}
                            center
                            gap={10}
                            p={10}
                            pb={14}
                            w={"full"}
                            // pt={16}
                        >
                            {component.component}
                            <Text
                                absolute
                                bottom={2}
                                color={"fg.medium"}
                                fontFamily={"mono"}
                                left={"50%"}
                                textCenter
                                translate={"auto"}
                                x={"-50%"}
                            >
                                {component.title}
                            </Text>
                        </Card.Body>
                    </Card.Root>
                ))}
            </Grid>

            <ExploreComponents />
        </Flex>
    );
}
