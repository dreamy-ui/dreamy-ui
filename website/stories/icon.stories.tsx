import { Icon } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { FiCoffee } from "react-icons/fi";

export default {
    title: "Icon"
} satisfies Meta;

export function Base() {
    return <Icon as={FiCoffee} />;
}

export function Color() {
    return (
        <Icon
            as={FiCoffee}
            color="fg.medium"
        />
    );
}

export function Polymorphism() {
    return (
        <>
            <Icon asChild>
                <FiCoffee />
            </Icon>
            <Icon as={<FiCoffee />} />
        </>
    );
}
