import { Button } from "@/components/button";
import { Icon, VStack } from "@/rsc";
import type { Meta } from "@storybook/react";
import { BiLoader, BiPlus } from "react-icons/bi";

export default {
    title: "Button"
} satisfies Meta;

export function Base() {
    return <Button>Base Button</Button>;
}

export function WithIcon() {
    return (
        <VStack maxW={"xs"}>
            <Button leftIcon={<Icon as={BiPlus} />}>Left Icon</Button>
            <Button rightIcon={<Icon as={BiPlus} />}>Right Icon</Button>
        </VStack>
    );
}

export function Variants() {
    return (
        <VStack maxW={"xs"}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="solid">Solid</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </VStack>
    );
}

export function ColoredVariants() {
    return (
        <VStack maxW={"xs"}>
            <Button
                variant="outline"
                color="primary"
            >
                Primary
            </Button>
            <Button
                variant="solid"
                color="secondary"
            >
                Secondary
            </Button>
            <Button
                variant="ghost"
                color="success"
            >
                Success
            </Button>
            {/* warning, error, info */}
            <Button
                variant="outline"
                color="warning"
            >
                Warning
            </Button>
            <Button
                variant="solid"
                color="error"
            >
                Error
            </Button>
            <Button
                variant="ghost"
                color="info"
            >
                Info
            </Button>
        </VStack>
    );
}

export function Sizes() {
    return (
        <VStack maxW={"xs"}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </VStack>
    );
}

// disabled, isLoading, isDisabled
export function States() {
    return (
        <VStack maxW={"xs"}>
            <Button isDisabled>Disabled</Button>
            <Button isLoading>Loading</Button>
        </VStack>
    );
}

export function CustomSpinnerAndLoadingText() {
    return (
        <VStack maxW={"xs"}>
            <Button
                isLoading
                loadingText="Loading..."
                spinner={<Icon as={BiLoader} />}
            >
                Custom Spinner
            </Button>
        </VStack>
    );
}
