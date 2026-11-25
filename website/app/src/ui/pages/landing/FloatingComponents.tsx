import {
    Badge,
    Box,
    Button,
    Card,
    Field,
    Flex,
    Grid,
    Heading,
    HStack,
    PinInput,
    Select,
    Slider,
    Spinner,
    Stat,
    Switch,
    Text
} from "@/ui";
import { useColorMode, useReducedMotion } from "@dreamy-ui/react";
import { m } from "motion/react";
import { type RefObject, useRef, useState } from "react";
import { useCountUp } from "react-countup";
import { FaReact } from "react-icons/fa";
import { RiNextjsLine } from "react-icons/ri";
import { SiTanstack, SiVite } from "react-icons/si";
import { useLoaderData } from "react-router";
import type { Route } from "rr/app/routes/+types/_index";
import { formatCompactCount } from "~/src/functions/number";
import ExploreComponents from "./ExploreComponents";

const frameworks = [
    { value: "react-router", label: "React Router", icon: <FaReact /> },
    { value: "next", label: "Next.js", icon: <RiNextjsLine /> },
    { value: "tanstack", label: "TanStack", icon: <SiTanstack /> },
    { value: "vite", label: "Vite", icon: <SiVite /> }
];

interface GithubStarsCountProps {
    stars: number;
}

function GithubStarsCount({ stars }: GithubStarsCountProps) {
    const ref = useRef<HTMLElement>(null);
    const [hasStarted, setHasStarted] = useState(false);

    useCountUp({
        start: 0,
        end: stars,
        onStartCallback: () => setHasStarted(true),
        duration: 1.2,
        delay: 0.3,
        formattingFn: formatCompactCount,
        ref: ref as RefObject<HTMLElement>
    });

    return <span ref={ref}>{!hasStarted && "0"}</span>;
}

function getGithubStarsGrowthPercent(stars: number): number | null {
    const prevStars = stars - 1;
    if (prevStars <= 0) return null;

    return Math.round((1 / prevStars) * 100);
}

interface GithubStarsGrowthCountProps {
    stars: number;
}

function GithubStarsGrowthCount({ stars }: GithubStarsGrowthCountProps) {
    const percent = getGithubStarsGrowthPercent(stars);
    const ref = useRef<HTMLElement>(null);
    const [hasStarted, setHasStarted] = useState(false);

    useCountUp({
        start: 0,
        end: percent ?? 0,
        onStartCallback: () => setHasStarted(true),
        duration: 1.5,
        delay: 0.3,
        prefix: "+",
        suffix: "%",
        ref: ref as RefObject<HTMLElement>
    });

    if (percent == null) {
        return <>+100%</>;
    }

    return <span ref={ref}>{!hasStarted && "+0%"}</span>;
}

interface ComponentCardProps {
    title: string;
    delay?: number;
    children: React.ReactNode;
}

function ComponentCard({ title, delay = 0, children }: ComponentCardProps) {
    const reduceMotion = useReducedMotion();

    return (
        <m.div
            animate={{ opacity: 1, y: 0 }}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            style={{ display: "flex", height: "100%" }}
            transition={{ duration: 0.4, delay }}
        >
            <Card.Root
                _hover={{ borderColor: "border.hover" }}
                bg={"bg/80"}
                border={"1px solid"}
                borderColor={"border"}
                center
                col
                full
                p={4}
                rounded={"xl"}
                transition={"border-color 0.2s"}
            >
                <Card.Body
                    center
                    col
                    gap={4}
                    justify={"space-between"}
                    p={0}
                    w={"full"}
                >
                    <Flex
                        center
                        col
                        flex={1}
                        w={"full"}
                    >
                        {children}
                    </Flex>
                    <Text
                        color={"fg.medium"}
                        fontFamily={"mono"}
                        size={"xs"}
                    >
                        {title}
                    </Text>
                </Card.Body>
            </Card.Root>
        </m.div>
    );
}

