import { Button, Flex, Progress, ProgressCircular, VStack } from "@/ui";
import { useState } from "react";
import { DemoLog, useDemoLog } from "./demo-log";

const total = 5;

export function InteractiveProgress() {
    const { entries, log, clear } = useDemoLog();
    const [uploaded, setUploaded] = useState(1);

    function uploadNext() {
        if (uploaded >= total) {
            return;
        }
        const next = uploaded + 1;
        setUploaded(next);
        log(`Uploaded ${next} of ${total} photos`);
    }

    function reset() {
        setUploaded(0);
        log("Reset to 0 photos");
    }

    return (
        <VStack
            align="start"
            gap={4}
            maxW="md"
            w="full"
        >
            <Flex gap={2}>
                <Button
                    disabled={uploaded >= total}
                    onClick={uploadNext}
                    size="xs"
                >
                    Upload Next
                </Button>
                <Button
                    onClick={reset}
                    size="xs"
                    variant="outline"
                >
                    Reset
                </Button>
            </Flex>
            <Progress
                label="Uploading photos"
                showValue
                value={(uploaded / total) * 100}
            />
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function FormatAndLocaleProgress() {
    const bars = [
        {
            label: "Download",
            value: 120,
            max: 250,
            format: { style: "unit", unit: "gigabyte" } as const
        },
        {
            label: "Video render",
            value: 87.25,
            format: { style: "percent", maximumFractionDigits: 1 } as const
        },
        {
            label: "Backup",
            value: 45,
            max: 60,
            format: (minutes: number) => `${60 - minutes} min left`
        },
        {
            label: "Synchronisierung",
            value: 40,
            locale: "de-DE"
        }
    ];

    return (
        <VStack
            align="stretch"
            gap={5}
            maxW="md"
            w="full"
        >
            {bars.map(({ label, ...options }) => (
                <Progress
                    key={label}
                    label={label}
                    showValue
                    {...options}
                />
            ))}
        </VStack>
    );
}

export function ValueLabelProgress() {
    return (
        <Progress
            getValueLabel={(value, details) =>
                `${value} of ${details.max} files, ${details.formatted}`
            }
            label="Copying files"
            max={12}
            maxW="md"
            showValue
            value={3}
            valueLabel="3 of 12"
        />
    );
}

export function InteractiveProgressCircular() {
    const { entries, log, clear } = useDemoLog();
    const [uploaded, setUploaded] = useState(2);

    function uploadNext() {
        if (uploaded >= total) {
            return;
        }
        const next = uploaded + 1;
        setUploaded(next);
        log(`Uploaded ${next} of ${total} photos`);
    }

    function reset() {
        setUploaded(0);
        log("Reset to 0 photos");
    }

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Flex gap={2}>
                <Button
                    disabled={uploaded >= total}
                    onClick={uploadNext}
                    size="xs"
                >
                    Upload Next
                </Button>
                <Button
                    onClick={reset}
                    size="xs"
                    variant="outline"
                >
                    Reset
                </Button>
            </Flex>
            <ProgressCircular
                label="Uploading photos"
                showValueLabel
                size="lg"
                value={(uploaded / total) * 100}
            />
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function FormatAndLocaleProgressCircular() {
    return (
        <Flex
            gap={6}
            wrap="wrap"
        >
            <ProgressCircular
                format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
                label="Budget"
                showValueLabel
                size="lg"
                value={69}
            />
            <ProgressCircular
                format={{ style: "unit", unit: "percent" }}
                label="CPU"
                showValueLabel
                size="lg"
                value={42}
            />
            <ProgressCircular
                label="Synchronisierung"
                locale="de-DE"
                showValueLabel
                size="lg"
                value={40}
            />
        </Flex>
    );
}

export function ValueLabelProgressCircular() {
    return (
        <ProgressCircular
            getValueLabel={(value, details) =>
                `${value} of ${details.max} files, ${details.formatted}`
            }
            label="Copying files"
            max={12}
            showValueLabel
            size="lg"
            value={3}
            valueLabel="3/12"
        />
    );
}
