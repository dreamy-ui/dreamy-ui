import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Radio, RadioGroup } from "./index";

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
            <Field.Root isInvalid>
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
});
