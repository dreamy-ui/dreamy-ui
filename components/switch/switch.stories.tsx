import { Button, Field, Fieldset, Flex, Spinner, Switch, Text, VStack, createSwitchController } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useRef, useState } from "react";

export default {
    title: "Switch"
} satisfies Meta;

export function Base() {
    return <Switch>Default</Switch>;
}

export function Scheme() {
    return (
        <VStack>
            <Switch
                defaultChecked
                scheme="primary"
            >
                Primary
            </Switch>
            <Switch
                defaultChecked
                scheme="secondary"
            >
                Secondary
            </Switch>
            <Switch
                defaultChecked
                scheme="success"
            >
                Success
            </Switch>
            <Switch
                defaultChecked
                scheme="warning"
            >
                Warning
            </Switch>
            <Switch
                defaultChecked
                scheme="error"
            >
                Error
            </Switch>
            <Switch
                defaultChecked
                scheme="info"
            >
                Info
            </Switch>
            <Switch
                defaultChecked
                scheme="none"
            >
                None
            </Switch>
        </VStack>
    );
}

export function Size() {
    return (
        <VStack>
            <Switch size="sm">Sm</Switch>
            <Switch size="md">Md</Switch>
            <Switch size="lg">Lg</Switch>
        </VStack>
    );
}

export function Controlled() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text>Selected: {isChecked ? "true" : "false"}</Text>
            <Switch
                checked={isChecked}
                onCheckedChange={setIsChecked}
            >
                Controlled
            </Switch>
        </>
    );
}

export function States() {
    return (
        <VStack align="start">
            <Switch>Default</Switch>
            <Switch defaultChecked>Checked</Switch>
            <Switch disabled>Disabled</Switch>
            <Switch
                defaultChecked
                readOnly
            >
                Read only
            </Switch>
        </VStack>
    );
}

export function WithFieldDescription() {
    return (
        <Field.Root maxW="sm">
            <Field.Label>Weekly digest</Field.Label>
            <Switch>Enable weekly summary</Switch>
            <Field.Hint>A summary of your week, every Monday.</Field.Hint>
        </Field.Root>
    );
}

export function ChoiceCards() {
    const settings = [
        {
            label: "Public profile",
            description: "Anyone can see your name and photo.",
            defaultChecked: false
        },
        {
            label: "Show activity status",
            description: "Teammates can see when you're online.",
            defaultChecked: true
        }
    ];

    return (
        <VStack
            align="stretch"
            gap={3}
            maxW="md"
            w="full"
        >
            {settings.map((setting) => (
                <Field.Root
                    border="1px solid"
                    borderColor="border"
                    key={setting.label}
                    p={4}
                    rounded="l2"
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        w="full"
                    >
                        <VStack
                            align="start"
                            gap={0.5}
                        >
                            <Field.Label>{setting.label}</Field.Label>
                            <Field.Hint>{setting.description}</Field.Hint>
                        </VStack>
                        <Switch defaultChecked={setting.defaultChecked} />
                    </Flex>
                </Field.Root>
            ))}
        </VStack>
    );
}

export function DisabledAndReadOnly() {
    return (
        <VStack
            align="start"
            gap={4}
        >
            <Switch
                defaultChecked
                disabled
            >
                Security alerts (disabled)
            </Switch>
            <Field.Root>
                <Field.Label>Encrypt backups (read-only)</Field.Label>
                <Switch
                    defaultChecked
                    name="encrypt"
                    readOnly
                />
                <Field.Hint>Your organization manages this setting.</Field.Hint>
            </Field.Root>
        </VStack>
    );
}

export function ControllerAndAsyncSave() {
    const [controller] = useState(() => createSwitchController());
    const [saving, setSaving] = useState(false);
    const pendingRef = useRef(false);

    return (
        <VStack
            align="start"
            gap={3}
        >
            <Button
                onClick={() => controller.toggle()}
                size="xs"
                variant="outline"
            >
                Toggle via controller
            </Button>
            <Switch
                aria-busy={saving}
                controller={controller}
                icon={saving ? <Spinner size="sm" /> : undefined}
                onCheckedChange={(next, details) => {
                    if (details.reason === "imperative") {
                        return;
                    }
                    details.cancel();
                    if (pendingRef.current) return;
                    pendingRef.current = true;
                    setSaving(true);
                    setTimeout(() => {
                        pendingRef.current = false;
                        controller.setChecked(next, { reason: "imperative" });
                        setSaving(false);
                    }, 800);
                }}
            >
                Automatic backups
            </Switch>
        </VStack>
    );
}

export function FormAndValidation() {
    const [output, setOutput] = useState("");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const entries = [...new FormData(e.currentTarget)].map(([k, v]) => `${k}=${v}`);
                setOutput(entries.length ? entries.join("&") : "Submitted nothing");
            }}
        >
            <VStack
                align="start"
                gap={4}
            >
                <Fieldset.Root>
                    <Fieldset.Legend>Email notifications</Fieldset.Legend>
                    <VStack
                        align="start"
                        gap={2}
                    >
                        <Switch name="updates">Product updates</Switch>
                        <Switch
                            defaultChecked
                            name="security"
                        >
                            Security alerts
                        </Switch>
                        <Switch
                            defaultChecked
                            name="digest"
                            value="weekly"
                        >
                            Weekly digest
                        </Switch>
                    </VStack>
                </Fieldset.Root>
                <Field.Root required>
                    <Switch
                        name="two-factor"
                        required
                    >
                        Two-factor authentication
                    </Switch>
                    <Field.Error match="valueMissing">Turn this on to continue.</Field.Error>
                </Field.Root>
                <Flex gap={2}>
                    <Button
                        size="xs"
                        type="submit"
                    >
                        Save
                    </Button>
                    <Button
                        size="xs"
                        type="reset"
                        variant="outline"
                    >
                        Reset
                    </Button>
                </Flex>
                {output ? <Text fontSize="sm">{output}</Text> : null}
            </VStack>
        </form>
    );
}

export function CustomThumbIcon() {
    return (
        <Switch icon={(state) => (state.checked ? "🌙" : "☀️")}>
            Dark mode
        </Switch>
    );
}
