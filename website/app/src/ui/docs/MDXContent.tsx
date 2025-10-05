import { Accordion } from "@/accordion";
import { Alert } from "@/alert";
import { Avatar, AvatarGroup } from "@/avatar";
import { Badge } from "@/badge";
import { Box } from "@/box";
import { Breadcrumb } from "@/breadcrumb";
import { Button } from "@/button";
import { Card } from "@/card";
import { Checkbox, CheckboxGroup } from "@/checkbox";
import { CheckboxCard } from "@/checkbox-card";
import { Divider } from "@/divider";
import { Editable } from "@/editable";
import { Field } from "@/field";
import { Flex, type FlexProps } from "@/flex";
import { Grid, GridItem } from "@/grid";
import { Group } from "@/group";
import { Heading, type HeadingProps } from "@/heading";
import { Icon } from "@/icon";
import { Image } from "@/image";
import { Input, InputGroup, InputLeftAddon, InputRightAddon } from "@/input";
import { Kbd } from "@/kbd";
import { Link as DreamLink } from "@/link";
import { List, ListItem } from "@/list";
import { Menu } from "@/menu";
import { MotionBox } from "@/motion";
import { PinInput } from "@/pin-input";
import { Popover } from "@/popover";
import { Progress } from "@/progress";
import { ProgressCircular } from "@/progress-circular";
import { Radio, RadioGroup } from "@/radio";
import { RadioCard } from "@/radio-card";
import { Select } from "@/select";
import { Skeleton, SkeletonText } from "@/skeleton";
import { Slider } from "@/slider";
import { Snippet } from "@/snippet";
import { Spinner } from "@/spinner";
import { HStack, Stack, VStack } from "@/stack";
import { Stat } from "@/stat";
import { Switch } from "@/switch";
import { Table } from "@/table";
import { Tabs } from "@/tabs";
import { Text } from "@/text";
import { Textarea, TextareaNoAutoSize } from "@/textarea";
import { DarkTheme, LightTheme } from "@/theme";
import { useToast } from "@/toast-provider";
import { Tooltip } from "@/tooltip";
import { VisuallyHidden, VisuallyHiddenInput } from "@/visually-hidden";
import { Wrap } from "@/wrap";
import { Portal } from "@dreamy-ui/react";
import { MDXRemote } from "next-mdx-remote";
import { type PropsWithChildren, type ReactNode, useEffect, useMemo, useState } from "react";
import { BiHome, BiSearch } from "react-icons/bi";
import { FaPaypal, FaReact, FaVuejs } from "react-icons/fa";
import { FiCoffee, FiCreditCard } from "react-icons/fi";
import { HiExternalLink, HiOutlineMail } from "react-icons/hi";
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
    LuTrash,
    LuWarehouse
} from "react-icons/lu";
import { PiConfetti } from "react-icons/pi";
import { RiNextjsLine } from "react-icons/ri";
import { SiApple, SiReactrouter } from "react-icons/si";
import { Link as RemixLink, useLocation } from "react-router";
import { CloseButton } from "~/components/ui/close-button";
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
import { PMTabs } from "./components/pm-tabs";
import { ControlledRadioCards, ControlledRadios } from "./components/radioes";
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
    ListItem,
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
    VariantMenu
};

function Wrapper({ children, ...props }: PropsWithChildren<FlexProps>) {
    return (
        <Flex
            col
            gap={2}
            p={4}
            rounded={"p-4"}
            border={"1px solid"}
            borderColor={"border"}
            w={"full"}
            align={"flex-start"}
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
    LuDollarSign
};

const components: any = {
    p: (props: any) => (
        <Text
            mb={2}
            color={"fg.medium"}
            fontWeight={400}
            {...props}
        />
    ),
    h1: (props: any) => (
        <DefaultHeading
            as="h2"
            size={"3xl"}
            mt={10}
            mb={3}
            {...props}
        />
    ),
    h2: (props: any) => (
        <DefaultHeading
            as="h3"
            size={"2xl"}
            mt={6}
            mb={2}
            {...props}
        />
    ),
    h3: (props: any) => (
        <DefaultHeading
            as="h4"
            size={"lg"}
            fontWeight={600}
            mt={4}
            mb={1}
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
                    to={href || "#"}
                    target={isExternal ? "_blank" : undefined}
                    // _hover={{
                    //     textDecoration: "underline"
                    // }}
                    color={"fg"}
                    textDecoration={"underline"}
                    textUnderlineOffset={"3px"}
                    textDecorationThickness={"2px"}
                    textDecorationColor={"alpha.500"}
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
                color={"fg"}
                textDecoration={"underline"}
                textUnderlineOffset={"3px"}
                textDecorationThickness={"2px"}
                textDecorationColor={"alpha.500"}
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
    ul: (props: any) => (
        <List
            unordered
            {...props}
        />
    ),
    ol: (props: any) => (
        <List
            ordered
            {...props}
        />
    ),
    li: (props: any) => <ListItem {...props} />,
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
};

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
