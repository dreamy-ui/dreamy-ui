import {
    Card,
    CardBody,
    Field,
    FieldHelpText,
    FieldLabel,
    Input,
    PinInput,
    PinInputField,
    Switch,
    useColorMode
} from "@dreamy-ui/react";
import { Flex, Grid, Heading, Spinner, Text } from "@dreamy-ui/react/rsc";
import ExploreComponents from "./ExploreComponents";

export default function FloatingComponents() {
    const { colorMode, toggleColorMode } = useColorMode();

    const components = [
        {
            title: "Field",
            component: (
                <Field
                    isRequired
                    // full
                    maxW={"270px"}
                >
                    <FieldLabel>Username</FieldLabel>
                    <Input
                        minLength={3}
                        maxLength={16}
                        placeholder="CatLover"
                        full
                    />
                    <FieldHelpText>Enter a public username</FieldHelpText>
                </Field>
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
                <Field
                    orientation="horizontal"
                    w={"xs"}
                >
                    <FieldLabel>Dark mode</FieldLabel>
                    <Switch
                        isChecked={colorMode === "dark"}
                        onChangeValue={toggleColorMode}
                    />
                </Field>
            )
        },
        {
            title: "Pin Input",
            component: (
                <PinInput defaultValue="2137">
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                </PinInput>
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
                    <Card
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
                        <CardBody
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
                        </CardBody>
                    </Card>
                ))}
            </Grid>

            <ExploreComponents />
        </Flex>
    );
}
