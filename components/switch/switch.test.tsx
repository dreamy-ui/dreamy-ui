import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Switch } from "./index";

function getSwitchInput(name?: string | RegExp) {
    const asSwitch = screen.queryByRole("switch", { name, hidden: true });
    if (asSwitch) return asSwitch;
    return screen.getByRole("checkbox", { name, hidden: true });
}

describe("Switch", () => {
    it("calls onChange and onChangeValue when toggled", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onChangeValue = vi.fn();

        render(
            <Switch
                defaultChecked={false}
                onChange={onChange}
                onChangeValue={onChangeValue}
            >
                Notifications
            </Switch>
        );

        const input = getSwitchInput(/notifications/i);
        await user.click(input);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.checked).toBe(true);
        expect(onChangeValue).toHaveBeenCalledTimes(1);
        expect(onChangeValue).toHaveBeenCalledWith(true);
    });

    it("forwards inputProps to the hidden input", () => {
        render(
            <Switch
                data-testid="switch-root"
                inputProps={{
                    id: "switch-input",
                    name: "notifications"
                }}
                defaultChecked
            >
                Notifications
            </Switch>
        );

        const input = document.getElementById("switch-input");
        const root = screen.getByTestId("switch-root");

        expect(input).toHaveAttribute("type", "checkbox");
        expect(input).toHaveAttribute("name", "notifications");
        expect(input).toBeChecked();
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

    it("exposes switch role and native checked on the input", () => {
        render(<Switch defaultChecked>Notifications</Switch>);

        const input = screen.getByRole("switch", { name: /notifications/i, hidden: true });

        expect(input).toHaveAttribute("type", "checkbox");
        expect(input).toHaveAttribute("role", "switch");
        expect(input).toBeChecked();
        expect(input).not.toHaveAttribute("aria-checked");
    });

    it("keeps focus on the hidden checkbox input", async () => {
        const user = userEvent.setup();

        render(<Switch>Notifications</Switch>);

        const input = getSwitchInput(/notifications/i);
        await user.tab();

        expect(input).toHaveFocus();
    });

    it("toggles with Space when focused", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Switch
                defaultChecked={false}
                onChangeValue={onChangeValue}
            >
                Notifications
            </Switch>
        );

        const input = getSwitchInput(/notifications/i);
        input.focus();
        await user.keyboard(" ");

        expect(onChangeValue).toHaveBeenCalledWith(true);
        expect(input).toBeChecked();
    });

    it("does not change accessible name when toggled", async () => {
        const user = userEvent.setup();

        render(<Switch defaultChecked={false}>Notifications</Switch>);

        const input = getSwitchInput(/notifications/i);
        expect(input).toHaveAccessibleName("Notifications");

        await user.click(input);

        expect(getSwitchInput(/notifications/i)).toHaveAccessibleName("Notifications");
    });

    it("hides the visual control from the accessibility tree", () => {
        render(
            <Switch data-testid="switch-root">
                Notifications
            </Switch>
        );

        const root = screen.getByTestId("switch-root");
        const control = root.querySelector('[data-part="control"]');

        expect(control).toHaveAttribute("aria-hidden", "true");
        expect(control).not.toHaveAttribute("tabindex");
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
        const onChangeValue = vi.fn();

        render(
            <Switch
                isDisabled
                defaultChecked={false}
                onChangeValue={onChangeValue}
            >
                Notifications
            </Switch>
        );

        const input = getSwitchInput(/notifications/i);

        expect(input).toBeDisabled();
        await user.click(input);

        expect(onChangeValue).not.toHaveBeenCalled();
        expect(input).not.toBeChecked();
    });

    it("does not toggle when read-only", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Switch
                isReadOnly
                defaultChecked={false}
                onChangeValue={onChangeValue}
            >
                Notifications
            </Switch>
        );

        const input = getSwitchInput(/notifications/i);
        await user.click(input);

        expect(onChangeValue).not.toHaveBeenCalled();
        expect(input).not.toBeChecked();
    });

    it("accepts an accessible name via aria-label", () => {
        render(<Switch aria-label="Dark mode" />);

        expect(getSwitchInput("Dark mode")).toBeInTheDocument();
    });

    it("wires Field.Label into the switch accessible name", () => {
        render(
            <Field.Root>
                <Field.Label>Email notifications</Field.Label>
                <Switch />
            </Field.Root>
        );

        const input = getSwitchInput(/email notifications/i);

        expect(input).toHaveAccessibleName("Email notifications");
        expect(input.id).toBeTruthy();

        const label = screen.getByText("Email notifications");
        expect(label).toHaveAttribute("for", input.id);
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

        const input = getSwitchInput(/email notifications/i);
        const error = screen.getByText("This setting is required.");

        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(error).toHaveAttribute("id");
        expect(screen.queryByText("We will only send product updates.")).not.toBeInTheDocument();

        await waitFor(function assertDescribedBy() {
            const describedBy = input.getAttribute("aria-describedby") ?? "";
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

        const input = getSwitchInput(/email notifications/i);
        const hint = screen.getByText("We will only send product updates.");

        expect(hint).toHaveAttribute("id");
        expect(input).not.toHaveAttribute("aria-invalid", "true");

        await waitFor(function assertDescribedBy() {
            const describedBy = input.getAttribute("aria-describedby") ?? "";
            expect(describedBy.split(" ")).toContain(hint.id);
        });
    });

    it("reflects Field required and disabled on the input", () => {
        render(
            <Field.Root
                isRequired
                isDisabled
            >
                <Field.Label>Email notifications</Field.Label>
                <Switch />
            </Field.Root>
        );

        const input = getSwitchInput(/email notifications/i);

        expect(input).toBeDisabled();
        expect(input).toBeRequired();
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
        expect(getSwitchInput(/email/i)).toBeInTheDocument();
        expect(getSwitchInput(/sms/i)).toBeInTheDocument();
    });
});