export default function FloatingComponents() {
    const { colorMode, toggleColorMode } = useColorMode();
    const reduceMotion = useReducedMotion();
    const { githubStars } = useLoaderData<Route.ComponentProps["loaderData"]>();
    const [sliderVal, setSliderVal] = useState(68);
    const sandboxRef = useRef<HTMLDivElement>(null);

    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const handleButtonClick = () => {
        setIsButtonLoading(true);
        setTimeout(() => {
            setIsButtonLoading(false);
        }, 1000);
    };

    const [isOutlineButtonLoading, setIsOutlineButtonLoading] = useState(false);
    const handleOutlineButtonClick = () => {
        setIsOutlineButtonLoading(true);
        setTimeout(() => {
            setIsOutlineButtonLoading(false);
        }, 1000);
    };

    const [isGhostButtonLoading, setIsGhostButtonLoading] = useState(false);
    const handleGhostButtonClick = () => {
        setIsGhostButtonLoading(true);
        setTimeout(() => {
            setIsGhostButtonLoading(false);
        }, 1000);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const el = sandboxRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
        el.style.setProperty("--spot-opacity", "1");
    };

    const handleMouseLeave = () => {
        const el = sandboxRef.current;
        if (!el) return;
        el.style.setProperty("--spot-opacity", "0");
    };

    return (
        <Flex
            col
            gap={4}
            w={"full"}
        >
            <Box
                backdropBlur={"md"}
                backdropFilter={"auto"}
                bg={"bg.panel/70"}
                border={"1px solid"}
                borderColor={"border"}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                overflow={"hidden"}
                p={4}
                pos={"relative"}
                ref={sandboxRef}
                rounded={"2xl"}
                w={"full"}
            >
                {/* Pointer-reactive spotlight overlay */}
                <Box
                    inset={0}
                    pointerEvents={"none"}
                    pos={"absolute"}
                    rounded={"inherit"}
                    style={{
                        background:
                            "radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in srgb, var(--colors-primary) 12%, transparent), transparent 70%)",
                        opacity: "var(--spot-opacity, 0)"
                    }}
                    transition={"opacity 0.25s"}
                />

                {/* Sandbox header bar */}
                <HStack
                    borderBottomWidth={"1px"}
                    borderColor={"border"}
                    contentBetween
                    mb={4}
                    pb={3}
                    pos={"relative"}
                    w={"full"}
                >
                    <HStack gap={2}>
                        <HStack gap={1.5}>
                            <Box
                                bg={"alpha.200"}
                                boxSize={"2"}
                                rounded={"full"}
                            />
                            <Box
                                bg={"alpha.200"}
                                boxSize={"2"}
                                rounded={"full"}
                            />
                            <Box
                                bg={"alpha.200"}
                                boxSize={"2"}
                                rounded={"full"}
                            />
                        </HStack>
                        <Text
                            color={"fg.medium"}
                            fontFamily={"mono"}
                            size={"xs"}
                        >
                            Interactive Sandbox
                        </Text>
                    </HStack>

                    <Badge
                        gap={1.5}
                        px={2.5}
                        py={0.5}
                        rounded={"full"}
                        scheme={"primary"}
                        textTransform={"none"}
                        variant={"subtle"}
                    >
                        <Box
                            alignItems={"center"}
                            boxSize={"2"}
                            display={"inline-flex"}
                            justifyContent={"center"}
                            pos={"relative"}
                        >
                            {!reduceMotion && (
                                <m.span
                                    animate={{
                                        scale: [1, 2.2],
                                        opacity: [0.65, 0]
                                    }}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "9999px",
                                        backgroundColor: "var(--colors-primary)"
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeOut"
                                    }}
                                />
                            )}
                            <Box
                                bg={"primary"}
                                boxSize={"1.5"}
                                pos={"relative"}
                                rounded={"full"}
                            />
                        </Box>
                        Live Preview
                    </Badge>
                </HStack>

                <Flex
                    col
                    gap={3}
                    pos={"relative"}
                    w={"full"}
                >
                    <Grid
                        columns={{ base: 1, sm: 2 }}
                        gap={3}
                        w={"full"}
                    >
                        {/* Select Field */}
                        <ComponentCard
                            delay={0.08}
                            title="Field + Select"
                        >
                            <Field.Root
                                required
                                w={"full"}
                            >
                                <Field.Label>Framework</Field.Label>
                                <Select.Root
                                    defaultValue="react-router"
                                    full
                                    items={frameworks}
                                    renderItem={(item) => (
                                        <HStack gap={2}>
                                            {item.icon}
                                            <Text>{item.label}</Text>
                                        </HStack>
                                    )}
                                >
                                    <Select.Trigger placeholder="Pick your stack" />
                                    <Select.Content />
                                </Select.Root>
                                <Field.Hint>Works across modern React stacks</Field.Hint>
                            </Field.Root>
                        </ComponentCard>

                        {/* Stats */}
                        <ComponentCard
                            delay={0.12}
                            title="Stat"
                        >
                            <Flex
                                center
                                col
                                gap={2}
                                w={"full"}
                            >
                                <Stat.Root
                                    size={"sm"}
                                    textCenter
                                    w={"min"}
                                >
                                    <Stat.Label textWrap={"nowrap"}>GitHub Stars</Stat.Label>
                                    <Stat.ValueText>
                                        {githubStars != null ? (
                                            <GithubStarsCount stars={githubStars} />
                                        ) : (
                                            "--"
                                        )}
                                    </Stat.ValueText>
                                    <Badge
                                        gap={1}
                                        mx={"auto"}
                                        px={2}
                                        py={0.5}
                                        rounded={"full"}
                                        scheme={"primary"}
                                        variant={"subtle"}
                                    >
                                        <Stat.UpIndicator />
                                        {githubStars != null ? (
                                            <GithubStarsGrowthCount stars={githubStars} />
                                        ) : null}
                                    </Badge>
                                </Stat.Root>
                            </Flex>
                        </ComponentCard>

                        {/* Dark mode switch + Slider */}
                        <ComponentCard
                            delay={0.16}
                            title="Switch + Slider"
                        >
                            <Flex
                                col
                                gap={4}
                                w={"full"}
                            >
                                <Field.Root
                                    orientation={"horizontal"}
                                    w={"full"}
                                >
                                    <Field.Label>Dark mode</Field.Label>
                                    <Switch
                                        checked={colorMode === "dark"}
                                        onCheckedChange={() => toggleColorMode()}
                                    />
                                </Field.Root>

                                <Flex
                                    col
                                    gap={2}
                                    w={"full"}
                                >
                                    <HStack
                                        contentBetween
                                        w={"full"}
                                    >
                                        <Text
                                            color={"fg.medium"}
                                            fontFamily={"mono"}
                                            size={"xs"}
                                        >
                                            Opacity
                                        </Text>
                                        <Text
                                            color={"primary"}
                                            fontFamily={"mono"}
                                            size={"xs"}
                                        >
                                            {sliderVal}%
                                        </Text>
                                    </HStack>
                                    <Slider.Root
                                        max={100}
                                        min={0}
                                        onValueChange={(val) => setSliderVal(val)}
                                        size={"md"}
                                        value={sliderVal}
                                    >
                                        <Slider.Track>
                                            <Slider.FilledTrack />
                                            <Slider.Thumb />
                                        </Slider.Track>
                                    </Slider.Root>
                                </Flex>
                            </Flex>
                        </ComponentCard>

                        {/* Buttons */}
                        <ComponentCard
                            delay={0.2}
                            title="Button"
                        >
                            <Flex
                                col
                                gap={2}
                                w={"full"}
                            >
                                <Button
                                    full
                                    isLoading={isButtonLoading}
                                    onClick={handleButtonClick}
                                    size={"sm"}
                                    variant={"primary"}
                                >
                                    Primary
                                </Button>
                                <Button
                                    full
                                    isLoading={isOutlineButtonLoading}
                                    onClick={handleOutlineButtonClick}
                                    size={"sm"}
                                    variant={"outline"}
                                >
                                    Outline
                                </Button>
                                <Button
                                    full
                                    isLoading={isGhostButtonLoading}
                                    onClick={handleGhostButtonClick}
                                    size={"sm"}
                                    variant={"ghost"}
                                >
                                    Ghost
                                </Button>
                            </Flex>
                        </ComponentCard>
                    </Grid>

                    {/* Pin Input + Spinner row */}
                    <m.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                        transition={{ duration: 0.4, delay: 0.24 }}
                    >
                        <Card.Root
                            _hover={{ borderColor: "border.hover" }}
                            bg={"bg/80"}
                            border={"1px solid"}
                            borderColor={"border"}
                            p={4}
                            rounded={"xl"}
                            transition={"border-color 0.2s"}
                            w={"full"}
                        >
                            <Card.Body
                                align={"center"}
                                direction={{ base: "column", sm: "row" }}
                                gap={4}
                                justify={"space-between"}
                                p={0}
                                w={"full"}
                            >
                                <Flex
                                    align={{ base: "center", sm: "flex-start" }}
                                    col
                                    gap={2}
                                >
                                    <Text
                                        color={"fg.medium"}
                                        fontFamily={"mono"}
                                        size={"xs"}
                                    >
                                        Verification code
                                    </Text>
                                    <PinInput.Root
                                        defaultValue="2137"
                                        size={"md"}
                                    >
                                        <PinInput.Field />
                                        <PinInput.Field />
                                        <PinInput.Field />
                                        <PinInput.Field />
                                    </PinInput.Root>
                                    <Text
                                        color={"fg.medium"}
                                        fontFamily={"mono"}
                                        size={"xs"}
                                    >
                                        PinInput
                                    </Text>
                                </Flex>

                                <Flex
                                    align={"center"}
                                    bg={"bg.panel"}
                                    border={"1px solid"}
                                    borderColor={"border"}
                                    gap={3}
                                    overflow={"hidden"}
                                    pos={"relative"}
                                    px={4}
                                    py={3}
                                    rounded={"lg"}
                                >
                                    {/* Tactile slider-driven glow & accent bar */}
                                    <Box
                                        bg={"primary/10"}
                                        inset={0}
                                        pointerEvents={"none"}
                                        pos={"absolute"}
                                        style={{ opacity: sliderVal / 100 }}
                                    />
                                    <Box
                                        bg={"primary"}
                                        bottom={0}
                                        left={0}
                                        pos={"absolute"}
                                        style={{ opacity: sliderVal / 100 }}
                                        top={0}
                                        w={"2px"}
                                    />
                                    <Spinner
                                        color={"primary"}
                                        pos={"relative"}
                                        size={"sm"}
                                    />
                                    <Flex
                                        col
                                        gap={0.5}
                                        pos={"relative"}
                                    >
                                        <Heading size={"xs"}>Syncing tokens</Heading>
                                        <Text
                                            color={"fg.medium"}
                                            fontFamily={"mono"}
                                            size={"xs"}
                                        >
                                            Spinner · {sliderVal}%
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </m.div>
                </Flex>
            </Box>

            <m.div
                animate={{ opacity: 1, y: 0 }}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}
                transition={{ duration: 0.4, delay: 0.28 }}
            >
                <ExploreComponents />
            </m.div>
        </Flex>
    );
}
