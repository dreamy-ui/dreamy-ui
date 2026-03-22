import {
    Accordion,
    ActionBar,
    Alert,
    Autocomplete,
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
    Fieldset,
    FileUpload,
    Flex,
    type FlexProps,
    Grid,
    GridItem,
    Group,
    HStack,
    Heading,
    type HeadingProps,
    HoverCard,
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
    Pagination,
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
    Stepper,
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
import {
    type PropsWithChildren,
    type ReactNode,
    Suspense,
    lazy,
    useEffect,
    useMemo,
    useState
} from "react";
import { BiHome, BiSearch } from "react-icons/bi";
import { FaPaypal, FaReact, FaVuejs } from "react-icons/fa";
import { FiCoffee, FiCreditCard } from "react-icons/fi";
import { HiColorSwatch, HiExternalLink, HiOutlineMail } from "react-icons/hi";
import { IoAdd, IoClose } from "react-icons/io5";
import {
    LuAlarmClock,
    LuBanana,
    LuBattery,
    LuBell,
    LuBot,
    LuChartBar,
    LuCherry,
    LuChevronDown,
    LuChevronRight,
    LuCitrus,
    LuDollarSign,
    LuFileWarning,
    LuHouse,
    LuLamp,
    LuLayoutDashboard,
    LuMessageSquare,
    LuSearch,
    LuSettings,
    LuShield,
    LuShoppingCart,
    LuTrash,
    LuUser,
    LuWarehouse
} from "react-icons/lu";
import { PiConfetti } from "react-icons/pi";
import { RiNextjsLine } from "react-icons/ri";
import { SiApple, SiReactrouter } from "react-icons/si";
import { Link as RemixLink, useLocation } from "react-router";
import type { MdxContent } from "~/src/.server/docs";
import { Link, ReactRouterLink } from "~/src/ui/global/Link";
import { PMTabs } from "./components/pm-tabs";

function LazyFallback() {
    return (
        <Skeleton
            h={20}
            rounded={"md"}
            w={"full"}
        />
    );
}

function wrapLazy(LazyComp: any) {
    return function LazyWrapper(props: any) {
        return (
            <Suspense fallback={<LazyFallback />}>
                <LazyComp {...props} />
            </Suspense>
        );
    };
}

const PlatformSpecificKbd = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/kbds").then((m) => ({ default: m.PlatformSpecificKbd }))
    )
);

const ControlledMenu = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/menus").then((m) => ({ default: m.ControlledMenu }))
    )
);
const InteractiveMenu = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/menus").then((m) => ({ default: m.InteractiveMenu }))
    )
);
const VariantMenu = wrapLazy(
    lazy(() => import("~/src/ui/docs/components/menus").then((m) => ({ default: m.VariantMenu })))
);
const VariantMenus = wrapLazy(
    lazy(() => import("~/src/ui/docs/components/menus").then((m) => ({ default: m.VariantMenus })))
);

const BasicModal = wrapLazy(
    lazy(() => import("~/src/ui/docs/components/modals").then((m) => ({ default: m.BasicModal })))
);
const PlacementModal = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/modals").then((m) => ({ default: m.PlacementModal }))
    )
);
const ScrollableInsideModal = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/modals").then((m) => ({
            default: m.ScrollableInsideModal
        }))
    )
);
const ScrollableOutsideModal = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/modals").then((m) => ({
            default: m.ScrollableOutsideModal
        }))
    )
);
const SizeModals = wrapLazy(
    lazy(() => import("~/src/ui/docs/components/modals").then((m) => ({ default: m.SizeModals })))
);

const ControlledPopover = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/popovers").then((m) => ({ default: m.ControlledPopover }))
    )
);
const FocusPopover = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/popovers").then((m) => ({ default: m.FocusPopover }))
    )
);
const PlacementPopovers = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/popovers").then((m) => ({ default: m.PlacementPopovers }))
    )
);
const SizePopovers = wrapLazy(
    lazy(() =>
        import("~/src/ui/docs/components/popovers").then((m) => ({ default: m.SizePopovers }))
    )
);

const ControlledTabs = wrapLazy(
    lazy(() => import("./components/Tabs").then((m) => ({ default: m.ControlledTabs })))
);
const VariantTabs = wrapLazy(
    lazy(() => import("./components/Tabs").then((m) => ({ default: m.VariantTabs })))
);
const SizeTabs = wrapLazy(
    lazy(() => import("./components/Tabs").then((m) => ({ default: m.SizeTabs })))
);

