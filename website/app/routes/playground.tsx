import {
    Accordion,
    ActionBar,
    Alert,
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    CheckboxCard,
    CheckboxGroup,
    CloseButton,
    Collapse,
    DarkTheme,
    Divider,
    Editable,
    Field,
    Flex,
    Grid,
    GridItem,
    Group,
    HStack,
    Heading,
    Icon,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Kbd,
    LightTheme,
    List,
    Menu,
    Modal,
    MotionBox,
    PinInput,
    Popover,
    Progress,
    ProgressCircular,
    Radio,
    RadioCard,
    RadioGroup,
    RangeSlider,
    Scale,
    Select,
    Skeleton,
    SkeletonText,
    Slider,
    Snippet,
    Span,
    Spinner,
    Stack,
    Stat,
    Switch,
    Table,
    Tabs,
    Text,
    Textarea,
    Tooltip,
    VStack,
    VisuallyHidden,
    Wrap
} from "@/ui";
import { Link as DreamyLink } from "@/ui";
import { useControllable, useToast } from "@dreamy-ui/react";
import { type PropsWithChildren, useState } from "react";
import { IoAdd } from "react-icons/io5";
import {
    LuCheck,
    LuChevronRight,
    LuFile,
    LuMail,
    LuPen,
    LuSave,
    LuSearch,
    LuSettings,
    LuTrash,
    LuX
} from "react-icons/lu";
import { Link, ReactRouterLink } from "~/src/ui/global/Link";

export function meta() {
    return [
        {
            title: "Playground - Dreamy UI"
        }
    ];
}

