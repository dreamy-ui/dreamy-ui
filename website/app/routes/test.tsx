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
    Editable,
    EditableCancelButton,
    EditableEditButton,
    EditableInput,
    EditablePreview,
    EditableSubmitButton,
    Field,
    FieldLabel,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    ProgressCircular,
    Radio,
    RadioGroup,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Snippet,
    Switch,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableColumnHeader,
    TableContainer,
    TableHeader,
    TableRow,
    Tabs,
    Textarea,
    TextareaNoAutoSize,
    getActionKeyCode,
    positions,
    useControllable,
    useToast
} from "@dreamy-ui/react";
import {
    Badge,
    Divider,
    Flex,
    Grid,
    GridItem,
    HStack,
    Heading,
    Icon,
    Kbd,
    LightTheme,
    Skeleton,
    SkeletonText,
    Text,
    VStack
} from "@dreamy-ui/react/rsc";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import { PiConfetti } from "react-icons/pi";

export function meta() {
    return [
        {
            title: "Testing - Dreamy UI"
        }
    ];
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const value = formData.get("test-select");
    const sliderValue = formData.get("slider");
    const switchValue = formData.get("switch");
    const checkboxValue = formData.get("checkbox");

    console.table({
        value,
        sliderValue,
        switchValue: switchValue === "",
        checkboxValue: checkboxValue === ""
    });

    return {
        success: true
    };
}