const ControlledAccordion = wrapLazy(
    lazy(() => import("./components/accordions").then((m) => ({ default: m.ControlledAccordion })))
);

const ControlledHoverCard = wrapLazy(
    lazy(() => import("./components/hover-cards").then((m) => ({ default: m.ControlledHoverCard })))
);

const ControlledStepper = wrapLazy(
    lazy(() => import("./components/steppers").then((m) => ({ default: m.ControlledStepper })))
);
const StepperWithIcons = wrapLazy(
    lazy(() => import("./components/steppers").then((m) => ({ default: m.StepperWithIcons })))
);
const StepperWithColors = wrapLazy(
    lazy(() => import("./components/steppers").then((m) => ({ default: m.StepperWithColors })))
);

const ActionBarMultiple = wrapLazy(
    lazy(() => import("./components/action-bars").then((m) => ({ default: m.ActionBarMultiple })))
);
const ActionBarSizes = wrapLazy(
    lazy(() => import("./components/action-bars").then((m) => ({ default: m.ActionBarSizes })))
);
const ActionBarTable = wrapLazy(
    lazy(() => import("./components/action-bars").then((m) => ({ default: m.ActionBarTable })))
);
const ActionBarWithClose = wrapLazy(
    lazy(() => import("./components/action-bars").then((m) => ({ default: m.ActionBarWithClose })))
);
const ControlledActionBar = wrapLazy(
    lazy(() => import("./components/action-bars").then((m) => ({ default: m.ControlledActionBar })))
);

const AsyncAutocomplete = wrapLazy(
    lazy(() => import("./components/autocompletes").then((m) => ({ default: m.AsyncAutocomplete })))
);
const AutocompleteWithIcon = wrapLazy(
    lazy(() =>
        import("./components/autocompletes").then((m) => ({ default: m.AutocompleteWithIcon }))
    )
);
const ControlledAutocomplete = wrapLazy(
    lazy(() =>
        import("./components/autocompletes").then((m) => ({ default: m.ControlledAutocomplete }))
    )
);
const VirtualAutocomplete = wrapLazy(
    lazy(() =>
        import("./components/autocompletes").then((m) => ({ default: m.VirtualAutocomplete }))
    )
);

const BarChartExample = wrapLazy(
    lazy(() => import("./components/charts").then((m) => ({ default: m.BarChartExample })))
);
const LineChartExample = wrapLazy(
    lazy(() => import("./components/charts").then((m) => ({ default: m.LineChartExample })))
);
const PieChartExample = wrapLazy(
    lazy(() => import("./components/charts").then((m) => ({ default: m.PieChartExample })))
);

const CheckboxCardGroupControl = wrapLazy(
    lazy(() =>
        import("./components/checkboxes").then((m) => ({ default: m.CheckboxCardGroupControl }))
    )
);
const CheckboxGroupControl = wrapLazy(
    lazy(() => import("./components/checkboxes").then((m) => ({ default: m.CheckboxGroupControl })))
);
const ControlledCheckbox = wrapLazy(
    lazy(() => import("./components/checkboxes").then((m) => ({ default: m.ControlledCheckbox })))
);
const ControlledCheckboxCard = wrapLazy(
    lazy(() =>
        import("./components/checkboxes").then((m) => ({ default: m.ControlledCheckboxCard }))
    )
);

const ControlledDatePicker = wrapLazy(
    lazy(() =>
        import("./components/date-pickers").then((m) => ({ default: m.ControlledDatePicker }))
    )
);
const DatePickerWithFooter = wrapLazy(
    lazy(() =>
        import("./components/date-pickers").then((m) => ({ default: m.DatePickerWithFooter }))
    )
);

const ControlledEditable = wrapLazy(
    lazy(() => import("./components/editables").then((m) => ({ default: m.ControlledEditable })))
);
const FinalFocusRefEditable = wrapLazy(
    lazy(() => import("./components/editables").then((m) => ({ default: m.FinalFocusRefEditable })))
);
const StartWithEditViewEditable = wrapLazy(
    lazy(() =>
        import("./components/editables").then((m) => ({ default: m.StartWithEditViewEditable }))
    )
);

const FileUploadCustomList = wrapLazy(
    lazy(() =>
        import("./components/file-uploads").then((m) => ({ default: m.FileUploadCustomList }))
    )
);

