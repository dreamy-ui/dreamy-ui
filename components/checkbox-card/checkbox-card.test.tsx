import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as CheckboxCard from "./index";

describe("CheckboxCard", () => {
    it("exposes a native checkbox as the only checkbox widget", () => {
        render(
            <CheckboxCard.Root aria-label="Pro plan">
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Pro</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
                <CheckboxCard.Description>For teams</CheckboxCard.Description>
            </CheckboxCard.Root>
        );

        const inputs = screen.getAllByRole("checkbox", { hidden: true });

        expect(inputs).toHaveLength(1);
        expect(inputs[0]).toHaveAttribute("type", "checkbox");
    });

    it("marks the visual checkbox control as decorative", () => {
        render(
            <CheckboxCard.Root defaultChecked>
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Pro</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        const control = document.querySelector('[data-part="control"]');
        const icon = document.querySelector('[data-part="icon"]');

        expect(control).toHaveAttribute("aria-hidden", "true");
        expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("toggles with Space and root click", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <CheckboxCard.Root
                data-testid="card"
                onChangeValue={onChangeValue}
            >
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Pro</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        const input = screen.getByRole("checkbox", { hidden: true });

        input.focus();
        await user.keyboard(" ");
        expect(input).toBeChecked();
        expect(onChangeValue).toHaveBeenCalledWith(true);

        await user.click(screen.getByTestId("card"));
        expect(input).not.toBeChecked();
    });

    it("wires Field describedby and expects Field invalid on the input", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Add-ons</Field.Label>
                <CheckboxCard.Root>
                    <CheckboxCard.Header>
                        <CheckboxCard.Title>Analytics</CheckboxCard.Title>
                        <CheckboxCard.Checkbox />
                    </CheckboxCard.Header>
                </CheckboxCard.Root>
                <Field.Error>Select at least one</Field.Error>
            </Field.Root>
        );

        const input = screen.getByRole("checkbox", { hidden: true });

        expect(input.getAttribute("aria-describedby")).toBeTruthy();
        expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("does not toggle when disabled", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <CheckboxCard.Root
                isDisabled
                onChangeValue={onChangeValue}
            >
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Disabled</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        const input = screen.getByRole("checkbox", { hidden: true });

        expect(input).toBeDisabled();
        await user.click(input);
        expect(onChangeValue).not.toHaveBeenCalled();
    });

    it("supports controlled checked state", () => {
        const { rerender } = render(
            <CheckboxCard.Root isChecked>
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Controlled</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        expect(screen.getByRole("checkbox", { hidden: true })).toBeChecked();

        rerender(
            <CheckboxCard.Root isChecked={false}>
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Controlled</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        expect(screen.getByRole("checkbox", { hidden: true })).not.toBeChecked();
    });
});
