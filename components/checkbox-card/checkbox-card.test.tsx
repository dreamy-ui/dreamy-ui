import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroup } from "../checkbox";
import * as Field from "../field";
import { render } from "../test/render";
import * as CheckboxCard from "./index";

describe("CheckboxCard", () => {
    it("exposes a checkbox role as the only checkbox widget", () => {
        render(
            <CheckboxCard.Root aria-label="Pro plan">
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Pro</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
                <CheckboxCard.Description>For teams</CheckboxCard.Description>
            </CheckboxCard.Root>
        );

        const controls = screen.getAllByRole("checkbox");

        expect(controls).toHaveLength(1);
        expect(controls[0]).toHaveAttribute("aria-checked", "false");
        expect(controls[0]).toHaveAttribute("data-slot", "root");
    });

    it("marks the visual checkbox control and icon as decorative", () => {
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
        const onCheckedChange = vi.fn();

        render(
            <CheckboxCard.Root
                data-testid="card"
                onCheckedChange={onCheckedChange}
            >
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Pro</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        const control = screen.getByRole("checkbox");

        control.focus();
        await user.keyboard(" ");
        expect(control).toHaveAttribute("aria-checked", "true");
        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());

        await user.click(screen.getByTestId("card"));
        expect(control).toHaveAttribute("aria-checked", "false");
    });

    it("wires Field describedby and expects Field invalid on the control", () => {
        render(
            <Field.Root invalid>
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

        const control = screen.getByRole("checkbox");

        expect(control.getAttribute("aria-describedby")).toBeTruthy();
        expect(control).toHaveAttribute("aria-invalid", "true");
    });

    it("does not toggle when disabled", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        render(
            <CheckboxCard.Root
                disabled
                onCheckedChange={onCheckedChange}
            >
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Disabled</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        const control = screen.getByRole("checkbox");

        expect(control).toHaveAttribute("data-disabled", "");
        await user.click(control);
        expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("supports controlled checked state and CheckboxGroup", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        const { rerender } = render(
            <CheckboxCard.Root checked>
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Controlled</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");

        rerender(
            <CheckboxGroup
                defaultValue={["a"]}
                onValueChange={onValueChange}
            >
                <CheckboxCard.Root value="a">
                    <CheckboxCard.Header>
                        <CheckboxCard.Title>Option A</CheckboxCard.Title>
                        <CheckboxCard.Checkbox />
                    </CheckboxCard.Header>
                </CheckboxCard.Root>
                <CheckboxCard.Root value="b">
                    <CheckboxCard.Header>
                        <CheckboxCard.Title>Option B</CheckboxCard.Title>
                        <CheckboxCard.Checkbox />
                    </CheckboxCard.Header>
                </CheckboxCard.Root>
            </CheckboxGroup>
        );

        const boxes = screen.getAllByRole("checkbox");
        expect(boxes[0]).toHaveAttribute("aria-checked", "true");
        expect(boxes[1]).toHaveAttribute("aria-checked", "false");

        await user.click(boxes[1]);
        expect(onValueChange).toHaveBeenCalledWith(["a", "b"], expect.anything());
    });

    it("uses card content for the accessible name", () => {
        render(
            <CheckboxCard.Root>
                <CheckboxCard.Header>
                    <CheckboxCard.Title>Analytics</CheckboxCard.Title>
                    <CheckboxCard.Checkbox />
                </CheckboxCard.Header>
            </CheckboxCard.Root>
        );

        expect(screen.getByRole("checkbox", { name: /analytics/i })).toBeInTheDocument();
    });
});
