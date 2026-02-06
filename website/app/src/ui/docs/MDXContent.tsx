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
    DarkTheme,
    DatePicker,
    Divider,
    Link as DreamLink,
    Editable,
    EmptyState,
    Field,
    Flex,
    type FlexProps,
    Grid,
    GridItem,
    Group,
    HStack,
    Heading,
    type HeadingProps,
    Icon,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Kbd,
    LightTheme,
    List,
    Menu,
    MotionBox,
    PinInput,
    Popover,
    Progress,
    ProgressCircular,
    Radio,
    RadioCard,
    RadioGroup,
    RangeSlider,
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
    TextareaNoAutoSize,
    Tooltip,
    VStack,
    VisuallyHidden,
    VisuallyHiddenInput,
    Wrap
} from "@/ui";
import { Portal, useToast } from "@dreamy-ui/react";
import { MDXRemote } from "next-mdx-remote";
import { type PropsWithChildren, type ReactNode, useEffect, useMemo, useState } from "react";
import { BiHome, BiSearch } from "react-icons/bi";
import { FaPaypal, FaReact, FaVuejs } from "react-icons/fa";
import { FiCoffee, FiCreditCard } from "react-icons/fi";
import { HiColorSwatch, HiExternalLink, HiOutlineMail } from "react-icons/hi";
import { IoAdd, IoClose } from "react-icons/io5";
import {
    LuAlarmClock,
    LuBanana,
    LuBattery,
    LuCherry,
    LuChevronDown,
    LuChevronRight,
    LuCitrus,
    LuDollarSign,
    LuFileWarning,
    LuHouse,
    LuLamp,
    LuShoppingCart,
    LuTrash,
    LuWarehouse
} from "react-icons/lu";
import { PiConfetti } from "react-icons/pi";
import { RiNextjsLine } from "react-icons/ri";
import { SiApple, SiReactrouter } from "react-icons/si";
import { Link as RemixLink, useLocation } from "react-router";
import type { MdxContent } from "~/src/.server/docs";
import { PlatformSpecificKbd } from "~/src/ui/docs/components/kbds";
import {
    ControlledMenu,
    InteractiveMenu,
    VariantMenu,
    VariantMenus
} from "~/src/ui/docs/components/menus";
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
import { ControlledTabs, VariantTabs } from "./components/Tabs";
import { ControlledAccordion } from "./components/accordions";
import {
    ActionBarMultiple,
    ActionBarSizes,
    ActionBarTable,
    ActionBarWithClose,
    ControlledActionBar
} from "./components/action-bars";
import { BarChartExample, LineChartExample, PieChartExample } from "./components/charts";
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
import { ControlledDatePicker, DatePickerWithFooter } from "./components/date-pickers";
import { ControlledPinInput } from "./components/inputs";
import { LinkButton } from "./components/others";
import { PMTabs } from "./components/pm-tabs";
import { ControlledRadioCards, ControlledRadios } from "./components/radioes";
import { ControlledRangeSlider, MaxMinRangeSlider } from "./components/range-sliders";
import { AsyncSelect, ControlledSelect } from "./components/selects";
import { ControlledSlider, MaxMinSlider } from "./components/sliders";
import { ControlledSwitch } from "./components/switches";
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
    const comps = useMemo(() => {
        return { ...components, toast };
    }, []);

    return useMemo(() => {
        return (
            <MDXRemote
                {...mdxContent}
                components={comps}
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
    Accordion,
    ActionBar,
    Breadcrumb,
    Text,
    Stack,
    VStack,
    HStack,
    Divider,
    Avatar,
    ControlledRadios,
    ControlledRadioCards,
    Progress,
    Input,
    Textarea,
    Image,
    CloseButton,
    Field,
    RadioCard,
    List,
    BasicModal,
    ScrollableInsideModal,
    ScrollableOutsideModal,
    Spinner,
    SizeModals,
    PlacementModal,
    Stat,
    PinInput,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    AvatarGroup,
    Badge,
    PMTabs,
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
    ControlledRangeSlider,
    MaxMinRangeSlider,
    RangeSlider,
    Tabs,
    VariantTabs,
    ControlledTabs,
    Checkbox,
    CheckboxGroup,
    CheckboxGroupControl,
    CheckboxCard,
    CheckboxCardGroupControl,
    Wrapper,
    Table,
    TextareaNoAutoSize,
    Grid,
    GridItem,
    Tooltip,
    VisuallyHidden,
    HiExternalLink,
    Skeleton,
    SkeletonText,
    Radio,
    Card,
    RadioGroup,
    Snippet,
    VisuallyHiddenInput,
    Select,
    AsyncSelect,
    ControlledSelect,
    Popover,
    Collapsed,
    Scaled,
    ControlledAccordion,
    ControlledPinInput,
    Switch,
    ControlledCheckbox,
    ControlledCheckboxCard,
    ControlledSwitch,
    Menu,
    ProgressCircular,
    RemixLink,
    ControlledMenu,
    InteractiveMenu,
    Portal,
    ControlledEditable,
    FinalFocusRefEditable,
    UpdateToast,
    Editable,
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
    VariantMenu,
    ActionBarMultiple,
    ActionBarSizes,
    ActionBarTable,
    ActionBarWithClose,
    ControlledActionBar,
    Span,
    BarChartExample,
    LineChartExample,
    PieChartExample,
    EmptyState,
    DatePicker,
    ControlledDatePicker,
    DatePickerWithFooter
};

function Wrapper({ children, ...props }: PropsWithChildren<FlexProps>) {
    return (
        <Flex
            align={"flex-start"}
            border={"1px solid"}
            borderColor={"border"}
            col
            gap={2}
            p={4}
            rounded={"p-4"}
            w={"full"}
            {...props}
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
    FaReact,
    RiNextjsLine,
    FaPaypal,
    FiCreditCard,
    SiApple,
    FaVuejs,
    SiReactrouter,
    LuAlarmClock,
    LuLamp,
    LuBattery,
    LuTrash,
    LuWarehouse,
    LuChevronDown,
    LuChevronRight,
    LuHouse,
    LuBanana,
    LuCitrus,
    LuCherry,
    LuFileWarning,
    LuDollarSign,
    HiColorSwatch,
    LuShoppingCart
};

const components: any = {
    p: (props: any) => (
        <Text
            color={"fg.medium"}
            fontWeight={400}
            // mb={2}
            {...props}
        />
    ),
    h1: (props: any) => (
        <DefaultHeading
            as="h2"
            mb={3}
            mt={10}
            size={"3xl"}
            {...props}
        />
    ),
    h2: (props: any) => (
        <DefaultHeading
            as="h3"
            mb={2}
            mt={6}
            size={"2xl"}
            {...props}
        />
    ),
    h3: (props: any) => (
        <DefaultHeading
            as="h4"
            fontWeight={600}
            mb={1}
            mt={4}
            size={"lg"}
            {...props}
        />
    ),
    hr: (props: any) => (
        <Divider
            my={4}
            {...props}
        />
    ),
    a: ({ href, children, ...props }: any) => {
        const isExternal = href?.startsWith("http");

        if (href?.startsWith("/")) {
            return (
                <Link
                    color={"fg"}
                    target={isExternal ? "_blank" : undefined}
                    // _hover={{
                    //     textDecoration: "underline"
                    // }}
                    textDecoration={"underline"}
                    textDecorationColor={"alpha.500"}
                    textDecorationThickness={"2px"}
                    textUnderlineOffset={"3px"}
                    to={href || "#"}
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
                color={"fg"}
                href={href || "#"}
                target={isExternal ? "_blank" : undefined}
                textDecoration={"underline"}
                textDecorationColor={"alpha.500"}
                textDecorationThickness={"2px"}
                textUnderlineOffset={"3px"}
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
            // color={"fg.medium"}
            fontStyle="italic"
            {...props}
        />
    ),
    blockquote: (props: any) => {
        const { children, ...rest } = props as {
            children: any[];
            [key: string]: any;
        };

        if (typeof children !== "object") {
            console.error("blockquote must have object children", children);

            return (
                <Alert
                    {...rest}
                    boxShadow={"xs"}
                    status="error"
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
            <Flex
                // mt={4}
                // status={status}
                // boxShadow={"xs"}
                // title={content}
                border={"1px solid"}
                borderColor={"border"}
                full
                gap={4}
                my={2}
                p={3}
                pl={2}
                rounded={"l2"}
                {...rest}
            >
                <Flex
                    bg={"border.hover"}
                    h={"100%"}
                    rounded={"full"}
                    w={"2px"}
                />
                <Box relative>
                    <Flex
                        absolute
                        bg={"fg"}
                        color={"bg"}
                        fontSize={"xs"}
                        fontWeight={500}
                        left={-4.5}
                        px={1}
                        py={0.5}
                        rounded={"xs"}
                        top={"-5.5"}
                    >
                        {status === "info"
                            ? "Tip"
                            : status === "success"
                              ? "Success"
                              : status === "warning"
                                ? "Warning"
                                : status === "error"
                                  ? "Error"
                                  : "Info"}
                    </Flex>
                    {content}
                </Box>
            </Flex>
        );
    },
    img: ({ alt = "image", ...props }) => {
        const isFullWidth = props.src?.includes("fullwidth=true");

        return (
            <Flex
                alignItems={"center"}
                as={"span"}
                col
                display={"inline-flex"}
                maxW={isFullWidth ? "3xl" : "lg"}
                w={"fit-content"}
            >
                <Image
                    alt={alt}
                    loading="lazy"
                    rounded={"md"}
                    {...props}
                />
                {alt && (
                    <Text
                        aria-hidden="true"
                        as={"span"}
                        bottom={1}
                        color={"fg.disabled"}
                        fontSize={"sm"}
                        fontWeight={500}
                    >
                        {alt}
                    </Text>
                )}
            </Flex>
        );
    },
    ul: (props: any) => (
        <List.Root
            unordered
            {...props}
        />
    ),
    ol: (props: any) => (
        <List.Root
            ordered
            {...props}
        />
    ),
    li: (props: any) => (
        <List.Item
            color={"fg.medium"}
            css={{
                // "&:not(:last-child)": {
                // 	mb: 1
                // },
                "& > strong": {
                    color: "fg!"
                }
            }}
            {...props}
        />
    ),
    strong: (props: any) => (
        <Text
            as="strong"
            color={"fg.medium"}
            fontWeight={600}
            {...props}
        />
    ),
    ...DreamComponents,
    ...icons
};

function DefaultHeading({ mt, mb, ...props }: HeadingProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hash = useLocation().hash;
    const hId = useMemo(() => createHId(props.children), [props.children]);

    return (
        <Flex
            _first={{ mt: 0 }}
            flex={1}
            mb={mb}
            mt={mt}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            w={"fit-content"}
        >
            <MotionBox
                animate={{
                    width: isHovered ? "auto" : 0,
                    opacity: isHovered ? 1 : 0
                }}
                initial={false}
                overflow={"hidden"}
            >
                <DreamLink
                    cursor="pointer"
                    href={`#${hId}`}
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                    tabIndex={-1}
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
                cursor="pointer"
                href={`#${hId}`}
                scrollMarginTop={24}
                w={"fit-content"}
            >
                <Heading
                    _hover={{
                        textDecoration: "underline"
                    }}
                    id={hId}
                    scrollMarginTop={24}
                    // lineClamp={1}
                    textDecoration={hash === `#${hId}` ? "underline" : "none"}
                    {...props}
                />
            </DreamLink>
        </Flex>
    );
}
