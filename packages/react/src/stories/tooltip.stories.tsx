import { Tooltip } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Tooltip"
} satisfies Meta;

export function Base() {
    return <Tooltip content="Tooltip">Text</Tooltip>;
}

export function NoArrow() {
    return (
        <Tooltip
            content="Tooltip"
            hasArrow={false}
        >
            Text
        </Tooltip>
    );
}
