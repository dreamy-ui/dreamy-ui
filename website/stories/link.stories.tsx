import { Link } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Link"
} satisfies Meta;

export function Base() {
    return <Link href="/">Home</Link>;
}

export function ExternalLink() {
    return (
        <Link
            href="https://www.google.com"
            isExternal
        >
            Google
        </Link>
    );
}
