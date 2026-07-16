import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Radio, RadioGroup } from "./index";

describe("Radio", () => {
    it("exposes a native radio and checks with Space", async () => {
        const user = userEvent.setup();

        render(
            <Radio
                name="plan"
                value="pro"
            >
                Pro
            </Radio>
        );

        const input = screen.getByRole("radio", { hidden: true });

        expect(input).toHaveAttribute("type", "radio");
        expect(input).not.toBeChecked();

        input.focus();
        await user.keyboard(" ");

        expect(input).toBeChecked();
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

        const wrapper = document.querySelector('[data-part="wrapper"]');

        expect(wrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("shares name across radios in a RadioGroup and supports selection", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Field.Root>
                <Field.Label>Plan</Field.Label>
                <RadioGroup
                    defaultValue="pro"
                    onChange={onChange}
                    role="radiogroup"
                    aria-labelledby="plan-label"
                >
                    <span
                        hidden
                        id="plan-label"
                    >
                        Plan
                    </span>
                    <Radio
                        name="plan"
                        value="pro"
                    >
                        Pro
                    </Radio>
                    <Radio
                        name="plan"
                        value="team"
                    >
                        Team
                    </Radio>
                </RadioGroup>
            </Field.Root>
        );

        expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();

        const radios = screen.getAllByRole("radio", { hidden: true });

        expect(radios).toHaveLength(2);
        expect(radios[0]).toHaveAttribute("name", "plan");
        expect(radios[1]).toHaveAttribute("name", "plan");
        expect(radios[0]).toBeChecked();

        await user.click(radios[1]);

        expect(radios[1]).toBeChecked();
        expect(onChange).toHaveBeenCalledWith("team");
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

        const radios = screen.getAllByRole("radio", { hidden: true });

        for (const radio of radios) {
            expect(radio.getAttribute("aria-describedby")).toBeTruthy();
            expect(radio).toHaveAttribute("aria-invalid", "true");
        }
    });

    it("does not change selection when disabled", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                isDisabled
                onChange={onChange}
            >
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio", { hidden: true });

        expect(radios[0]).toBeDisabled();
        await user.click(radios[1]);
        expect(onChange).not.toHaveBeenCalled();
    });

    it("supports controlled value on RadioGroup", () => {
        const { rerender } = render(
            <RadioGroup value="pro">
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio", { hidden: true });

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
        const onChange = vi.fn();

        render(
            <RadioGroup
                defaultValue="pro"
                onChange={onChange}
                role="radiogroup"
                aria-label="Plan"
            >
                <Radio
                    name="plan"
                    value="pro"
                >
                    Pro
                </Radio>
                <Radio
                    name="plan"
                    value="team"
                >
                    Team
                </Radio>
            </RadioGroup>
        );

        const radios = screen.getAllByRole("radio", { hidden: true });

        radios[0].focus();
        await user.keyboard("{ArrowDown}");

        expect(radios[1]).toBeChecked();
        expect(onChange).toHaveBeenCalledWith("team");
    });
});
