import { Alert } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
    title: "Alert"
} satisfies Meta;

export function Base() {
    return (
        <Alert
            title="Alert"
            description="This is important information"
        />
    );
}

export function Variants() {
    return (
        <>
            <Alert
                title="Alert"
                description="This is important information"
                variant="subtle"
            />
            <Alert
                title="Alert"
                description="This is important information"
                variant="outline"
            />
        </>
    );
}

export function Status() {
    return (
        <>
            <Alert
                status="success"
                title="Alert"
                description="This is important information"
            />
            <Alert
                status="warning"
                title="Alert"
                description="This is important information"
            />
            <Alert
                status="error"
                title="Alert"
                description="This is important information"
            />
            <Alert
                status="info"
                title="Alert"
                description="This is important information"
            />
        </>
    );
}
