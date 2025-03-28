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
    FieldError,
    FieldErrorIcon,
    FieldHelpText,
    FieldLabel,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    MotionBox,
    PinInput,
    PinInputField,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Radio,
    RadioGroup,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    Slider,
    SliderFilledTrack,
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
    TableCell,
    TableColumnHeader,
    TableContainer,
    TableHeader,
    TableRow,
    Tabs,
    Textarea,
    TextareaNoAutoSize,
    Tooltip,
    useToast
} from "@dreamy-ui/react";
import {
    Alert,
    Badge,
    Box,
    DarkTheme,
    Divider,
    Link as DreamLink,
    Flex,
    Grid,
    GridItem,
    Group,
    HStack,
    Heading,
    type HeadingProps,
    Icon,
    ImageRSC,
    InputRSC,
    Kbd,
    LightTheme,
    List,
    ListItem,
    Progress,
    Skeleton,
    SkeletonText,
    Stack,
    Text,
    TextareaRSC,
    VStack,
    VisuallyHidden,
    VisuallyHiddenInput,
    Wrap
} from "@dreamy-ui/react/rsc";
import type * as mdx from "@mdx-js/react";
import { Link as RemixLink, useLocation } from "@remix-run/react";
import { MDXRemote } from "next-mdx-remote";
import type React from "react";
import { type PropsWithChildren, type ReactNode, useEffect, useMemo, useState } from "react";
import { BiHome, BiSearch } from "react-icons/bi";
import { FiCoffee } from "react-icons/fi";
import { HiExternalLink, HiOutlineMail } from "react-icons/hi";
import { IoAdd, IoClose } from "react-icons/io5";
import {
    LuAlarmClock,
    LuBattery,
    LuChevronDown,
    LuChevronRight,
    LuTrash,
    LuWarehouse
} from "react-icons/lu";
import { PiConfetti } from "react-icons/pi";
import type { MdxContent } from "~/src/.server/docs";
import { PlatformSpecificKbd } from "~/src/ui/docs/components/kbds";
import { ControlledMenu, InteractiveMenu, VariantMenu, VariantMenus } from "~/src/ui/docs/components/menus";
import {
    BasicModal,
    PlacementModal,
    ScrollableInsideModal,
    ScrollableOutsideModal,
    SizeModals
} from "~/src/ui/docs/components/modals";
import {
    ControlledPopover,
    FocusPopover,
    PlacementPopovers,
    SizePopovers
} from "~/src/ui/docs/components/popovers";
import { Link } from "~/src/ui/global/Link";
import { ControlledAccordion } from "./components/accordions";
import {
    CheckboxCardGroupControl,
    CheckboxGroupControl,
    ControlledCheckbox,
    ControlledCheckboxCard
} from "./components/checkboxes";
import {
    ControlledEditable,
    FinalFocusRefEditable,
    StartWithEditViewEditable
} from "./components/editables";
import {
    UseActionKey,
    UseCanUseDOM,
    UseClipboard,
    UseColorMode,
    UseControllable,
    UseControllableModal,
    UseEventListener,
    UseReducedMotion,
    UseUpdateEffect
} from "./components/hooks";
import { ControlledPinInput } from "./components/inputs";
import { LinkButton } from "./components/others";
import { AsyncSelect, ControlledSelect } from "./components/selects";
import { ControlledSlider, MaxMinSlider } from "./components/sliders";
import { ControlledSwitch } from "./components/switches";
import { ControlledTabs, VariantTabs } from "./components/tabs";
import { UpdateToast } from "./components/toasts";
import { Collapsed, Scaled } from "./components/transitions";

interface Props {
    mdxContent: MdxContent;
}

export default function MDXContent({ mdxContent }: Props) {
    const { toast } = useToast();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        (window as any).toast = toast;
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    return useMemo(() => {
        return (
            <MDXRemote
                {...mdxContent}
                components={{ ...components, toast }}
            />
        );
    }, [mdxContent.compiledSource]);
}

export function createHId(text: ReactNode) {
    return text
        ?.toString()
        .replaceAll(" ", "-")
        .replaceAll(".", "")
        .replaceAll("/", "")
        .replaceAll("?", "")
        .toLowerCase();
}

