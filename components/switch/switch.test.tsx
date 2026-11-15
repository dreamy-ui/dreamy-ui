import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Switch } from "./index";

function getSwitch(name?: string | RegExp) {
    return screen.getByRole("switch", { name });
}

function getHiddenInput(container: HTMLElement) {
    return container.querySelector('input[type="checkbox"]') as HTMLInputElement;
}

describe("Switch", () => {
    it("calls onCheckedChange when toggled", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        render(
            <Switch
                defaultChecked={false}
                onCheckedChange={onCheckedChange}
            >
                Notifications
            </Switch>
        );

        await user.click(screen.getByText("Notifications"));

        expect(onCheckedChange).toHaveBeenCalledTimes(1);
        expect(onCheckedChange.mock.calls[0][0]).toBe(true);
    });

    it("toggles when clicking the label in uncontrolled mode", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        const { container } = render(
            <Switch
                defaultChecked={false}
                onCheckedChange={onCheckedChange}
            >
                Notifications
            </Switch>
        );

        await user.click(screen.getByText("Notifications"));

        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
        expect(getHiddenInput(container).checked).toBe(true);
    });

    it("forwards name to the hidden input", () => {
        const { container } = render(
            <Switch
                data-testid="switch-root"
                defaultChecked
                name="notifications"
            >
                Notifications
            </Switch>
        );

        const input = getHiddenInput(container);
        const root = screen.getByTestId("switch-root");

        expect(input).toHaveAttribute("name", "notifications");
        expect(input.checked).toBe(true);
        expect(root).not.toHaveAttribute("name", "notifications");
    });

    it("forwards remaining props to the root element", () => {
        render(
            <Switch
                className="custom-switch"
                data-testid="switch-root"
            >
                Notifications
            </Switch>
        );

        const root = screen.getByTestId("switch-root");

        expect(root.tagName).toBe("LABEL");
        expect(root).toHaveClass("custom-switch");
        expect(root).toHaveClass("group");
        expect(screen.getByText("Notifications")).toBeInTheDocument();
    });

    it("exposes switch role with aria-checked", () => {
        render(<Switch defaultChecked>Notifications</Switch>);

        const control = getSwitch(/notifications/i);

        expect(control).toHaveAttribute("role", "switch");
        expect(control).toHaveAttribute("aria-checked", "true");
        expect(control).toHaveAttribute("type", "button");
    });

    it("keeps focus on the switch control", async () => {
        const user = userEvent.setup();

        render(<Switch>Notifications</Switch>);

        const control = getSwitch(/notifications/i);
        await user.tab();

        expect(control).toHaveFocus();
    });

    it("toggles with Space when focused", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        render(
            <Switch
                defaultChecked={false}
                onCheckedChange={onCheckedChange}
            >
                Notifications
            </Switch>
        );

        const control = getSwitch(/notifications/i);
        control.focus();
        await user.keyboard(" ");

        expect(onCheckedChange).toHaveBeenCalled();
        expect(control).toHaveAttribute("aria-checked", "true");
    });

    it("does not change accessible name when toggled", async () => {
        const user = userEvent.setup();

        render(<Switch defaultChecked={false}>Notifications</Switch>);

        const control = getSwitch(/notifications/i);
        expect(control).toHaveAccessibleName("Notifications");

        await user.click(control);

        expect(getSwitch(/notifications/i)).toHaveAccessibleName("Notifications");
    });

    it("hides the thumb visuals from the accessibility tree", () => {
        render(
            <Switch data-testid="switch-root">
                Notifications
            </Switch>
        );

        const root = screen.getByTestId("switch-root");
        const thumb = root.querySelector('[data-part="thumb"]');

        expect(thumb).not.toHaveAttribute("tabindex");
    });

    it("does not put conflicting switch semantics on the root", () => {
        render(
            <Switch
                data-testid="switch-root"
                defaultChecked
            >
                Notifications
            </Switch>
        );

        const root = screen.getByTestId("switch-root");

        expect(root).not.toHaveAttribute("role", "switch");
        expect(root).not.toHaveAttribute("aria-checked");
    });

    it("does not toggle when disabled", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        render(
            <Switch
                disabled
                defaultChecked={false}
                onCheckedChange={onCheckedChange}
            >
                Notifications
            </Switch>
        );

        const control = getSwitch(/notifications/i);

        expect(control).toHaveAttribute("data-disabled", "");
        await user.click(control);

        expect(onCheckedChange).not.toHaveBeenCalled();
        expect(control).toHaveAttribute("aria-checked", "false");
    });

    it("does not toggle when read-only", async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();

        render(
            <Switch
                readOnly
                defaultChecked={false}
                onCheckedChange={onCheckedChange}
            >
                Notifications
            </Switch>
        );

        const control = getSwitch(/notifications/i);
        await user.click(control);

        expect(onCheckedChange).not.toHaveBeenCalled();
        expect(control).toHaveAttribute("aria-checked", "false");
    });

    it("accepts an accessible name via aria-label", () => {
        render(<Switch aria-label="Dark mode" />);

        expect(getSwitch("Dark mode")).toBeInTheDocument();
    });

    it("wires Field.Label into the switch accessible name", async () => {
        render(
            <Field.Root>
                <Field.Label>Email notifications</Field.Label>
                <Switch />
            </Field.Root>
        );

        const control = getSwitch(/email notifications/i);

        expect(control).toHaveAccessibleName("Email notifications");
        expect(control.id).toBeTruthy();

        const label = screen.getByText("Email notifications");
        await waitFor(() => expect(label).toHaveAttribute("for", control.id));
    });

    it("wires Field hint and error into aria-describedby when invalid", async () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Email notifications</Field.Label>
                <Switch />
                <Field.Hint>We will only send product updates.</Field.Hint>
                <Field.Error>This setting is required.</Field.Error>
            </Field.Root>
        );

        const control = getSwitch(/email notifications/i);
        const error = screen.getByText("This setting is required.");

        expect(control).toHaveAttribute("data-invalid", "");
        expect(error).toHaveAttribute("id");
        expect(screen.queryByText("We will only send product updates.")).not.toBeInTheDocument();

        await waitFor(function assertDescribedBy() {
            const describedBy = control.getAttribute("aria-describedby") ?? "";
            expect(describedBy.split(" ")).toContain(error.id);
        });
    });

    it("wires Field hint into aria-describedby when valid", async () => {
        render(
            <Field.Root>
                <Field.Label>Email notifications</Field.Label>
                <Switch />
                <Field.Hint>We will only send product updates.</Field.Hint>
            </Field.Root>
        );

        const control = getSwitch(/email notifications/i);
        const hint = screen.getByText("We will only send product updates.");

        expect(hint).toHaveAttribute("id");
        expect(control).not.toHaveAttribute("data-invalid");

        await waitFor(function assertDescribedBy() {
            const describedBy = control.getAttribute("aria-describedby") ?? "";
            expect(describedBy.split(" ")).toContain(hint.id);
        });
    });

    it("reflects Field required and disabled on the control", () => {
        render(
            <Field.Root
                isRequired
                isDisabled
            >
                <Field.Label>Email notifications</Field.Label>
                <Switch />
            </Field.Root>
        );

        const control = getSwitch(/email notifications/i);

        expect(control).toHaveAttribute("aria-disabled", "true");
        expect(control).toHaveAttribute("aria-required", "true");
    });

    it("supports grouping multiple switches with a fieldset legend", () => {
        render(
            <fieldset>
                <legend>Notification preferences</legend>
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Switch />
                </Field.Root>
                <Field.Root>
                    <Field.Label>SMS</Field.Label>
                    <Switch />
                </Field.Root>
            </fieldset>
        );

        expect(screen.getByRole("group", { name: "Notification preferences" })).toBeInTheDocument();
        expect(getSwitch(/email/i)).toBeInTheDocument();
        expect(getSwitch(/sms/i)).toBeInTheDocument();
    });
});
