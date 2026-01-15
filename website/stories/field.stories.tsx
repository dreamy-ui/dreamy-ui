import { Field, Input } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Field"
} satisfies Meta;

export function Base() {
    return (
        <Field.Root>
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
            <Field.Hint>This is the username you will use to login</Field.Hint>
        </Field.Root>
    );
}

export function Required() {
    return (
        <Field.Root isRequired>
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
        </Field.Root>
    );
}

export function Invalid() {
    return (
        <Field.Root isInvalid>
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
        </Field.Root>
    );
}

export function Disabled() {
    return (
        <Field.Root isDisabled>
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
        </Field.Root>
    );
}

export function FieldError() {
    return (
        <Field.Root isInvalid>
            <Field.Label>Username</Field.Label>
            <Input
                defaultValue="x"
                placeholder="Enter your username"
            />
            <Field.Error>This username is too short!</Field.Error>
        </Field.Root>
    );
}

export function FieldHint() {
    return (
        <Field.Root>
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
            <Field.Hint>This is the username you will use to login</Field.Hint>
        </Field.Root>
    );
}

export function UsingFieldAsProps() {
    return (
        <Field.Root
            error="This username is too short!"
            hint="This is the username you will use to login"
            label="Username"
        >
            <Input placeholder="Enter your username" />
        </Field.Root>
    );
}

export function Horizontal() {
    return (
        <Field.Root
            maxW="sm"
            orientation="horizontal"
        >
            <Field.Label>Username</Field.Label>
            <Input placeholder="Enter your username" />
        </Field.Root>
    );
}
