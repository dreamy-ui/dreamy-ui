import { Divider } from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Divider"
} satisfies Meta;

export function Base() {
    return <Divider />;
}

export function Vertical() {
    return (
        <Divider
            orientation="vertical"
            h={"100px"}
        />
    );
}

export function CustomColor() {
    return <Divider color={"success"} />;
}
