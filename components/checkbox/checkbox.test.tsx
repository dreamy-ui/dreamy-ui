import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Checkbox, CheckboxGroup } from "./index";

describe("Checkbox", () => {
    it("exposes a checkbox role and toggles with Space", async () => {
        const user = userEvent.setup();

        render(<Checkbox>Accept terms</Checkbox>);

        const control = screen.getByRole("checkbox", { name: "Accept terms" });

        expect(control).toHaveAttribute("aria-checked", "false");

        control.focus();
        await user.keyboard(" ");

        expect(control).toHaveAttribute("aria-checked", "true");
    });

    it("marks the icon as decorative", () => {
        render(<Checkbox defaultChecked>Accept terms</Checkbox>);

        const icon = document.querySelector('[data-part="icon"]');

        expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("wires Field label and describedby, and expects Field invalid", async () => {
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

        const control = screen.getByRole("checkbox");
        const label = screen.getByText("Accept terms");

        await waitFor(() => expect(label).toHaveAttribute("for", control.id));
        expect(control).toHaveAttribute("aria-required", "true");
        expect(control.getAttribute("aria-describedby")).toBeTruthy();
        expect(control).toHaveAttribute("data-invalid", "");
    });

    it("calls onCheckedChange when toggled", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        render(
            <Checkbox
                defaultChecked={false}
                onCheckedChange={onCheckedChange}
            >
                Notifications
            </Checkbox>
        );

        await user.click(screen.getByText("Notifications"));

        expect(onCheckedChange).toHaveBeenCalled();
        expect(onCheckedChange.mock.calls.at(-1)?.[0]).toBe(true);
    });

    it("supports controlled and indeterminate state", () => {
        const { container, rerender } = render(
            <Checkbox checked="indeterminate">Select all</Checkbox>
        );

        const control = screen.getByRole("checkbox");
        const input = container.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;

        expect(control).toHaveAttribute("aria-checked", "mixed");
        expect(input.indeterminate).toBe(true);

        rerender(<Checkbox checked={false}>Select all</Checkbox>);

        expect(control).toHaveAttribute("aria-checked", "false");
        expect(input.indeterminate).toBe(false);
    });

    it("does not toggle when disabled", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        render(
            <Checkbox
                disabled
                onCheckedChange={onCheckedChange}
            >
                Disabled
            </Checkbox>
        );

        const control = screen.getByRole("checkbox");

        expect(control).toHaveAttribute("data-disabled", "");
        await user.click(control);
        expect(onCheckedChange).not.toHaveBeenCalled();
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

        expect(screen.getAllByRole("group", { name: "Features" }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    });

    it("forwards CheckboxGroup recipe variants to each checkbox", () => {
        const { container } = render(
            <CheckboxGroup
                scheme="success"
                defaultValue={["a"]}
            >
                <Checkbox value="a">Alpha</Checkbox>
            </CheckboxGroup>
        );

        const label = container.querySelector("label");
        expect(label?.className).toContain("checkbox--scheme_success");
    });
});
