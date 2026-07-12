import { Image } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Image"
} satisfies Meta;

export function Base() {
    return (
        <Image
            alt="Coffee and cookies"
            fallbackSrc="https://via.placeholder.com/250x164"
            rounded="lg"
            src="/coffee-n-cookies.webp"
            w="250px"
        />
    );
}

export function ZoomOnHover() {
    return (
        <Image
            alt="Coffee and cookies"
            fallbackSrc="https://via.placeholder.com/250x164"
            rounded="lg"
            src="/coffee-n-cookies.webp"
            w="250px"
            zoomOnHover
        />
    );
}

export function BlurShadow() {
    return (
        <Image
            alt="Outdoor cat"
            blurShadow
            fallbackSrc="https://via.placeholder.com/250x164"
            rounded="lg"
            src="/outdoor-cat.webp"
            w="250px"
        />
    );
}

export function ModifyZoomAndBlurOptions() {
    return (
        <Image
            alt="Outdoor cat"
            blurOptions={{
                scale: 1.1,
                radius: "15px",
                opacity: 0.5
            }}
            blurShadow
            fallbackSrc="https://via.placeholder.com/250x164"
            rounded="lg"
            src="/outdoor-cat.webp"
            w="250px"
            zoomOnHover
            zoomOptions={{
                scale: 1.2,
                duration: "0.5s"
            }}
        />
    );
}