const UseActionKey = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseActionKey })))
);
const UseCanUseDOM = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseCanUseDOM })))
);
const UseClipboard = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseClipboard })))
);
const UseColorMode = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseColorMode })))
);
const UseControllable = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseControllable })))
);
const UseControllableModal = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseControllableModal })))
);
const UseEventListener = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseEventListener })))
);
const UseReducedMotion = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseReducedMotion })))
);
const UseUpdateEffect = wrapLazy(
    lazy(() => import("./components/hooks").then((m) => ({ default: m.UseUpdateEffect })))
);

const ControlledPinInput = wrapLazy(
    lazy(() => import("./components/inputs").then((m) => ({ default: m.ControlledPinInput })))
);

const LinkButton = wrapLazy(
    lazy(() => import("./components/others").then((m) => ({ default: m.LinkButton })))
);

const ControlledPagination = wrapLazy(
    lazy(() =>
        import("./components/paginations").then((m) => ({ default: m.ControlledPagination }))
    )
);
const CustomItemPagination = wrapLazy(
    lazy(() =>
        import("./components/paginations").then((m) => ({ default: m.CustomItemPagination }))
    )
);

const ControlledRadioCards = wrapLazy(
    lazy(() => import("./components/radioes").then((m) => ({ default: m.ControlledRadioCards })))
);
const ControlledRadios = wrapLazy(
    lazy(() => import("./components/radioes").then((m) => ({ default: m.ControlledRadios })))
);

const ControlledRangeSlider = wrapLazy(
    lazy(() =>
        import("./components/range-sliders").then((m) => ({ default: m.ControlledRangeSlider }))
    )
);
const MaxMinRangeSlider = wrapLazy(
    lazy(() => import("./components/range-sliders").then((m) => ({ default: m.MaxMinRangeSlider })))
);

const AsyncSelect = wrapLazy(
    lazy(() => import("./components/selects").then((m) => ({ default: m.AsyncSelect })))
);
const ControlledSelect = wrapLazy(
    lazy(() => import("./components/selects").then((m) => ({ default: m.ControlledSelect })))
);

const ControlledSlider = wrapLazy(
    lazy(() => import("./components/sliders").then((m) => ({ default: m.ControlledSlider })))
);
const MaxMinSlider = wrapLazy(
    lazy(() => import("./components/sliders").then((m) => ({ default: m.MaxMinSlider })))
);

const ControlledSwitch = wrapLazy(
    lazy(() => import("./components/switches").then((m) => ({ default: m.ControlledSwitch })))
);

const UpdateToast = wrapLazy(
    lazy(() => import("./components/toasts").then((m) => ({ default: m.UpdateToast })))
);

const Collapsed = wrapLazy(
    lazy(() => import("./components/transitions").then((m) => ({ default: m.Collapsed })))
);
const Scaled = wrapLazy(
    lazy(() => import("./components/transitions").then((m) => ({ default: m.Scaled })))
);

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
    PMTabs,
    Alert,
    Box,
    Flex,
    Button,
    Icon,
    Heading,
    Link: DreamLink,
    ReactRouterLink,
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
    SizeTabs,
    FileUpload,
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
    DatePickerWithFooter,
    FileUploadCustomList,
    Fieldset,
    Pagination,
    ControlledPagination,
    CustomItemPagination,
    Autocomplete,
    ControlledAutocomplete,
    AutocompleteWithIcon,
    AsyncAutocomplete,
    VirtualAutocomplete,
    HoverCard,
    ControlledHoverCard,
    Stepper,
    ControlledStepper,
    StepperWithIcons,
    StepperWithColors
};

function Wrapper({ children, ...props }: PropsWithChildren<FlexProps>) {
    return (
        <Flex
            align={"flex-start"}
            border={"1px solid"}
            borderColor={"border"}
            col
            gap={2}
            p={{
                base: 4,
                md: 10
            }}
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
    LuBanana,
    LuBattery,
    LuBell,
    LuBot,
    LuChartBar,
    LuCherry,
    LuChevronDown,
    LuChevronRight,
    LuCitrus,
    LuDollarSign,
    LuFileWarning,
    LuHouse,
    LuLamp,
    LuLayoutDashboard,
    LuMessageSquare,
    LuSearch,
    LuSettings,
    LuShield,
    LuShoppingCart,
    LuTrash,
    LuUser,
    LuWarehouse,
    HiColorSwatch
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
