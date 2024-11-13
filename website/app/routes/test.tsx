import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Avatar,
    AvatarGroup,
    Button,
    Checkbox,
    CheckboxCard,
    CheckboxGroup,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Snippet,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableColumnHeader,
    TableHeader,
    TableRow,
    Tabs
} from "@dreamy-ui/react";
import {
    Badge,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    Kbd,
    Text,
    VStack
} from "@dreamy-ui/react/rsc";
import { useEffect, useMemo, useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";

export default function Test() {
    const [count, setCount] = useState(0);

    const [checked, setChecked] = useState(false);

    return (
        <Flex
            col
            gap={10}
        >
            <Grid
                columns={3}
                rowGap={4}
                columnGap={2}
            >
                <GridItem
                    colSpan={2}
                    p={2}
                    bg={"red"}
                    color="black"
                >
                    1
                </GridItem>
                <GridItem
                    p={2}
                    bg={"red"}
                    rowSpan={2}
                >
                    1
                </GridItem>
                <GridItem
                    p={2}
                    bg={"red"}
                >
                    1
                </GridItem>
                <GridItem
                    p={2}
                    bg={"red"}
                >
                    1
                </GridItem>
            </Grid>

            <Divider />
            <Divider
                orientation="vertical"
                h={"100px"}
            />

            <Heading size={"5xl"}>Testing</Heading>

            <Table
                variant={"simple"}
                size="sm"
            >
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table
                variant={"simple"}
                withBackground
                size="md"
                interactive
            >
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table
                variant={"line"}
                size="md"
                striped
                showColumnBorder
            >
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table
                variant={"simple"}
                size="lg"
            >
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                </TableBody>
                <TableCaption captionSide={"bottom"}>This is a caption</TableCaption>
            </Table>

            <Flex
                wrapped
                gap={2}
            >
                <Button
                    variant={"ghost"}
                    color={"warning"}
                >
                    Ghost
                </Button>
                <Button
                    variant={"solid"}
                    color={"error"}
                >
                    Solid
                </Button>
                <Button
                    variant={"outline"}
                    color="success"
                >
                    Outline
                </Button>
                <Button variant={"primary"}>Secondary</Button>
            </Flex>

            <Snippet size={"sm"}>pnpm run dev</Snippet>
            <Snippet
                variant={"bordered"}
                scheme={"success"}
            >
                pnpm run dev
            </Snippet>
            <Snippet
                size={"lg"}
                scheme={"secondary"}
                disableTooltip
            >
                <span>pnpm run dev</span>
                <span>pnpm run test</span>
            </Snippet>

            <VStack
                maxW={"sm"}
                w="100%"
            >
                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                    size={"sm"}
                />
                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                />
                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                    scheme={"success"}
                />
                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                    variant="subtle"
                    checkboxVariant={"solid"}
                    size={"lg"}
                />

                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                    variant="subtle"
                    scheme={"error"}
                />
                {/* success, warning, info */}
                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                    variant="subtle"
                    scheme={"success"}
                />
                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                    variant="subtle"
                    scheme={"warning"}
                />
                <CheckboxCard
                    title={"Something"}
                    description="Click me lol"
                    variant="subtle"
                    scheme={"info"}
                />
            </VStack>

            <CheckboxGroup
                defaultValue={["primary", "info"]}
                variant={"outline"}
                size={"sm"}
                onChange={(v) => console.log(v)}
            >
                {["primary", "secondary", "error", "warning", "info", "success"].map((scheme) => (
                    <Checkbox
                        key={scheme}
                        scheme={scheme as any}
                        value={scheme}
                    >
                        {scheme}
                    </Checkbox>
                ))}
            </CheckboxGroup>

            <Checkbox
                isChecked={checked}
                onChange={() => {
                    setChecked((prev) => !prev);
                }}
            >
                Hello
            </Checkbox>
            <Checkbox isIndeterminate={checked}>Bye</Checkbox>

            <Tabs isLazy>
                <TabList>
                    <Tab>Tab 1</Tab>
                    <Tab>Tab 2</Tab>
                    <Tab>Tab 3</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <p>Tab 1</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 2</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Tab 3</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <Accordion
                allowToggle
                size={"sm"}
                variant={"outline"}
            >
                <AccordionItem>
                    <AccordionTrigger>HI</AccordionTrigger>
                    <AccordionContent>Hello</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionTrigger>Hi</AccordionTrigger>
                    <AccordionContent>Hello</AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion
                allowToggle
                size={"md"}
                allowMultiple
                variant={"subtle"}
            >
                <AccordionItem>
                    <AccordionTrigger>HI</AccordionTrigger>
                    <AccordionContent>Hello</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionTrigger>Hi</AccordionTrigger>
                    <AccordionContent>Hello</AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion
                allowToggle
                size={"lg"}
                variant={"solid"}
            >
                <AccordionItem>
                    <AccordionTrigger>HI</AccordionTrigger>
                    <AccordionContent>Hello</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionTrigger>Hi</AccordionTrigger>
                    <AccordionContent>Hello</AccordionContent>
                </AccordionItem>
            </Accordion>

            <Slider
                defaultValue={25}
                size={"sm"}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                    <SliderThumb />
                </SliderTrack>
                <SliderMark value={0}>0%</SliderMark>
                <SliderMark value={25}>25%</SliderMark>
                <SliderMark value={50}>50%</SliderMark>
                <SliderMark value={100}>100%</SliderMark>
            </Slider>

            <Slider
                orientation="vertical"
                h={"200px"}
                defaultValue={50}
                size={"md"}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                    <SliderThumb />
                </SliderTrack>
                <SliderMark value={0}>0%</SliderMark>
                <SliderMark value={25}>25%</SliderMark>
                <SliderMark value={50}>50%</SliderMark>
                <SliderMark value={100}>100%</SliderMark>
            </Slider>

            <ReversedSliders />

            <AvatarGroup maxAvatars={4}>
                <Avatar
                    name="Dream"
                    src="/eee.png"
                />
                <Avatar
                    name="Dream"
                    src="/eee.png"
                />
                <Avatar
                    name="Dream"
                    src="/eee.png"
                />
                <Avatar
                    name="Dream"
                    src="/eee.png"
                />
                <Avatar
                    name="Dream"
                    src="/eee.png"
                />
                <Avatar
                    name="Dream"
                    src="/eee.png"
                />
                <Avatar
                    name="Dream"
                    src="/eee.png"
                />
            </AvatarGroup>

            <InputGroup>
                <InputLeftAddon
                    zIndex={1}
                    p={0}
                    left={1}
                >
                    <IconButton
                        size={"sm"}
                        aria-label="take away"
                        icon={<IoRemove />}
                        onClick={() => {
                            setCount((prev) => prev - 1);
                        }}
                    />
                </InputLeftAddon>
                <Input
                    type={"number"}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    px={"12"}
                />
                <InputRightAddon
                    zIndex={1}
                    p={0}
                    right={1}
                >
                    <IconButton
                        size={"sm"}
                        aria-label="add"
                        icon={<IoAdd />}
                        onClick={() => {
                            setCount((prev) => prev + 1);
                        }}
                    />
                </InputRightAddon>
            </InputGroup>

            <TestPropsComponent
                name={"meow"}
                peopleMap={
                    new Map<string, string>([
                        ["1", "2"],
                        ["3", "4"]
                    ])
                }
            />

            <Badge
                scheme={"error"}
                variant={"subtle"}
            >
                Womp Womp
            </Badge>

            <Kbd>Ctrl + C</Kbd>
        </Flex>
    );
}

function ReversedSliders() {
    const [reversedValue, setReversedValue] = useState(0);

    return (
        <>
            <Text>{reversedValue}</Text>

            <Slider
                min={0}
                max={100}
                size={"lg"}
                orientation="vertical"
                h={"200px"}
                isReversed
                value={reversedValue}
                onChange={setReversedValue}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                    <SliderThumb />
                </SliderTrack>
            </Slider>

            <Slider
                min={0}
                max={100}
                size={"lg"}
                // step={20}
                isReversed
                value={reversedValue}
                onChange={setReversedValue}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                    <SliderThumb />
                </SliderTrack>
            </Slider>
        </>
    );
}

function TestPropsComponent(props: {
    name: string;
    peopleMap: Map<string, string>;
}) {
    // no
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    props = useMemo(() => props, [JSON.stringify(props)]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        console.info('"TestPropsComponent" props changed!');
    }, [props]);

    return <Text>{props.name}</Text>;
}
