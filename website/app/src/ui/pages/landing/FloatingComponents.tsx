import { Badge, Button } from "@/ui";
import { Card } from "@/ui";
import { Field } from "@/ui";
import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { HStack } from "@/ui";
import { PinInput } from "@/ui";
import { Select } from "@/ui";
import { Slider } from "@/ui";
import { Spinner } from "@/ui";
import { Stat } from "@/ui";
import { Switch } from "@/ui";
import { Text } from "@/ui";
import { useColorMode } from "@dreamy-ui/react";
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
        return <>+∞%</>;
    }

    return <span ref={ref}>{!hasStarted && "+0%"}</span>;
}

interface ComponentCardProps {
    title: string;
    delay?: number;
    children: React.ReactNode;
}

function ComponentCard({ title, delay = 0, children }: ComponentCardProps) {
    return (
        <m.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            style={{ display: "flex" }}
            transition={{ duration: 0.45, delay }}
        >
            <Card.Root
                backdropBlur={"md"}
                backdropFilter={"auto"}
                bg={"bg/60"}
                border={"1px solid"}
                borderColor={"border"}
                center
                col
                full
                p={5}
                rounded={"xl"}
            >
                <Card.Body
                    center
                    col
                    gap={5}
                    p={0}
                    w={"full"}
                >
                    {children}
                    <Text
                        color={"fg.subtle"}
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
    const { githubStars } = useLoaderData<Route.ComponentProps["loaderData"]>();
    const [sliderVal, setSliderVal] = useState(68);

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

    return (
        <Flex
            col
            gap={4}
            w={"full"}
        >
            <Flex
                display={"grid"}
                style={{
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px"
                }}
                w={"full"}
            >
                {/* Select Field */}
                <ComponentCard
                    delay={0.1}
                    title="Field"
                >
                    <Field.Root
                        isRequired
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
                        <Field.Hint>Works with your favorite tools</Field.Hint>
                    </Field.Root>
                </ComponentCard>

                {/* Stats */}
                <ComponentCard
                    delay={0.15}
                    title="Stat"
                >
                    <HStack
                        center
                        gap={8}
                        w={"full"}
                    >
                        <Flex
                            // flex={1}
                            w={"max"}
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
                                        "—"
                                    )}
                                </Stat.ValueText>
                                <Badge
                                    px={0}
                                    scheme={"success"}
                                    variant={"plain"}
                                >
                                    <Stat.UpIndicator />
                                    {githubStars != null ? (
                                        <GithubStarsGrowthCount stars={githubStars} />
                                    ) : null}
                                </Badge>
                            </Stat.Root>
                        </Flex>
                    </HStack>
                </ComponentCard>

                {/* Dark mode switch */}
                <ComponentCard
                    delay={0.2}
                    title="Switch"
                >
                    <Field.Root
                        orientation={"horizontal"}
                        w={"full"}
                    >
                        <Field.Label>Dark mode</Field.Label>
                        <Switch
                            isChecked={colorMode === "dark"}
                            onChangeValue={toggleColorMode}
                        />
                    </Field.Root>
                </ComponentCard>

                {/* Spinner */}
                <ComponentCard
                    delay={0.25}
                    title="Spinner"
                >
                    <Flex
                        center
                        col
                        gap={3}
                    >
                        <Spinner
                            color={"primary"}
                            size={"md"}
                        />
                        <Flex
                            col
                            gap={1}
                            textCenter
                        >
                            <Heading size={"sm"}>Loading...</Heading>
                            <Text
                                color={"fg.subtle"}
                                size={"xs"}
                            >
                                Fetching your dreams
                            </Text>
                        </Flex>
                    </Flex>
                </ComponentCard>

                {/* Slider */}
                <ComponentCard
                    delay={0.3}
                    title="Slider"
                >
                    <Flex
                        col
                        gap={3}
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
                            defaultValue={sliderVal}
                            max={100}
                            min={0}
                            onChangeValue={setSliderVal}
                        >
                            <Slider.Track>
                                <Slider.FilledTrack />
                                <Slider.Thumb />
                            </Slider.Track>
                        </Slider.Root>
                    </Flex>
                </ComponentCard>

                {/* Buttons */}
                <ComponentCard
                    delay={0.35}
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
                            Solid
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
            </Flex>

            {/* Pin Input */}
            <m.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: 0.4 }}
            >
                <Card.Root
                    backdropBlur={"md"}
                    backdropFilter={"auto"}
                    bg={"bg/60"}
                    border={"1px solid"}
                    borderColor={"border"}
                    center
                    col
                    p={5}
                    rounded={"xl"}
                    w={"full"}
                >
                    <Card.Body
                        center
                        col
                        gap={3}
                        p={0}
                        w={"full"}
                    >
                        <Text
                            color={"fg.medium"}
                            fontFamily={"mono"}
                            size={"sm"}
                        >
                            Enter your PIN
                        </Text>
                        <PinInput.Root defaultValue="2137">
                            <PinInput.Field />
                            <PinInput.Field />
                            <PinInput.Field />
                            <PinInput.Field />
                        </PinInput.Root>
                        <Text
                            color={"fg.subtle"}
                            fontFamily={"mono"}
                            size={"xs"}
                        >
                            PinInput
                        </Text>
                    </Card.Body>
                </Card.Root>
            </m.div>

            <m.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}
                transition={{ duration: 0.45, delay: 0.45 }}
            >
                <ExploreComponents />
            </m.div>
        </Flex>
    );
}