export default function playground() {
    return (
        <Flex
            col
            full
            gap={10}
            itemsStart
        >
            <Component
                componentName="Accordion"
                docsPath="/docs/components/accordion"
            >
                <Category name="Basic">
                    <Accordion.Root
                        defaultIndex={[0]}
                        w={"xs"}
                    >
                        <Accordion.Item>
                            <Accordion.Trigger>Item 1</Accordion.Trigger>
                            <Accordion.Content>Content for item 1</Accordion.Content>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Trigger>Item 2</Accordion.Trigger>
                            <Accordion.Content>Content for item 2</Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>
                </Category>
            </Component>

            <Component
                componentName="Action Bar"
                docsPath="/docs/components/action-bar"
            >
                <Category name="Basic">
                    <ActionBarExample />
                </Category>
            </Component>

            <Component
                componentName="Alert"
                docsPath="/docs/components/alert"
            >
                <Category
                    column
                    name="Status"
                >
                    <Alert
                        description="This is an info alert"
                        status="info"
                        title="Info"
                    />
                    <Alert
                        description="This is a success alert"
                        status="success"
                        title="Success"
                    />
                    <Alert
                        description="This is a warning alert"
                        status="warning"
                        title="Warning"
                    />
                    <Alert
                        description="This is an error alert"
                        status="error"
                        title="Error"
                    />
                </Category>
            </Component>

            <Component
                componentName="Avatar"
                docsPath="/docs/components/avatar"
            >
                <Category name="Basic">
                    <Group>
                        <Avatar name="John Doe" />
                        <Avatar name="Jane Smith" />
                        <Avatar
                            name="User"
                            src="https://i.pravatar.cc/150?img=3"
                        />
                    </Group>
                </Category>
                <Category name="Group">
                    <AvatarGroup maxAvatars={3}>
                        <Avatar name="John Doe" />
                        <Avatar name="Jane Smith" />
                        <Avatar name="Bob Johnson" />
                        <Avatar name="Alice Brown" />
                    </AvatarGroup>
                </Category>
            </Component>

            <Component
                componentName="Badge"
                docsPath="/docs/components/badge"
            >
                <Category name="Variant">
                    <Group>
                        <Badge variant="subtle">Subtle</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="plain">Plain</Badge>
                    </Group>
                </Category>
                <Category name="Scheme">
                    <Group>
                        <Badge scheme="primary">Primary</Badge>
                        <Badge scheme="success">Success</Badge>
                        <Badge scheme="error">Error</Badge>
                        <Badge scheme="warning">Warning</Badge>
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Box"
                docsPath="/docs/components/box"
            >
                <Category name="Basic">
                    <Box
                        bg="alpha.100"
                        p={4}
                        rounded="l2"
                    >
                        <Text>This is a box component</Text>
                    </Box>
                </Category>
            </Component>

            <Component
                componentName="Breadcrumb"
                docsPath="/docs/components/breadcrumb"
            >
                <Category name="Basic">
                    <Breadcrumb.Root>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator>
                                <Icon as={LuChevronRight} />
                            </Breadcrumb.Separator>
                            <Breadcrumb.Item>
                                <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator>
                                <Icon as={LuChevronRight} />
                            </Breadcrumb.Separator>
                            <Breadcrumb.Item>
                                <Breadcrumb.CurrentLink>Components</Breadcrumb.CurrentLink>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </Category>
            </Component>

            <Component
                componentName="Button"
                docsPath="/docs/components/button"
            >
                <Category name="Variant">
                    <Button variant="primary">
                        Save
                        <Icon as={LuSave} />
                    </Button>
                    <Button variant="secondary">
                        Save
                        <Icon as={LuSave} />
                    </Button>
                    <Button variant="solid">
                        Save
                        <Icon as={LuSave} />
                    </Button>
                    <Button variant="outline">
                        Save
                        <Icon as={LuSave} />
                    </Button>
                    <Button variant="ghost">
                        Save
                        <Icon as={LuSave} />
                    </Button>
                </Category>

                <Category name="Scheme">
                    <Button
                        scheme="error"
                        variant="solid"
                    >
                        Save
                        <Icon as={LuSave} />
                    </Button>
                    <Button
                        scheme="success"
                        variant="outline"
                    >
                        Save
                        <Icon as={LuSave} />
                    </Button>
                    <Button
                        scheme="warning"
                        variant="ghost"
                    >
                        Save
                        <Icon as={LuSave} />
                    </Button>
                </Category>
            </Component>

            <Component
                componentName="Card"
                docsPath="/docs/components/card"
            >
                <Category name="Basic">
                    <Card.Root
                        full
                        maxW="sm"
                    >
                        <Card.Header>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Description>Card description goes here</Card.Description>
                        </Card.Header>
                        <Card.Body>
                            <Text>This is the card body content.</Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button>Action</Button>
                        </Card.Footer>
                    </Card.Root>
                </Category>
            </Component>

            <Component
                componentName="Checkbox Card"
                docsPath="/docs/components/checkbox-card"
            >
                <Category name="Basic">
                    <Group>
                        <CheckboxCard
                            description="Description for option 1"
                            title="Option 1"
                            value="option1"
                            w={"xs"}
                        />
                        <CheckboxCard
                            description="Description for option 2"
                            title="Option 2"
                            value="option2"
                            w={"xs"}
                        />
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Checkbox"
                docsPath="/docs/components/checkbox"
            >
                <Category name="Basic">
                    <Group>
                        <Checkbox>Default</Checkbox>
                        <Checkbox defaultIsChecked>Checked</Checkbox>
                        <Checkbox isIndeterminate>Indeterminate</Checkbox>
                    </Group>
                </Category>
                <Category name="Group">
                    <CheckboxGroup defaultValue={["option1"]}>
                        <Checkbox value="option1">Option 1</Checkbox>
                        <Checkbox value="option2">Option 2</Checkbox>
                        <Checkbox value="option3">Option 3</Checkbox>
                    </CheckboxGroup>
                </Category>
            </Component>

            <Component
                componentName="Close Button"
                docsPath="/docs/components/close-button"
            >
                <Category name="Basic">
                    <Group>
                        <CloseButton />
                        <CloseButton size="md" />
                        <CloseButton size="lg" />
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Divider"
                docsPath="/docs/components/divider"
            >
                <Category name="Orientation">
                    <Box w="full">
                        <Divider orientation="horizontal" />
                    </Box>
                    <Box w="full">
                        <Divider
                            h={"20"}
                            orientation="vertical"
                        />
                    </Box>
                </Category>
            </Component>

            <Component
                componentName="Editable"
                docsPath="/docs/components/editable"
            >
                <Category name="Basic">
                    <Editable.Root
                        defaultValue="Click to edit"
                        w="xs"
                    >
                        {({ isEditing }) => (
                            <>
                                <Editable.Preview />
                                <Editable.Input />
                                <Group>
                                    {!isEditing ? (
                                        <Editable.EditButton>
                                            <Icon as={LuPen} />
                                        </Editable.EditButton>
                                    ) : (
                                        <>
                                            <Editable.SubmitButton>
                                                <Icon as={LuCheck} />
                                            </Editable.SubmitButton>
                                            <Editable.CancelButton>
                                                <Icon as={LuX} />
                                            </Editable.CancelButton>
                                        </>
                                    )}
                                </Group>
                            </>
                        )}
                    </Editable.Root>
                </Category>
            </Component>

            <Component
                componentName="Field"
                docsPath="/docs/components/field"
            >
                <Category
                    column
                    name="Basic"
                >
                    <Field.Root
                        isRequired
                        label="Email"
                        w="xs"
                    >
                        <Input
                            placeholder="Enter your email"
                            type="email"
                        />
                    </Field.Root>
                    <Field.Root
                        hint="Must be at least 8 characters"
                        label="Password"
                        w="xs"
                    >
                        <Input
                            placeholder="Enter your password"
                            type="password"
                        />
                    </Field.Root>
                </Category>
            </Component>

            <Component
                componentName="Flex"
                docsPath="/docs/components/flex"
            >
                <Category name="Basic">
                    <Flex
                        align="center"
                        gap={4}
                        w="full"
                    >
                        <Box
                            bg="alpha.100"
                            p={4}
                            rounded="l2"
                        >
                            <Text>Item 1</Text>
                        </Box>
                        <Box
                            bg="alpha.100"
                            p={4}
                            rounded="l2"
                        >
                            <Text>Item 2</Text>
                        </Box>
                        <Box
                            bg="alpha.100"
                            p={4}
                            rounded="l2"
                        >
                            <Text>Item 3</Text>
                        </Box>
                    </Flex>
                </Category>
            </Component>

            <Component
                componentName="Grid"
                docsPath="/docs/components/grid"
            >
                <Category name="Basic">
                    <Grid
                        columns={3}
                        gap={4}
                        w="full"
                    >
                        <GridItem>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                            >
                                <Text>Item 1</Text>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                            >
                                <Text>Item 2</Text>
                            </Box>
                        </GridItem>
                        <GridItem>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                            >
                                <Text>Item 3</Text>
                            </Box>
                        </GridItem>
                    </Grid>
                </Category>
            </Component>

            <Component
                componentName="Group"
                docsPath="/docs/components/group"
            >
                <Category name="Basic">
                    <Group attached>
                        <Button variant="outline">First</Button>
                        <Button variant="outline">Second</Button>
                        <Button variant="outline">Third</Button>
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Heading"
                docsPath="/docs/components/heading"
            >
                <Category
                    column
                    name="Sizes"
                >
                    <Heading size="xs">Extra Small Heading</Heading>
                    <Heading size="sm">Small Heading</Heading>
                    <Heading size="md">Medium Heading</Heading>
                    <Heading size="lg">Large Heading</Heading>
                    <Heading size="xl">Extra Large Heading</Heading>
                </Category>
            </Component>

            <Component
                componentName="Icon Button"
                docsPath="/docs/components/icon-button"
            >
                <Category name="Basic">
                    <Group>
                        <IconButton
                            aria-label="Settings"
                            icon={<Icon as={LuSettings} />}
                        />
                        <IconButton
                            aria-label="Settings"
                            icon={<Icon as={LuSettings} />}
                            variant="outline"
                        />
                        <IconButton
                            aria-label="Settings"
                            icon={<Icon as={LuSettings} />}
                            variant="ghost"
                        />
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Icon"
                docsPath="/docs/components/icon"
            >
                <Category name="Sizes">
                    <Group>
                        <Icon
                            as={LuSave}
                            size="xs"
                        />
                        <Icon
                            as={LuSave}
                            size="sm"
                        />
                        <Icon
                            as={LuSave}
                            size="md"
                        />
                        <Icon
                            as={LuSave}
                            size="lg"
                        />
                        <Icon
                            as={LuSave}
                            size="xl"
                        />
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Image"
                docsPath="/docs/components/image"
            >
                <Category name="Basic">
                    <Image
                        alt="Nature"
                        h={40}
                        objectFit="cover"
                        rounded="l2"
                        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400"
                        w="xs"
                    />
                </Category>
            </Component>

            <Component
                componentName="Input"
                docsPath="/docs/components/input"
            >
                <Category
                    column
                    name="Basic"
                >
                    <Input
                        placeholder="Basic input"
                        w="xs"
                    />
                    <InputGroup
                        leftElement={<Icon as={LuSearch} />}
                        w="xs"
                    >
                        <Input placeholder="With left element" />
                    </InputGroup>
                    <InputGroup
                        rightElement={<Icon as={LuMail} />}
                        w="xs"
                    >
                        <Input placeholder="With right element" />
                    </InputGroup>
                </Category>
            </Component>

            <Component
                componentName="Kbd"
                docsPath="/docs/components/kbd"
            >
                <Category name="Basic">
                    <Group>
                        <Kbd>Shift</Kbd>
                        <Text>+</Text>
                        <Kbd>Ctrl</Kbd>
                        <Text>+</Text>
                        <Kbd>P</Kbd>
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Link"
                docsPath="/docs/components/link"
            >
                <Category name="Basic">
                    <Group>
                        <DreamyLink href="#">Basic Link</DreamyLink>
                        <DreamyLink
                            href="#"
                            isExternal
                        >
                            External Link
                        </DreamyLink>
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="List"
                docsPath="/docs/components/list"
            >
                <Category name="Types">
                    <Flex
                        gap={8}
                        w="full"
                    >
                        <List.Root ordered>
                            <List.Item>First item</List.Item>
                            <List.Item>Second item</List.Item>
                            <List.Item>Third item</List.Item>
                        </List.Root>
                        <List.Root unordered>
                            <List.Item>First item</List.Item>
                            <List.Item>Second item</List.Item>
                            <List.Item>Third item</List.Item>
                        </List.Root>
                    </Flex>
                </Category>
            </Component>

            <Component
                componentName="Menu"
                docsPath="/docs/components/menu"
            >
                <Category name="Basic">
                    <Menu.Root>
                        <Menu.Trigger>
                            <Button variant="outline">Open Menu</Button>
                        </Menu.Trigger>
                        <Menu.Content>
                            <Menu.Item
                                as={<ReactRouterLink to="/new-file" />}
                                command="{actionKey} n"
                                icon={<IoAdd />}
                            >
                                New File
                            </Menu.Item>
                            <Menu.Item command="{actionKey} o">Open</Menu.Item>
                            <Menu.Item
                                command="{actionKey} s"
                                icon={<LuSave />}
                            >
                                Save
                            </Menu.Item>
                            <Menu.Item
                                command="{actionKey} d"
                                icon={<LuTrash />}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Root>
                </Category>
            </Component>

            <Component
                componentName="Modal"
                docsPath="/docs/components/modal"
            >
                <Category name="Basic">
                    <ModalExample />
                </Category>
            </Component>

            <Component
                componentName="Motion"
                docsPath="/docs/components/motion"
            >
                <Category name="Basic">
                    <MotionBox
                        animate={{ scale: [1, 1.1, 1] }}
                        bg="alpha.100"
                        p={4}
                        rounded="l2"
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        w="fit"
                    >
                        <Text>Animated Box</Text>
                    </MotionBox>
                </Category>
            </Component>

            <Component
                componentName="Pin Input"
                docsPath="/docs/components/pin-input"
            >
                <Category name="Basic">
                    <PinInput.Root>
                        <Group>
                            <PinInput.Field />
                            <PinInput.Field />
                            <PinInput.Field />
                            <PinInput.Field />
                        </Group>
                    </PinInput.Root>
                </Category>
            </Component>

            <Component
                componentName="Popover"
                docsPath="/docs/components/popover"
            >
                <Category name="Basic">
                    <Popover.Root>
                        <Popover.Trigger>
                            <Button variant="outline">Open Popover</Button>
                        </Popover.Trigger>
                        <Popover.Content>
                            <Popover.Header>Popover Header</Popover.Header>
                            <Popover.Body>
                                <Text>This is the popover content.</Text>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Root>
                </Category>
            </Component>

            <Component
                componentName="Progress"
                docsPath="/docs/components/progress"
            >
                <Category
                    column
                    name="Basic"
                >
                    <Progress
                        aria-label="Loading"
                        value={60}
                        w="xs"
                    />
                    <Progress
                        aria-label="Loading"
                        w="xs"
                    />
                </Category>
            </Component>

            <Component
                componentName="Progress Circular"
                docsPath="/docs/components/progress-circular"
            >
                <Category name="Basic">
                    <Group>
                        <ProgressCircular value={60} />
                        <ProgressCircular
                            showValueLabel
                            value={75}
                        />
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Radio"
                docsPath="/docs/components/radio"
            >
                <Category name="Basic">
                    <RadioGroup defaultValue="1">
                        <Radio value="1">Option 1</Radio>
                        <Radio value="2">Option 2</Radio>
                        <Radio value="3">Option 3</Radio>
                    </RadioGroup>
                </Category>
            </Component>

            <Component
                componentName="Radio Card"
                docsPath="/docs/components/radio-card"
            >
                <Category name="Basic">
                    <RadioGroup defaultValue="card1">
                        <Group>
                            <RadioCard
                                description="Description for option 1"
                                title="Option 1"
                                value="card1"
                                w="xs"
                            />
                            <RadioCard
                                description="Description for option 2"
                                title="Option 2"
                                value="card2"
                                w="xs"
                            />
                        </Group>
                    </RadioGroup>
                </Category>
            </Component>

            <Component
                componentName="Range Slider"
                docsPath="/docs/components/range-slider"
            >
                <Category name="Basic">
                    <RangeSlider.Root
                        defaultValue={[25, 75]}
                        w="xs"
                    >
                        <RangeSlider.Track>
                            <RangeSlider.FilledTrack />
                        </RangeSlider.Track>
                        <RangeSlider.Thumb index={0} />
                        <RangeSlider.Thumb index={1} />
                    </RangeSlider.Root>
                </Category>
            </Component>

            <Component
                componentName="Select"
                docsPath="/docs/components/select"
            >
                <Category name="Basic">
                    <Select.Root
                        size="sm"
                        w="xs"
                    >
                        <Select.Trigger placeholder="Select an option" />
                        <Select.Content>
                            <Select.Item value="option1">Option 1</Select.Item>
                            <Select.Item value="option2">Option 2</Select.Item>
                            <Select.Item value="option3">Option 3</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Category>
            </Component>

            <Component
                componentName="Skeleton"
                docsPath="/docs/components/skeleton"
            >
                <Category
                    column
                    name="Basic"
                >
                    <Skeleton
                        h={10}
                        w="xs"
                    />
                    <SkeletonText
                        lines={3}
                        w="xs"
                    />
                </Category>
            </Component>

            <Component
                componentName="Slider"
                docsPath="/docs/components/slider"
            >
                <Category name="Basic">
                    <Slider.Root
                        defaultValue={50}
                        w="xs"
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                    </Slider.Root>
                </Category>
            </Component>

            <Component
                componentName="Snippet"
                docsPath="/docs/components/snippet"
            >
                <Category name="Basic">
                    <Snippet w="xs">npm install @dreamy-ui/react</Snippet>
                </Category>
            </Component>

            <Component
                componentName="Span"
                docsPath="/docs/components/span"
            >
                <Category name="Basic">
                    <Text>
                        This is a paragraph with <Span fontWeight="bold">bold text</Span> using
                        Span.
                    </Text>
                </Category>
            </Component>

            <Component
                componentName="Spinner"
                docsPath="/docs/components/spinner"
            >
                <Category name="Basic">
                    <Group>
                        <Spinner />
                        <Spinner size="sm" />
                        <Spinner size="lg" />
                        <Spinner label="Loading..." />
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Stack"
                docsPath="/docs/components/stack"
            >
                <Category name="Types">
                    <Flex
                        col
                        gap={4}
                        w="full"
                    >
                        <HStack gap={4}>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                            >
                                <Text>Item 1</Text>
                            </Box>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                            >
                                <Text>Item 2</Text>
                            </Box>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                            >
                                <Text>Item 3</Text>
                            </Box>
                        </HStack>
                        <VStack gap={4}>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                                w="full"
                            >
                                <Text>Item 1</Text>
                            </Box>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                                w="full"
                            >
                                <Text>Item 2</Text>
                            </Box>
                            <Box
                                bg="alpha.100"
                                p={4}
                                rounded="l2"
                                w="full"
                            >
                                <Text>Item 3</Text>
                            </Box>
                        </VStack>
                    </Flex>
                </Category>
            </Component>

            <Component
                componentName="Stat"
                docsPath="/docs/components/stat"
            >
                <Category name="Basic">
                    <Stat.Root>
                        <Stat.Label>Total Revenue</Stat.Label>
                        <Stat.ValueText>
                            $12,345
                            <Stat.ValueUnit>USD</Stat.ValueUnit>
                        </Stat.ValueText>
                        <Stat.Hint>
                            <Stat.UpIndicator />
                            23.5%
                        </Stat.Hint>
                    </Stat.Root>
                </Category>
            </Component>

            <Component
                componentName="Switch"
                docsPath="/docs/components/switch"
            >
                <Category name="Basic">
                    <Group>
                        <Switch>Default</Switch>
                        <Switch defaultIsChecked>Checked</Switch>
                        <Switch isDisabled>Disabled</Switch>
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Table"
                docsPath="/docs/components/table"
            >
                <Category name="Basic">
                    <Table.Root w="full">
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Role</Table.ColumnHeader>
                                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>John Doe</Table.Cell>
                                    <Table.Cell>Developer</Table.Cell>
                                    <Table.Cell>Active</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jane Smith</Table.Cell>
                                    <Table.Cell>Designer</Table.Cell>
                                    <Table.Cell>Active</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Table>
                    </Table.Root>
                </Category>
            </Component>

            <Component
                componentName="Tabs"
                docsPath="/docs/components/tabs"
            >
                <Category name="Basic">
                    <Tabs.Root w="full">
                        <Tabs.List>
                            <Tabs.Tab>Tab 1</Tabs.Tab>
                            <Tabs.Tab>Tab 2</Tabs.Tab>
                            <Tabs.Tab>Tab 3</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panels>
                            <Tabs.Panel>
                                <Text>Content for Tab 1</Text>
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <Text>Content for Tab 2</Text>
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <Text>Content for Tab 3</Text>
                            </Tabs.Panel>
                        </Tabs.Panels>
                    </Tabs.Root>
                </Category>
            </Component>

            <Component
                componentName="Text"
                docsPath="/docs/components/text"
            >
                <Category
                    column
                    name="Variants"
                >
                    <Text>Default text paragraph</Text>
                    <Text
                        semibold
                        size="lg"
                    >
                        Large semibold text
                    </Text>
                    <Text
                        color="fg.medium"
                        size="sm"
                    >
                        Small muted text
                    </Text>
                </Category>
            </Component>

            <Component
                componentName="Textarea"
                docsPath="/docs/components/textarea"
            >
                <Category
                    column
                    name="Basic"
                >
                    <Textarea
                        placeholder="Enter your message..."
                        w="xs"
                    />
                    <Textarea
                        maxRows={5}
                        placeholder="With max rows"
                        w="xs"
                    />
                </Category>
            </Component>

            <Component
                componentName="Theme"
                docsPath="/docs/components/theme"
            >
                <Category name="Basic">
                    <Flex gap={4}>
                        <LightTheme p={4}>
                            <Text>Light Theme</Text>
                        </LightTheme>
                        <DarkTheme p={4}>
                            <Text>Dark Theme</Text>
                        </DarkTheme>
                    </Flex>
                </Category>
            </Component>

            <Component
                componentName="Toast"
                docsPath="/docs/components/toast"
            >
                <Category name="Basic">
                    <ToastExample />
                </Category>
            </Component>

            <Component
                componentName="Tooltip"
                docsPath="/docs/components/tooltip"
            >
                <Category name="Basic">
                    <Group>
                        <Tooltip content="This is a tooltip">
                            <Button variant="outline">Hover me</Button>
                        </Tooltip>
                        <Tooltip
                            content="Tooltip with arrow"
                            hasArrow
                        >
                            <Button variant="outline">With Arrow</Button>
                        </Tooltip>
                    </Group>
                </Category>
            </Component>

            <Component
                componentName="Transitions"
                docsPath="/docs/components/transitions"
            >
                <Category
                    column
                    name="Basic"
                >
                    <TransitionsExample />
                </Category>
            </Component>

            <Component
                componentName="Visually Hidden"
                docsPath="/docs/components/visually-hidden"
            >
                <Category name="Basic">
                    <Text>
                        This text is visible.
                        <VisuallyHidden>
                            This text is hidden but accessible to screen readers.
                        </VisuallyHidden>
                    </Text>
                </Category>
            </Component>

            <Component
                componentName="Wrap"
                docsPath="/docs/components/wrap"
            >
                <Category name="Basic">
                    <Wrap
                        gap={4}
                        w="full"
                    >
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Badge key={i}>Badge {i + 1}</Badge>
                        ))}
                    </Wrap>
                </Category>
            </Component>
        </Flex>
    );
}

