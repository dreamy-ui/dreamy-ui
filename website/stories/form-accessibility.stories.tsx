import {
    Checkbox,
    Field,
    Fieldset,
    Input,
    Radio,
    Select,
    Slider,
    Switch,
    Textarea,
    VStack
} from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

export default {
    title: "Form Accessibility"
} satisfies Meta;

const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "pl", label: "Poland" }
];

const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" }
];

/**
 * Fieldset form with autocomplete attributes for browser autofill testing.
 */
export function AutocompleteForm() {
    const [submitted, setSubmitted] = useState<Record<string, string> | null>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = String(value);
        });
        setSubmitted(data);
    }

    return (
        <form
            autoComplete="on"
            data-testid="autocomplete-form"
            id="profile-form"
            onSubmit={handleSubmit}
        >
            <Fieldset.Root>
                <Fieldset.Header>
                    <Fieldset.Legend>Profile</Fieldset.Legend>
                    <Fieldset.HelperText>Fill in your profile details</Fieldset.HelperText>
                </Fieldset.Header>

                <Fieldset.Content>
                    <VStack
                        align="stretch"
                        gap={4}
                    >
                        <Field.Root id="given-name-field">
                            <Field.Label data-testid="given-name-label">First name</Field.Label>
                            <Input
                                autoComplete="given-name"
                                data-testid="given-name-input"
                                name="given-name"
                                placeholder="John"
                            />
                        </Field.Root>

                        <Field.Root id="family-name-field">
                            <Field.Label data-testid="family-name-label">Last name</Field.Label>
                            <Input
                                autoComplete="family-name"
                                data-testid="family-name-input"
                                name="family-name"
                                placeholder="Doe"
                            />
                        </Field.Root>

                        <Field.Root id="email-field">
                            <Field.Label data-testid="email-label">Email</Field.Label>
                            <Input
                                autoComplete="email"
                                data-testid="email-input"
                                name="email"
                                placeholder="john@example.com"
                                type="email"
                            />
                        </Field.Root>

                        <Field.Root id="country-field">
                            <Field.Label data-testid="country-label">Country</Field.Label>
                            <Select.Root
                                autoComplete="country"
                                data-testid="country-select"
                                hiddenSelectProps={{ "data-testid": "country-hidden-select" }}
                                items={countries}
                                name="country"
                                width="full"
                            >
                                <Select.Trigger
                                    data-testid="country-trigger"
                                    placeholder="Select country"
                                />
                                <Select.Content />
                            </Select.Root>
                        </Field.Root>

                        <Field.Root id="bio-field">
                            <Field.Label data-testid="bio-label">Bio</Field.Label>
                            <Textarea
                                autoComplete="off"
                                data-testid="bio-textarea"
                                name="bio"
                                placeholder="Tell us about yourself"
                            />
                        </Field.Root>
                    </VStack>
                </Fieldset.Content>

                <Fieldset.Footer>
                    <button
                        data-testid="submit-button"
                        type="submit"
                    >
                        Submit
                    </button>
                </Fieldset.Footer>
            </Fieldset.Root>

            {submitted && (
                <pre data-testid="form-output">{JSON.stringify(submitted, null, 2)}</pre>
            )}
        </form>
    );
}

/**
 * Hidden input prop forwarding for each component type.
 */
