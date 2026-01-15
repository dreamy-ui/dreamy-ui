import { Badge, HStack, Wrap } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Badge"
} satisfies Meta;

export function Base() {
    return <Badge>Prime</Badge>;
}

export function Variants() {
    return (
        <HStack>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="subtle">Subtle</Badge>
            <Badge variant="plain">Plain</Badge>
        </HStack>
    );
}

export function Schemes() {
    return (
        <Wrap>
            <Badge scheme="primary">Primary</Badge>
            <Badge scheme="secondary">Secondary</Badge>
            <Badge scheme="success">Success</Badge>
            <Badge scheme="warning">Warning</Badge>
            <Badge scheme="error">Error</Badge>
            <Badge scheme="info">Info</Badge>
            <Badge scheme="none">None</Badge>
        </Wrap>
    );
}

export function SchemesWithVariants() {
    return (
        <Wrap>
            <Badge
                scheme="primary"
                variant="outline"
            >
                Primary
            </Badge>
            <Badge
                scheme="secondary"
                variant="outline"
            >
                Secondary
            </Badge>
            <Badge
                scheme="success"
                variant="outline"
            >
                Success
            </Badge>
            <Badge
                scheme="warning"
                variant="outline"
            >
                Warning
            </Badge>
            <Badge
                scheme="error"
                variant="outline"
            >
                Error
            </Badge>
            <Badge
                scheme="info"
                variant="outline"
            >
                Info
            </Badge>
            <Badge
                scheme="none"
                variant="outline"
            >
                None
            </Badge>
        </Wrap>
    );
}