const DreamComponents = {
    Alert,
    Box,
    Flex,
    Button,
    Icon,
    Heading,
    Link: DreamLink,
    Text,
    Stack,
    VStack,
    HStack,
    Divider,
    Avatar,
    Progress,
    Input,
    Textarea,
    Image,
    Field,
    FieldLabel,
    FieldError,
    FieldErrorIcon,
    FieldHelpText,
    List,
    ListItem,
    BasicModal,
    ScrollableInsideModal,
    ScrollableOutsideModal,
    SizeModals,
    PlacementModal,
    PinInput,
    PinInputField,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    AvatarGroup,
    Badge,
    // BasicPopover,
    SizePopovers,
    ControlledPopover,
    FocusPopover,
    PlacementPopovers,
    Kbd,
    PlatformSpecificKbd,
    ControlledSlider,
    MaxMinSlider,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    VariantTabs,
    ControlledTabs,
    Checkbox,
    CheckboxGroup,
    CheckboxGroupControl,
    CheckboxCard,
    CheckboxCardGroupControl,
    Wrapper,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableColumnHeader,
    ImageRSC,
    InputRSC,
    TextareaRSC,
    TextareaNoAutoSize,
    Grid,
    GridItem,
    Tooltip,
    VisuallyHidden,
    Skeleton,
    SkeletonText,
    Radio,
    RadioGroup,
    Snippet,
    VisuallyHiddenInput,
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    AsyncSelect,
    ControlledSelect,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    Collapsed,
    Scaled,
    ControlledAccordion,
    ControlledPinInput,
    Switch,
    ControlledCheckbox,
    ControlledCheckboxCard,
    ControlledSwitch,
    Menu,
    MenuTrigger,
    MenuContent,
    MenuItem,
    RemixLink,
    ControlledMenu,
    InteractiveMenu,
    Portal,
    ControlledEditable,
    FinalFocusRefEditable,
    TableContainer,
    UpdateToast,
    Editable,
    EditablePreview,
    EditableInput,
    EditableEditButton,
    EditableSubmitButton,
    EditableCancelButton,
    StartWithEditViewEditable,
    UseColorMode,
    UseReducedMotion,
    UseCanUseDOM,
    UseActionKey,
    UseEventListener,
    UseControllable,
    UseControllableModal,
    UseUpdateEffect,
    UseClipboard,
    DarkTheme,
    LightTheme,
    Group,
    LinkButton,
    Wrap,
    VariantMenus,
    VariantMenu
};

function Wrapper({ children }: PropsWithChildren) {
    return (
        <Flex
            col
            gap={2}
            p={4}
            rounded={"l4"}
            border={"1px solid"}
            borderColor={"border"}
            w={"full"}
            align={"flex-start"}
        >
            {children}
        </Flex>
    );
}

const icons = {
    IoClose,
    HiOutlineMail,
    FiCoffee,
    BiSearch,
    PiConfetti,
    IoAdd,
    BiHome,
    LuAlarmClock,
    LuBattery,
    LuTrash,
    LuWarehouse,
    LuChevronDown,
    LuChevronRight
};

