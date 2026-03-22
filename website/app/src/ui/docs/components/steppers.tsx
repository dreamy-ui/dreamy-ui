"use client";

import { Button, HStack, Stepper, Text, VStack } from "@/ui";
import { useSteps } from "@dreamy-ui/react";

const steps = ["Account", "Profile", "Done"];

export function ControlledStepper() {
    const { step, goToNext, goToPrev, isComplete } = useSteps({ count: steps.length });

    return (
        <Stepper.Root
            count={steps.length}
            step={step}
        >
            <Stepper.List>
                {steps.map((title, index) => (
                    <Stepper.Item
                        key={index}
                        index={index}
                    >
                        <Stepper.Trigger index={index}>
                            <Stepper.Indicator index={index} />
                            <Stepper.Title>{title}</Stepper.Title>
                        </Stepper.Trigger>
                        <Stepper.Separator index={index} />
                    </Stepper.Item>
                ))}
            </Stepper.List>
            {steps.map((title, index) => (
                <Stepper.Content
                    key={index}
                    index={index}
                >
                    <Text>Step {index + 1}: {title}</Text>
                </Stepper.Content>
            ))}
            <Stepper.CompletedContent>
                <Text>All done!</Text>
            </Stepper.CompletedContent>
            <HStack mt={4}>
                <Button
                    variant="outline"
                    isDisabled={step === 0}
                    onClick={goToPrev}
                >
                    Prev
                </Button>
                <Button
                    isDisabled={isComplete}
                    onClick={goToNext}
                >
                    Next
                </Button>
            </HStack>
        </Stepper.Root>
    );
}

export function StepperWithIcons() {
    const { step, goToNext, goToPrev, isComplete } = useSteps({ count: steps.length });

    return (
        <Stepper.Root
            count={steps.length}
            step={step}
        >
            <Stepper.List>
                {steps.map((title, index) => (
                    <Stepper.Item
                        key={index}
                        index={index}
                    >
                        <Stepper.Trigger index={index}>
                            <Stepper.Indicator
                                index={index}
                                icon={stepIcons[index]}
                            />
                            <Stepper.Title>{title}</Stepper.Title>
                        </Stepper.Trigger>
                        <Stepper.Separator index={index} />
                    </Stepper.Item>
                ))}
            </Stepper.List>
            {steps.map((title, index) => (
                <Stepper.Content
                    key={index}
                    index={index}
                >
                    <Text>Step {index + 1}: {title}</Text>
                </Stepper.Content>
            ))}
            <Stepper.CompletedContent>
                <Text>All done!</Text>
            </Stepper.CompletedContent>
            <HStack mt={4}>
                <Button
                    variant="outline"
                    isDisabled={step === 0}
                    onClick={goToPrev}
                >
                    Prev
                </Button>
                <Button
                    isDisabled={isComplete}
                    onClick={goToNext}
                >
                    Next
                </Button>
            </HStack>
        </Stepper.Root>
    );
}

export function StepperWithColors() {
    const schemes = ["primary", "secondary", "success", "warning", "error"] as const;

    return (
        <VStack
            w="full"
            gap={6}
        >
            {schemes.map((scheme) => (
                <Stepper.Root
                    key={scheme}
                    count={3}
                    defaultStep={1}
                    scheme={scheme}
                >
                    <Stepper.List>
                        {steps.map((title, index) => (
                            <Stepper.Item
                                key={index}
                                index={index}
                            >
                                <Stepper.Trigger index={index}>
                                    <Stepper.Indicator index={index} />
                                    <Stepper.Title>{title}</Stepper.Title>
                                </Stepper.Trigger>
                                <Stepper.Separator index={index} />
                            </Stepper.Item>
                        ))}
                    </Stepper.List>
                </Stepper.Root>
            ))}
        </VStack>
    );
}

const stepIcons = [
    <UserIcon key="user" />,
    <ShieldIcon key="shield" />,
    <CheckCircleIcon key="check" />
];

function UserIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="1em"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle
                cx="12"
                cy="7"
                r="4"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="1em"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

function CheckCircleIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="1em"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
