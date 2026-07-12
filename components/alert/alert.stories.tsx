import { Alert, VStack } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Alert"
} satisfies Meta;

export function Base() {
    return (
        <Alert
            description="Dream may boost Developer efficiency."
            status="warning"
            title="Warning"
        />
    );
}

export function Status() {
    return (
        <VStack
            gap={3}
            w="100%"
        >
            <Alert
                description="There has been an error!"
                status="error"
                title="Error"
            />
            <Alert
                description="Your visit has been created!"
                status="success"
                title="Success"
            />
            <Alert
                description="We may have some issues."
                status="warning"
                title="Warning"
            />
            <Alert
                description="Your credit card information will expire soon. Please update."
                status="info"
                title="Info"
            />
        </VStack>
    );
}
