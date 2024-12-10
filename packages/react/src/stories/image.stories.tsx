import { Image, ImageRSC } from "@/components";
import type { Meta } from "@storybook/react";
// @ts-ignore
import coffeeNCookies from "./assets/coffee-n-cookies.webp";

export default {
    title: "Image"
} satisfies Meta;

export function Base() {
    return <Image src={coffeeNCookies} />;
}

export function FallbackSrc() {
    return (
        <Image
            src={"/oopsies.png"}
            fallbackSrc={coffeeNCookies}
        />
    );
}

export function RSC() {
    return <ImageRSC src={coffeeNCookies} />;
}
