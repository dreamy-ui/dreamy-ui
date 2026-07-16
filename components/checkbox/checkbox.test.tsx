import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Checkbox, CheckboxGroup } from "./index";

describe("Checkbox", () => {
    it("exposes a native checkbox and toggles with Space", async () => {
        const user = userEvent.setup();

        render(<Checkbox>Accept terms</Checkbox>);

        const input = screen.getByRole("checkbox", { hidden: true });

        expect(input).toHaveAttribute("type", "checkbox");
        expect(input).not.toBeChecked();

        input.focus();
        await user.keyboard(" ");

        expect(input).toBeChecked();
    });

    it("marks the visual control and icons as decorative", () => {
        render(<Checkbox defaultChecked>Accept terms</Checkbox>);

        const control = document.querySelector('[data-part="control"]');
        const icon = document.querySelector('[data-part="icon"]');

        expect(control).toHaveAttribute("aria-hidden", "true");
        expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("wires Field label and describedby, and expects Field invalid", () => {
        render(
            <Field.Root
                isInvalid
                isRequired
            >
                <Field.Label>Accept terms</Field.Label>
                <Checkbox />
                <Field.Error>Required</Field.Error>
            </Field.Root>
        );

        const input = screen.getByRole("checkbox", { hidden: true });
        const label = screen.getByText("Accept terms");

        expect(label).toHaveAttribute("for", input.id);
        expect(input).toBeRequired();
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
        expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("calls onChange and onChangeValue when toggled", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onChangeValue = vi.fn();

        render(
            <Checkbox
                defaultChecked={false}
                onChange={onChange}
                onChangeValue={onChangeValue}
            >
                Notifications
            </Checkbox>
        );

        await user.click(screen.getByText("Notifications"));

        expect(onChange).toHaveBeenCalled();
        expect(onChangeValue).toHaveBeenCalledWith(true);
    });

    it("supports controlled and indeterminate state", () => {
        const { rerender } = render(
            <Checkbox
                isChecked
                isIndeterminate
            >
                Select all
            </Checkbox>
        );

        const input = screen.getByRole("checkbox", { hidden: true }) as HTMLInputElement;
        const root = input.closest(".group") ?? input.parentElement;

        expect(input).toBeChecked();
        expect(root).toHaveAttribute("data-indeterminate", "");
        expect(input.indeterminate).toBe(true);

        rerender(
            <Checkbox
                isChecked={false}
                isIndeterminate={false}
            >
                Select all
            </Checkbox>
        );

        expect(input).not.toBeChecked();
        expect(input.indeterminate).toBe(false);
    });

    it("does not toggle when disabled", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Checkbox
                isDisabled
                onChangeValue={onChangeValue}
            >
                Disabled
            </Checkbox>
        );

        const input = screen.getByRole("checkbox", { hidden: true });

        expect(input).toBeDisabled();
        await user.click(input);
        expect(onChangeValue).not.toHaveBeenCalled();
    });

    it("exposes an accessible group name for CheckboxGroup", () => {
        render(
            <Field.Root>
                <Field.Label>Features</Field.Label>
                <CheckboxGroup
                    aria-labelledby="features-label"
                    defaultValue={["a"]}
                    role="group"
                >
                    <span
                        hidden
                        id="features-label"
                    >
                        Features
                    </span>
                    <Checkbox value="a">Alpha</Checkbox>
                    <Checkbox value="b">Beta</Checkbox>
                </CheckboxGroup>
            </Field.Root>
        );

        expect(screen.getByRole("group", { name: "Features" })).toBeInTheDocument();
        expect(screen.getAllByRole("checkbox", { hidden: true })).toHaveLength(2);
    });
});
