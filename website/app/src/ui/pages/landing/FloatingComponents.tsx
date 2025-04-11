import {
    Card,
    CardBody,
    Field,
    FieldHelpText,
    FieldLabel,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    Switch,
    useColorMode
} from "@dreamy-ui/react";
import { Flex, Grid, HStack, Heading, Icon, Spinner, Text } from "@dreamy-ui/react/rsc";
import { LuCat, LuDog, LuLeafyGreen } from "react-icons/lu";
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
            title: "Select",
            component: (
                <Field
                    isRequired
                    // full
                    maxW={"270px"}
                >
                    <FieldLabel>Favorite animal</FieldLabel>
                    <Select
                        full
                        isClearable
                    >
                        <SelectTrigger
                            // icon={<Icon as={LuCat} />}
                            placeholder="Select animal"
                        />
                        <SelectContent>
                            <SelectItem value="panda">
                                <HStack>
                                    <Icon
                                        as={LuLeafyGreen}
                                        boxSize={"4"}
                                        // color={"fg.medium"}
                                    />
                                    <Text>Panda</Text>
                                </HStack>
                            </SelectItem>
                            <SelectItem value="cat">
                                <HStack>
                                    <Icon
                                        as={LuCat}
                                        boxSize={"4"}
                                        // color={"fg.medium"}
                                    />
                                    <Text>Cat</Text>
                                </HStack>
                            </SelectItem>
                            <SelectItem value="dog">
                                <HStack>
                                    <Icon
                                        as={LuDog}
                                        boxSize={"4"}
                                        // color={"fg.medium"}
                                    />
                                    <Text>Dog</Text>
                                </HStack>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <FieldHelpText>Select your favorite animal</FieldHelpText>
                </Field>
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