const components = {
    p: (props) => (
        <Text
            mb={2}
            color={"fg.medium"}
            fontWeight={400}
            {...props}
        />
    ),
    h1: (props) => (
        <DefaultHeading
            as="h2"
            size={"3xl"}
            mt={10}
            mb={3}
            {...props}
        />
    ),
    h2: (props) => (
        <DefaultHeading
            as="h3"
            size={"2xl"}
            mt={6}
            mb={2}
            {...props}
        />
    ),
    h3: (props) => (
        <DefaultHeading
            as="h4"
            size={"lg"}
            fontWeight={600}
            mt={4}
            mb={1}
            {...props}
        />
    ),
    hr: (props) => (
        <Divider
            my={4}
            {...props}
        />
    ),
    a: ({ href, children, ...props }) => {
        const isExternal = href?.startsWith("http");

        if (href?.startsWith("/")) {
            return (
                <Link
                    to={href || "#"}
                    target={isExternal ? "_blank" : undefined}
                    _hover={{
                        textDecoration: "underline"
                    }}
                    color={"secondary"}
                    {...props}
                >
                    {children}{" "}
                    {isExternal && (
                        <Icon
                            as={HiExternalLink}
                            display={"inline-block"}
                        />
                    )}
                </Link>
            );
        }

        return (
            <DreamLink
                href={href || "#"}
                target={isExternal ? "_blank" : undefined}
                _hover={{
                    textDecoration: "underline"
                }}
                color={"secondary"}
                {...props}
            >
                {children}{" "}
                {isExternal && (
                    <Icon
                        as={HiExternalLink}
                        display={"inline-block"}
                    />
                )}
            </DreamLink>
        );
    },
    em: (props: any) => (
        <Text
            as="em"
            fontStyle="italic"
            {...props}
        />
    ),
    blockquote: (props) => {
        const { children, ...rest } = props as {
            children: any[];
            [key: string]: any;
        };

        if (typeof children !== "object") {
            console.error("blockquote must have object children", children);

            return (
                <Alert
                    {...rest}
                    status="error"
                    boxShadow={"xs"}
                    title="Error parsing blockquote"
                />
            );
        }

        const contentChildren = children?.find(
            (child) => typeof child === "object" && "props" in child
        ).props.children;

        let statusText: string;
        if (typeof contentChildren === "string") {
            statusText = contentChildren;
        } else {
            statusText = contentChildren[0];
        }

        const status = statusText.startsWith("warning:")
            ? "warning"
            : statusText.startsWith("error:")
                ? "error"
                : statusText.startsWith("info:")
                    ? "info"
                    : statusText.startsWith("success:")
                        ? "success"
                        : "warning";

        let content: ReactNode = [];

        if (typeof contentChildren === "string") {
            content = contentChildren.replace(/^(warning|error|info|success):/, "");
        } else {
            content = contentChildren.map((child: any, index: number) => {
                if (index === 0) {
                    return child.replace(/^(warning|error|info|success):/, "");
                }

                return child;
            });
        }

        return (
            <Alert
                status={status}
                mt={4}
                {...rest}
                boxShadow={"xs"}
                title={content}
            />
        );
    },
    img: ({ alt = "image", ...props }) => {
        const isFullWidth = props.src?.includes("fullwidth=true");

        return (
            <Flex
                as={"span"}
                w={"fit-content"}
                display={"inline-flex"}
                col
                alignItems={"center"}
                maxW={isFullWidth ? "3xl" : "lg"}
            >
                <Image
                    alt={alt}
                    rounded={"md"}
                    loading="lazy"
                    {...props}
                />
                {alt && (
                    <Text
                        as={"span"}
                        aria-hidden="true"
                        fontWeight={500}
                        fontSize={"sm"}
                        color={"fg.disabled"}
                        bottom={1}
                    >
                        {alt}
                    </Text>
                )}
            </Flex>
        );
    },
    ul: (props) => (
        <List
            unordered
            {...props}
        />
    ),
    ol: (props) => (
        <List
            ordered
            {...props}
        />
    ),
    li: (props) => <ListItem {...props} />,
    strong: (props: any) => (
        <Text
            as="strong"
            color={"fg"}
            fontWeight={600}
            {...props}
        />
    ),
    ...DreamComponents,
    ...icons
} satisfies React.ComponentProps<typeof mdx.MDXProvider>["components"];

function DefaultHeading({ mt, mb, ...props }: HeadingProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hash = useLocation().hash;
    const hId = useMemo(() => createHId(props.children), [props.children]);

    return (
        <Flex
            mt={mt}
            mb={mb}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            _first={{ mt: 0 }}
            w={"fit-content"}
            flex={1}
        >
            <MotionBox
                overflow={"hidden"}
                initial={false}
                animate={{
                    width: isHovered ? "auto" : 0,
                    opacity: isHovered ? 1 : 0
                }}
            >
                <DreamLink
                    tabIndex={-1}
                    href={`#${hId}`}
                    cursor="pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                >
                    <Heading
                        id={hId}
                        {...props}
                        pr={1}
                    >
                        #
                    </Heading>
                </DreamLink>
            </MotionBox>

            <DreamLink
                href={`#${hId}`}
                scrollMarginTop={24}
                cursor="pointer"
                w={"fit-content"}
            >
                <Heading
                    id={hId}
                    textDecoration={hash === `#${hId}` ? "underline" : "none"}
                    scrollMarginTop={24}
                    // lineClamp={1}
                    _hover={{
                        textDecoration: "underline"
                    }}
                    {...props}
                />
            </DreamLink>
        </Flex>
    );
}
