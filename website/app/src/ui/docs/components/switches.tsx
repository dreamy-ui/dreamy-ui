import {
    Button,
    Field,
    Fieldset,
    Flex,
    Spinner,
    Switch,
    VStack,
    createSwitchController
} from "@/ui";
import { useRef, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { DemoLog, useDemoLog } from "./demo-log";

export function DescriptionSwitch() {
    return (
        <Field.Root
            maxW="md"
            w="full"
        >
            <Flex
                align="center"
                gap={4}
                justify="space-between"
                w="full"
            >
                <VStack
                    align="start"
                    gap={0.5}
                >
                    <Field.Label>Weekly digest</Field.Label>
                    <Field.Hint>A summary of your week, every Monday.</Field.Hint>
                </VStack>
                <Switch />
            </Flex>
        </Field.Root>
    );
}

export function ChoiceCardSwitches() {
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
                    position="relative"
                    rounded="l2"
                >
                    <Flex
                        align="center"
                        gap={4}
                        justify="space-between"
                        w="full"
                    >
                        <VStack
                            align="start"
                            gap={0.5}
                        >
                            <Field.Label
                                cursor="pointer"
                                position="static"
                                _after={{
                                    content: '""',
                                    position: "absolute",
                                    inset: 0
                                }}
                            >
                                {setting.label}
                            </Field.Label>
                            <Field.Hint>{setting.description}</Field.Hint>
                        </VStack>
                        <Switch defaultChecked={setting.defaultChecked} />
                    </Flex>
                </Field.Root>
            ))}
        </VStack>
    );
}

export function DisabledAndReadOnlySwitches() {
    return (
        <VStack
            align="start"
            gap={4}
            maxW="md"
            w="full"
        >
            <Switch>Product updates</Switch>
            <Switch
                defaultChecked
                disabled
            >
                Security alerts (disabled)
            </Switch>
            <Field.Root>
                <Flex
                    align="center"
                    gap={4}
                    justify="space-between"
                    w="full"
                >
                    <VStack
                        align="start"
                        gap={0.5}
                    >
                        <Field.Label>Encrypt backups</Field.Label>
                        <Field.Hint>Your organization manages this setting.</Field.Hint>
                    </VStack>
                    <Switch
                        defaultChecked
                        name="encrypt"
                        readOnly
                    />
                </Flex>
            </Field.Root>
        </VStack>
    );
}

export function ControlledSwitch() {
    const { entries, log, clear } = useDemoLog();
    const [wifi] = useState(() => createSwitchController());
    const [checked, setChecked] = useState(true);

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Button
                onClick={() => wifi.toggle()}
                size="xs"
                variant="outline"
            >
                Toggle
            </Button>
            <Switch
                checked={checked}
                controller={wifi}
                onCheckedChange={(next, details) => {
                    setChecked(next);
                    log(`${next ? "On" : "Off"} (${details.reason})`);
                }}
            >
                Wi-Fi
            </Switch>
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function FormSwitch() {
    const { entries, log, clear } = useDemoLog();

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const values = [...new FormData(event.currentTarget)].map(
                        ([name, value]) => `${name}=${value}`
                    );
                    log(values.length ? `Submitted ${values.join("&")}` : "Submitted nothing");
                }}
                style={{ width: "100%" }}
            >
                <VStack
                    align="start"
                    gap={4}
                >
                    <Fieldset.Root>
                        <Fieldset.Legend>Email notifications</Fieldset.Legend>
                        <Fieldset.Content>
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
                        </Fieldset.Content>
                    </Fieldset.Root>
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
                </VStack>
            </form>
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function ValidationSwitch() {
    const { entries, log, clear } = useDemoLog();

    return (
        <VStack
            align="start"
            gap={4}
            maxW="md"
            w="full"
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    log(
                        `Submitted two-factor=${new FormData(event.currentTarget).get("two-factor")}`
                    );
                }}
                style={{ width: "100%" }}
            >
                <VStack
                    align="start"
                    gap={4}
                >
                    <Field.Root
                        required
                        w="full"
                    >
                        <Flex
                            align="center"
                            gap={4}
                            justify="space-between"
                            w="full"
                        >
                            <VStack
                                align="start"
                                gap={0.5}
                            >
                                <Field.Label>Two-factor authentication</Field.Label>
                                <Field.Hint>Required for admins of this workspace.</Field.Hint>
                            </VStack>
                            <Switch
                                name="two-factor"
                                required
                            />
                        </Flex>
                        <Field.Error match="valueMissing">Turn this on to continue.</Field.Error>
                    </Field.Root>
                    <Button
                        size="xs"
                        type="submit"
                    >
                        Continue
                    </Button>
                </VStack>
            </form>
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

const saveBackupSetting = (_checked: boolean) =>
    new Promise((resolve) => setTimeout(resolve, 800));

export function AsyncSaveSwitch() {
    const { entries, log, clear } = useDemoLog();
    const [backups] = useState(() => createSwitchController());
    const [saving, setSaving] = useState(false);
    const pending = useRef(false);

    return (
        <VStack
            align="start"
            gap={4}
            maxW="sm"
            w="full"
        >
            <Switch
                aria-busy={saving}
                controller={backups}
                icon={saving ? <Spinner size="sm" /> : undefined}
                onCheckedChange={(next, details) => {
                    if (details.reason === "imperative") {
                        return;
                    }
                    details.cancel();
                    if (pending.current) {
                        return;
                    }
                    pending.current = true;
                    setSaving(true);
                    log("Saving...");
                    saveBackupSetting(next).then(() => {
                        pending.current = false;
                        backups.setChecked(next, { reason: "imperative" });
                        setSaving(false);
                        log(`Saved: ${next ? "on" : "off"}`);
                    });
                }}
            >
                Automatic backups
            </Switch>
            <DemoLog
                entries={entries}
                onClear={clear}
            />
        </VStack>
    );
}

export function CustomThumbSwitch() {
    return (
        <Switch icon={(state) => (state.checked ? <LuMoon size={12} /> : <LuSun size={12} />)}>
            Dark mode
        </Switch>
    );
}
