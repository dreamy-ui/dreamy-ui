import { Badge } from "@/ui";
import { Button } from "@/ui";
import { Card } from "@/ui";
import { Field } from "@/ui";
import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { HStack } from "@/ui";
import { Input } from "@/ui";
import { PinInput } from "@/ui";
import { Slider } from "@/ui";
import { Spinner } from "@/ui";
import { Switch } from "@/ui";
import { Text } from "@/ui";
import { useColorMode } from "@dreamy-ui/react";
import { m } from "motion/react";
import { useState } from "react";
import ExploreComponents from "./ExploreComponents";

interface ComponentCardProps {
    title: string;
    delay?: number;
    children: React.ReactNode;
}

function ComponentCard({ title, delay = 0, children }: ComponentCardProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay }}
            style={{ display: "flex" }}
        >
            <Card.Root
                bg={"bg/60"}
                backdropBlur={"md"}
                backdropFilter={"auto"}
                border={"1px solid"}
                borderColor={"border"}
                center
                col
                full
                p={5}
                rounded={"xl"}
            >
                <Card.Body center col gap={5} p={0} w={"full"}>
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
    const [sliderVal, setSliderVal] = useState(68);

    return (
        <Flex col gap={4} w={"full"}>
            <Flex
                display={"grid"}
                style={{
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px"
                }}
                w={"full"}
            >
                {/* Input Field */}
                <ComponentCard title="Field" delay={0.1}>
                    <Field.Root isRequired w={"full"}>
                        <Field.Label>Username</Field.Label>
                        <Input
                            full
                            maxLength={16}
                            minLength={3}
                            placeholder="CatLover"
                        />
                        <Field.Hint>3–16 characters</Field.Hint>
                    </Field.Root>
                </ComponentCard>

                {/* Badges */}
                <ComponentCard title="Badge" delay={0.15}>
                    <Flex col gap={2} w={"full"}>
                        <HStack flexWrap={"wrap"} gap={2}>
                            {[
                                { label: "Pro", scheme: "primary" },
                                { label: "New", scheme: "success" },
                                { label: "Beta", scheme: "info" }
                            ].map((b) => (
                                <Badge
                                    key={b.label}
                                    rounded={"full"}
                                    scheme={b.scheme as any}
                                    variant={"subtle"}
                                >
                                    {b.label}
                                </Badge>
                            ))}
                        </HStack>
                        <HStack flexWrap={"wrap"} gap={2}>
                            {[
                                { label: "Stable", scheme: "warning" },
                                { label: "Deprecated", scheme: "error" }
                            ].map((b) => (
                                <Badge
                                    key={b.label}
                                    rounded={"full"}
                                    scheme={b.scheme as any}
                                    variant={"subtle"}
                                >
                                    {b.label}
                                </Badge>
                            ))}
                        </HStack>
                    </Flex>
                </ComponentCard>

                {/* Dark mode switch */}
                <ComponentCard title="Switch" delay={0.2}>
                    <Field.Root orientation={"horizontal"} w={"full"}>
                        <Field.Label>Dark mode</Field.Label>
                        <Switch
                            isChecked={colorMode === "dark"}
                            onChangeValue={toggleColorMode}
                        />
                    </Field.Root>
                </ComponentCard>

                {/* Spinner */}
                <ComponentCard title="Spinner" delay={0.25}>
                    <Flex center col gap={3}>
                        <Spinner boxSize={8} color={"primary"} />
                        <Flex col gap={1} textCenter>
                            <Heading size={"sm"}>Loading...</Heading>
                            <Text color={"fg.subtle"} size={"xs"}>
                                Fetching your dreams
                            </Text>
                        </Flex>
                    </Flex>
                </ComponentCard>

                {/* Slider */}
                <ComponentCard title="Slider" delay={0.3}>
                    <Flex col gap={3} w={"full"}>
                        <HStack contentBetween w={"full"}>
                            <Text color={"fg.medium"} fontFamily={"mono"} size={"xs"}>
                                Opacity
                            </Text>
                            <Text color={"primary"} fontFamily={"mono"} size={"xs"}>
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
                <ComponentCard title="Button" delay={0.35}>
                    <Flex col gap={2} w={"full"}>
                        <Button full size={"sm"} variant={"primary"}>
                            Solid
                        </Button>
                        <Button full size={"sm"} variant={"outline"}>
                            Outline
                        </Button>
                        <Button full size={"sm"} variant={"ghost"}>
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
                    bg={"bg/60"}
                    backdropBlur={"md"}
                    backdropFilter={"auto"}
                    border={"1px solid"}
                    borderColor={"border"}
                    center
                    col
                    p={5}
                    rounded={"xl"}
                    w={"full"}
                >
                    <Card.Body center col gap={3} p={0} w={"full"}>
                        <Text color={"fg.medium"} fontFamily={"mono"} size={"sm"}>
                            Enter your PIN
                        </Text>
                        <PinInput.Root defaultValue="2137">
                            <PinInput.Field />
                            <PinInput.Field />
                            <PinInput.Field />
                            <PinInput.Field />
                        </PinInput.Root>
                        <Text color={"fg.subtle"} fontFamily={"mono"} size={"xs"}>
                            PinInput
                        </Text>
                    </Card.Body>
                </Card.Root>
            </m.div>

            <ExploreComponents />
        </Flex>
    );
}