export default function Test() {
    const [pin, setPin] = useState("123");
    const [count, setCount] = useState(0);
    const [checked, setChecked] = useState(false);
    const { isOpen, onClose, onOpen } = useControllable();

    return (
        <Flex
            col
            gap={10}
            align={"start"}
        >
            <ProgressCircular
                value={100}
                maxValue={200}
                showValueLabel
                // showValueLabel
                // isIndeterminate
            />

            <LightTheme>
                <Flex
                    bg={"bg"}
                    h={12}
                    col
                    flexDir={"row"}
                    gap={2}
                    flexDirection={"column"}
                >
                    <Text semibold>{getActionKeyCode()}</Text>
                    <Text fontWeight={"semibold"}>aaa</Text>
                </Flex>
            </LightTheme>

            <Image
                src={"/sdfas"}
                fallbackSrc="skibidi"
            />

            <Button
                variant={"tertiary"}
                w="fit"
                rightIcon={<IoAdd />}

                // isLoading
                // isDisabled
            >
                aaa
            </Button>

            <Editable
                defaultValue="meow"
                placeholder="Enter a word"
                useDoubleClick
            >
                <EditablePreview />
                <EditableInput />
                <HStack>
                    <EditableEditButton />
                    <EditableSubmitButton />
                    <EditableCancelButton />
                </HStack>
            </Editable>

            <Toaster />

            <Textarea onChangeValue={(v) => console.log(v)} />
            <TextareaNoAutoSize onChangeValue={(v) => console.log(v)} />
            <Input onChangeValue={(v) => console.log(v)} />

            <Flex w={"3xl"}>
                <Select>
                    <SelectTrigger w={"200px"} />
                    <SelectContent>
                        <SelectItem value={"meow"}>meow</SelectItem>
                        <SelectItem value={"woof"}>woof</SelectItem>
                    </SelectContent>
                </Select>
            </Flex>

            <Button
                size={"lg"}
                isDisabled
                onClick={() => console.log("clicked")}
                leftIcon={
                    <Icon
                        as={PiConfetti}
                        boxSize={"3"}
                    />
                }
            >
                big icon test
            </Button>

            <ControlledField />

            {/* {(["xs", "sm", "md", "lg"] as const).map((size) => (
                <Menu
                    key={size}
                    size={size}
                    placement="right-start"
                >
                    <MenuTrigger>
                        <Button w={"fit-content"}>Menu</Button>
                    </MenuTrigger>
                    <MenuContent>
                        <MenuItem
                            icon={<IoAdd />}
                            command={`${useActionKey()} k`}
                        >
                            Menu
                        </MenuItem>
                        <MenuItem
                            icon={<IoAdd />}
                            command={`${useActionKey()} i`}
                            // as={<Link to="/">Menu</Link>}
                        >
                            Menu
                        </MenuItem>
                        <MenuItem
                            icon={<IoAdd />}
                            command={`${useActionKey()} s`}
                        >
                            Menu
                        </MenuItem>
                    </MenuContent>
                </Menu>
            ))} */}
            <Switch
                size={"sm"}
                onChangeValue={(e) => console.log(e)}
            >
                Hello
            </Switch>
            <Switch
                size={"md"}
                onChangeValue={(e) => console.log(e)}
                icon={<IoAdd />}
            >
                Hello
            </Switch>
            <Switch
                size={"lg"}
                onChangeValue={(e) => console.log(e)}
            >
                Hello
            </Switch>
            <Checkbox onChangeValue={(e) => console.log(e)}>Hello</Checkbox>

            <PinInput
                value={pin}
                onChange={setPin}
            >
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>

            {/* <Flex col gap={4} as={<Form method="post" reloadDocument />}>
				<Select
					selectedItemBackgroundScheme={"none"}
					name={"test-select"}
					autoComplete="on"
					isClearable
					// variant={"solid"}
				>
					<SelectTrigger placeholder={"Select type"} />
					<SelectContent>
						{Array.from({ length: 100 }).map((_, i) => (
							<SelectItem key={i} value={i.toString()}>
								{i}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Slider name={"slider"} defaultValue={25}>
					<SliderTrack>
						<SliderFilledTrack />
						<SliderThumb />
					</SliderTrack>
				</Slider>
				<Switch
					autoComplete="on"
					name={"switch"}
					size={"md"}
					onChangeValue={(e) => console.log(e)}
					icon={IoAdd}
				>
					Hello
				</Switch>
				<Checkbox
					autoComplete="on"
					name={"checkbox"}
					onChangeValue={(e) => console.log(e)}
				>
					Hello
				</Checkbox>
				<Button
					type="submit"
					color={"primary"}
					isLoading={navigation.state === "submitting"}
				>
					Submit
				</Button>
			</Flex> */}

            <RadioGroup>
                <Radio value={"primary"}>Primary</Radio>
                <Radio value={"secondary"}>Secondary</Radio>
            </RadioGroup>

            <Flex
                gap={4}
                row
            >
                <Skeleton
                    boxSize="10"
                    rounded={"full"}
                />
                <SkeletonText
                    variant={"shine"}
                    maxW="100%"
                    lines={2}
                />
            </Flex>

            <Button onClick={onOpen}>Open Modal</Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Modal</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>This is a modal!</ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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

            <TableContainer
                variant={"simple"}
                size="sm"
            >
                <Table>
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
            </TableContainer>
            <TableContainer
                variant={"simple"}
                withBackground
                size="md"
                interactive
            >
                <Table>
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
            </TableContainer>
            <TableContainer
                variant={"line"}
                size="md"
                striped
                showColumnBorder
            >
                <Table>
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
            </TableContainer>
            <TableContainer
                variant={"simple"}
                size="lg"
            >
                <Table>
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
            </TableContainer>

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
                scheme={"info"}
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
                    left={0}
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

function ControlledField() {
    const [field, setField] = useState("");

    return (
        <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
                value={field}
                onChange={(e) => setField(e.target.value)}
            />
        </Field>
    );
}

function Toaster() {
    const { toast } = useToast();

    return (
        <Flex
            wrapped
            gap={2}
        >
            {positions.map((position) => (
                <Button
                    key={`${position}-button-toast`}
                    w={"fit-content"}
                    onClick={() => {
                        toast({
                            title: "This is a nice title!",
                            position,
                            isClosable: true
                            // status: "success",
                            // description: "This is a description for status"
                            // isClosable: true,
                            // rightContent: (
                            // 	<Button size={"sm"} color={"error"}>
                            // 		Hello
                            // 	</Button>
                            // ),
                            // render: (toast) => (
                            // 	<Button size={"sm"} color={"error"}>
                            // 		{toast.title}
                            // 	</Button>
                            // ),
                            // duration: 20000
                        });
                    }}
                >
                    {position}
                </Button>
            ))}
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
                onChangeValue={setReversedValue}
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
                onChangeValue={setReversedValue}
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