function ToastExample() {
    const toast = useToast();

    return (
        <Group>
            <Button
                onClick={() =>
                    toast.toast({
                        title: "Success!",
                        description: "Your action was successful.",
                        status: "success"
                    })
                }
                variant="outline"
            >
                Show Toast
            </Button>
            <Button
                onClick={() =>
                    toast.toast({
                        title: "Error!",
                        description: "Something went wrong.",
                        status: "error",
                        isClosable: true
                    })
                }
                scheme="error"
                variant="outline"
            >
                Show Error
            </Button>
        </Group>
    );
}

function TransitionsExample() {
    const [showCollapse, setShowCollapse] = useState(false);
    const [showScale, setShowScale] = useState(false);

    return (
        <Flex
            col
            gap={4}
            w="full"
        >
            <Box>
                <Button
                    onClick={() => setShowCollapse(!showCollapse)}
                    size="sm"
                    variant="outline"
                >
                    Toggle Collapse
                </Button>
                <Collapse isOpen={showCollapse}>
                    <Box
                        bg="alpha.100"
                        mt={2}
                        p={4}
                        rounded="l2"
                    >
                        <Text>This content collapses and expands smoothly.</Text>
                    </Box>
                </Collapse>
            </Box>

            <Box>
                <Button
                    onClick={() => setShowScale(!showScale)}
                    size="sm"
                    variant="outline"
                >
                    Toggle Scale
                </Button>
                <Scale
                    isOpen={showScale}
                    unmountOnExit
                >
                    <Box
                        bg="alpha.100"
                        mt={2}
                        p={4}
                        rounded="l2"
                    >
                        <Text>This content scales in and out.</Text>
                    </Box>
                </Scale>
            </Box>
        </Flex>
    );
}