export function HiddenInputProps() {
    return (
        <VStack
            align="stretch"
            gap={6}
            maxW="md"
        >
            <Field.Root id="fruit-select-field">
                <Field.Label data-testid="fruit-label">Favorite fruit</Field.Label>
                <Select.Root
                    autoComplete="on"
                    hiddenSelectProps={{
                        "data-testid": "fruit-hidden-select",
                        "data-custom": "fruit-select"
                    }}
                    isRequired
                    items={fruits}
                    name="fruit"
                    width="full"
                >
                    <Select.Trigger
                        data-testid="fruit-trigger"
                        placeholder="Pick a fruit"
                    />
                    <Select.Content />
                </Select.Root>
            </Field.Root>

            <Field.Root id="newsletter-field">
                <Field.Label data-testid="newsletter-label">Newsletter</Field.Label>
                <Checkbox
                    data-testid="newsletter-checkbox"
                    name="newsletter"
                    value="yes"
                >
                    Subscribe to newsletter
                </Checkbox>
            </Field.Root>

            <Field.Root id="notifications-field">
                <Field.Label data-testid="notifications-label">Notifications</Field.Label>
                <Switch
                    data-testid="notifications-switch"
                    inputProps={{ "data-testid": "notifications-hidden-input" }}
                    name="notifications"
                >
                    Enable notifications
                </Switch>
            </Field.Root>

            <Field.Root id="volume-field">
                <Field.Label data-testid="volume-label">Volume</Field.Label>
                <Slider.Root
                    defaultValue={50}
                    inputProps={{ "data-testid": "volume-hidden-input" }}
                    name="volume"
                >
                    <Slider.Track>
                        <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb data-testid="volume-thumb" />
                </Slider.Root>
            </Field.Root>

            <Field.Root id="plan-field">
                <Field.Label data-testid="plan-label">Plan</Field.Label>
                <VStack align="stretch">
                    <Radio
                        data-testid="plan-free"
                        name="plan"
                        value="free"
                    >
                        Free
                    </Radio>
                    <Radio
                        data-testid="plan-pro"
                        name="plan"
                        value="pro"
                    >
                        Pro
                    </Radio>
                </VStack>
            </Field.Root>
        </VStack>
    );
}

/**
 * Label click should focus the associated control.
 */
export function LabelFocus() {
    return (
        <VStack
            align="stretch"
            gap={4}
            maxW="md"
        >
            <Field.Root id="username-field">
                <Field.Label data-testid="username-label">Username</Field.Label>
                <Input
                    data-testid="username-input"
                    placeholder="Enter username"
                />
            </Field.Root>

            <Field.Root id="role-field">
                <Field.Label data-testid="role-label">Role</Field.Label>
                <Select.Root
                    items={[
                        { value: "admin", label: "Admin" },
                        { value: "user", label: "User" }
                    ]}
                    width="full"
                >
                    <Select.Trigger
                        data-testid="role-trigger"
                        placeholder="Select role"
                    />
                    <Select.Content />
                </Select.Root>
            </Field.Root>

            <Field.Root id="terms-field">
                <Field.Label data-testid="terms-label">Terms</Field.Label>
                <Checkbox data-testid="terms-checkbox">Accept terms</Checkbox>
            </Field.Root>
        </VStack>
    );
}

/**
 * Simulates browser autofill by programmatically changing the hidden select value.
 */
export function HiddenSelectAutofill() {
    const [value, setValue] = useState("");

    return (
        <VStack
            align="stretch"
            gap={4}
            maxW="md"
        >
            <Field.Root id="autofill-country-field">
                <Field.Label>Country (autofill simulation)</Field.Label>
                <Select.Root
                    hiddenSelectProps={{ "data-testid": "autofill-hidden-select" }}
                    items={countries}
                    name="autofill-country"
                    onChangeValue={setValue}
                    width="full"
                >
                    <Select.Trigger
                        data-testid="autofill-trigger"
                        placeholder="Select country"
                    />
                    <Select.Content />
                </Select.Root>
                <select
                    data-testid="autofill-simulator"
                    onChange={(e) => {
                        const hidden = document.querySelector(
                            '[data-testid="autofill-hidden-select"]'
                        ) as HTMLSelectElement | null;
                        if (hidden) {
                            hidden.value = e.target.value;
                            hidden.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                    }}
                    style={{ marginTop: 8 }}
                >
                    <option value="">Simulate autofill...</option>
                    {countries.map((c) => (
                        <option
                            key={c.value}
                            value={c.value}
                        >
                            {c.label}
                        </option>
                    ))}
                </select>
            </Field.Root>

            <p data-testid="autofill-value">Selected: {value || "(none)"}</p>
        </VStack>
    );
}
