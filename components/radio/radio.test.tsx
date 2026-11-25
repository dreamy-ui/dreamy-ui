import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Radio, RadioGroup, createRadioGroupController } from "./index";

describe("Radio", () => {
    it("exposes a radio role and checks with click", async () => {
        const user = userEvent.setup();

        render(
            <Radio
                name="plan"
                value="pro"
            >
                Pro
            </Radio>
        );

        const control = screen.getByRole("radio", { name: "Pro" });

        expect(control).toHaveAttribute("aria-checked", "false");

        await user.click(control);

        expect(control).toHaveAttribute("aria-checked", "true");
    });

    it("marks the visual control as decorative", () => {
        render(
            <Radio
                defaultChecked
                value="pro"
            >
                Pro
            </Radio>
        );

        const control = document.querySelector('[data-part="control"]');

        expect(control).toHaveAttribute("aria-hidden", "true");
    });

    it("shares name across radios in a RadioGroup and supports selection", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Field.Root>
                <Field.Label>Plan</Field.Label>
                <RadioGroup
                    defaultValue="pro"
                    name="plan"
                    onValueChange={onValueChange}
                    role="radiogroup"
                    aria-labelledby="plan-label"
                >
                    <span
                        hidden
                        id="plan-label"
                    >
                        Plan
                    </span>
                    <Radio value="pro">Pro</Radio>
                    <Radio value="team">Team</Radio>
                </RadioGroup>
            </Field.Root>
        );

        expect(screen.getAllByRole("radiogroup", { name: "Plan" }).length).toBeGreaterThan(0);

        const radios = screen.getAllByRole("radio");
        const inputs = document.querySelectorAll('input[type="radio"]');

        expect(radios).toHaveLength(2);
        expect(inputs).toHaveLength(2);
        expect(inputs[0]).toHaveAttribute("name", "plan");
        expect(inputs[1]).toHaveAttribute("name", "plan");
        expect(radios[0]).toBeChecked();

        await user.click(radios[1]);

        expect(radios[1]).toBeChecked();
        expect(onValueChange).toHaveBeenCalled();
        expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("team");
    });

    it("wires Field describedby and expects Field invalid on radios", () => {
        render(
            <Field.Root invalid>
                <Field.Label>Plan</Field.Label>
                <RadioGroup defaultValue="pro">
                    <Radio value="pro">Pro</Radio>
                    <Radio value="team">Team</Radio>
                </RadioGroup>
                <Field.Error>Select a plan</Field.Error>
            </Field.Root>
        );

        const radios = screen.getAllByRole("radio");

        for (const radio of radios) {
            expect(radio.getAttribute("aria-describedby")).toBeTruthy();
            expect(radio).toHaveAttribute("data-invalid", "");
        }
    });

    it("does not change selection when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                disabled
                onValueChange={onValueChange}
            >
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio");

        expect(radios[0]).toHaveAttribute("aria-disabled", "true");
        await user.click(radios[1]);
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it("supports controlled value on RadioGroup", () => {
        const { rerender } = render(
            <RadioGroup value="pro">
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio");

        expect(radios[0]).toBeChecked();
        expect(radios[1]).not.toBeChecked();

        rerender(
            <RadioGroup value="team">
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        expect(radios[0]).not.toBeChecked();
        expect(radios[1]).toBeChecked();
    });

    it("moves selection with arrow keys within the group", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                onValueChange={onValueChange}
                role="radiogroup"
                aria-label="Plan"
            >
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio");

        radios[0].focus();
        await user.keyboard("{ArrowDown}");

        expect(radios[1]).toBeChecked();
        expect(onValueChange).toHaveBeenCalled();
        expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("team");
    });

    it("does not assign duplicate field ids to radios inside a RadioGroup", () => {
        render(
            <Field.Root>
                <Field.Label>Plan</Field.Label>
                <RadioGroup defaultValue="pro">
                    <Radio value="pro">Pro</Radio>
                    <Radio value="team">Team</Radio>
                </RadioGroup>
            </Field.Root>
        );

        const group = screen.getByRole("radiogroup");
        const radios = screen.getAllByRole("radio");

        expect(group.id).toBeTruthy();
        expect(radios[0].id).not.toBe(group.id);
        expect(radios[1].id).not.toBe(group.id);
        expect(radios[0].id || radios[1].id).toBe("");
    });

    it("supports createRadioGroupController and cancellation", async () => {
        const user = userEvent.setup();
        const controller = createRadioGroupController<string>();
        const onValueChange = vi.fn((next: string | null, details: { reason: string; cancel: () => void }) => {
            if (next === "enterprise") {
                details.cancel();
            }
        });

        render(
            <RadioGroup
                aria-label="Plan"
                controller={controller}
                defaultValue="pro"
                onValueChange={onValueChange}
            >
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
                <Radio value="enterprise">Enterprise</Radio>
            </RadioGroup>
        );

        expect(controller.getValue()).toBe("pro");

        act(() => {
            expect(controller.setValue("team")).toBe(true);
        });
        expect(controller.getValue()).toBe("team");
        expect(onValueChange.mock.calls.at(-1)?.[1]?.reason).toBe("imperative");

        act(() => {
            expect(controller.setValue("enterprise")).toBe(false);
        });
        expect(controller.getValue()).toBe("team");

        const radios = screen.getAllByRole("radio");
        await user.click(radios[0]);
        expect(onValueChange.mock.calls.at(-1)?.[1]?.reason).toBe("item-press");
    });

    it("keeps readOnly radios focusable without changing selection", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <RadioGroup
                aria-label="Plan"
                defaultValue="pro"
                name="plan"
                onValueChange={onValueChange}
                readOnly
            >
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio");
        radios[0].focus();
        await user.keyboard("{ArrowDown}");
        await user.click(radios[1]);

        expect(radios[0]).toBeChecked();
        expect(radios[1]).not.toBeChecked();
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it("stops at ends when loop is false", async () => {
        const user = userEvent.setup();

        render(
            <RadioGroup
                aria-label="Plan"
                defaultValue="team"
                loop={false}
            >
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio");
        radios[1].focus();
        await user.keyboard("{ArrowDown}");

        expect(radios[1]).toBeChecked();
        expect(radios[0]).not.toBeChecked();
    });

    it("forwards form on standalone Radio and supports form reset", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        render(
            <>
                <Radio
                    defaultChecked
                    form="external-radio-form"
                    name="billing"
                    value="monthly"
                >
                    Monthly
                </Radio>
                <form
                    id="external-radio-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit(new FormData(event.currentTarget).get("billing"));
                    }}
                >
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </form>
            </>
        );

        await user.click(screen.getByRole("button", { name: "Submit" }));
        expect(onSubmit).toHaveBeenCalledWith("monthly");
    });

    it("resets RadioGroup to defaultValue on form reset", async () => {
        const user = userEvent.setup();

        render(
            <form>
                <RadioGroup
                    aria-label="Speed"
                    defaultValue="standard"
                    name="speed"
                >
                    <Radio value="standard">Standard</Radio>
                    <Radio value="express">Express</Radio>
                </RadioGroup>
                <button type="reset">Reset</button>
            </form>
        );

        const radios = screen.getAllByRole("radio");
        await user.click(radios[1]);
        expect(radios[1]).toBeChecked();

        await user.click(screen.getByRole("button", { name: "Reset" }));
        await waitFor(() => {
            expect(radios[0]).toBeChecked();
            expect(radios[1]).not.toBeChecked();
        });
    });

    it("supports render on RadioGroup and Radio", async () => {
        const user = userEvent.setup();

        render(
            <RadioGroup
                aria-label="Notifications"
                defaultValue="mentions"
                render={<section data-testid="custom-group" />}
            >
                <Radio
                    render={(props, state) => (
                        <button
                            {...props}
                            data-custom-checked={state.checked ? "yes" : "no"}
                        >
                            Everything
                        </button>
                    )}
                    value="all"
                />
                <Radio
                    render={(props, state) => (
                        <button
                            {...props}
                            data-custom-checked={state.checked ? "yes" : "no"}
                        >
                            Mentions
                        </button>
                    )}
                    value="mentions"
                />
            </RadioGroup>
        );

        const group = screen.getByTestId("custom-group");
        expect(group).toHaveAttribute("role", "radiogroup");

        const all = screen.getByRole("radio", { name: "Everything" });
        const mentions = screen.getByRole("radio", { name: "Mentions" });
        expect(mentions).toHaveAttribute("data-custom-checked", "yes");
        expect(all).toHaveAttribute("data-custom-checked", "no");

        await user.click(all);
        expect(all).toHaveAttribute("data-custom-checked", "yes");
        expect(mentions).toHaveAttribute("data-custom-checked", "no");
    });
});
