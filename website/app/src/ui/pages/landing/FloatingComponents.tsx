import { Card } from "@/card";
import { Field } from "@/field";
import { Flex } from "@/flex";
import { Grid } from "@/grid";
import { Heading } from "@/heading";
import { Input } from "@/input";
import { PinInput } from "@/pin-input";
import { Spinner } from "@/spinner";
import { Switch } from "@/switch";
import { Text } from "@/text";
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
                        minLength={3}
                        maxLength={16}
                        placeholder="CatLover"
                        full
                    />
                    <Field.Hint>Enter a public username</Field.Hint>
                </Field.Root>
            )
        },
        {
            title: "Spinner",
            component: (
                <Flex
                    col
                    gap={4}
                    center
                >
                    <Spinner color={"primary"} />
                    <Flex
                        gap={2}
                        col
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
                full
                columns={{
                    base: 1,
                    md: 2
                    // xl: 4
                }}
            >
                {components.map((component, i) => (
                    <Card.Root
                        key={`component-${i}`}
                        variant={"outline"}
                        center
                        relative
                        bg={"transparent"}
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
                            w={"full"}
                            gap={10}
                            p={10}
                            pb={14}
                            center
                            // pt={16}
                        >
                            {component.component}
                            <Text
                                color={"fg.medium"}
                                fontFamily={"mono"}
                                textCenter
                                absolute
                                bottom={2}
                                left={"50%"}
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