function ModalExample() {
    const { isOpen, onOpen, onClose } = useControllable();

    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>
            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Modal Title</Modal.Header>
                    <Modal.Body>
                        <Text>This is the modal content.</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClose}>Close</Button>
                    </Modal.Footer>
                    <Modal.CloseButton />
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

function ActionBarExample() {
    const { isOpen, onOpen, onClose, onToggle } = useControllable();

    return (
        <>
            <Button onClick={onToggle}>{isOpen ? "Close" : "Open"} Action Bar</Button>
            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <ActionBar.Content>
                    <Text>3 items selected</Text>
                    <ActionBar.Separator />
                    <Button
                        size="sm"
                        variant="ghost"
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

interface ComponentHeaderProps {
    componentName: string;
    docsPath: string;
}

function Component({ children, componentName, docsPath }: PropsWithChildren<ComponentHeaderProps>) {
    return (
        <Flex
            col
            full
            gap={4}
            itemsStart
        >
            <ComponentHeader
                componentName={componentName}
                docsPath={docsPath}
            />
            {children}
        </Flex>
    );
}

function ComponentHeader({ componentName, docsPath }: ComponentHeaderProps) {
    return (
        <Flex
            align={"center"}
            bg={"alpha.50"}
            full
            justify={"space-between"}
            px={5}
            py={3}
            rounded={"l2"}
        >
            <Text semibold>{componentName}</Text>

            <Link to={docsPath}>View in docs</Link>
        </Flex>
    );
}

function Category({
    children,
    name,
    column
}: PropsWithChildren<{ name: string; column?: boolean }>) {
    return (
        <Flex
            col
            full
            gap={4}
            itemsStart
            px={5}
        >
            <Text
                color={"fg.medium"}
                semibold
            >
                {name}
            </Text>
            <Group
                direction={column ? "column" : "row"}
                full
            >
                {children}
            </Group>
        </Flex>
    );
}
