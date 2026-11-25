import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import { Switch, createSwitchController } from "./index";

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
            <Field.Root invalid>
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
                required
                disabled
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

    it("sets and clears data-active on pointer and keyboard press", () => {
        render(
            <Switch data-testid="switch-root">
                Notifications
            </Switch>
        );

        const root = screen.getByTestId("switch-root");
        const control = getSwitch(/notifications/i);

        expect(root).not.toHaveAttribute("data-active");

        fireEvent.pointerDown(root, { button: 0, pointerType: "mouse" });
        expect(root).toHaveAttribute("data-active", "");

        fireEvent.pointerUp(root);
        expect(root).not.toHaveAttribute("data-active");

        fireEvent.pointerDown(root, { button: 0, pointerType: "touch" });
        expect(root).toHaveAttribute("data-active", "");

        fireEvent.pointerCancel(root);
        expect(root).not.toHaveAttribute("data-active");

        fireEvent(root, new MouseEvent("pointerdown", { bubbles: true, button: 2 }));
        expect(root).not.toHaveAttribute("data-active");

        fireEvent.keyDown(control, { key: " " });
        expect(root).toHaveAttribute("data-active", "");

        fireEvent.keyUp(control, { key: " " });
        expect(root).not.toHaveAttribute("data-active");
    });

    it("does not set data-active when disabled or read-only", () => {
        render(
            <>
                <Switch
                    data-testid="disabled-switch"
                    disabled
                >
                    Disabled
                </Switch>
                <Switch
                    data-testid="readonly-switch"
                    readOnly
                >
                    Read only
                </Switch>
            </>
        );

        const disabledRoot = screen.getByTestId("disabled-switch");
        const readOnlyRoot = screen.getByTestId("readonly-switch");

        fireEvent.pointerDown(disabledRoot, { button: 0, pointerType: "mouse" });
        expect(disabledRoot).not.toHaveAttribute("data-active");

        fireEvent.pointerDown(readOnlyRoot, { button: 0, pointerType: "mouse" });
        expect(readOnlyRoot).not.toHaveAttribute("data-active");
    });

    it("supports imperative control via createSwitchController", () => {
        const controller = createSwitchController();

        render(
            <Switch
                controller={controller}
                defaultChecked={false}
            >
                Wi-Fi
            </Switch>
        );

        expect(controller.getChecked()).toBe(false);
        act(() => {
            expect(controller.toggle()).toBe(true);
        });
        expect(controller.getChecked()).toBe(true);
        expect(getSwitch("Wi-Fi")).toHaveAttribute("aria-checked", "true");

        act(() => {
            expect(controller.setChecked(false)).toBe(true);
        });
        expect(controller.getChecked()).toBe(false);

        act(() => {
            controller.focus();
        });
        expect(getSwitch("Wi-Fi")).toHaveFocus();
    });

    it("forwards aria-busy to the switch control and supports state-aware icon", async () => {
        const user = userEvent.setup();

        render(
            <Switch
                aria-busy
                data-testid="switch-root"
                defaultChecked={false}
                icon={(state) => (
                    <span data-testid="thumb-state">{state.checked ? "ON" : "OFF"}</span>
                )}
            >
                Dark mode
            </Switch>
        );

        const root = screen.getByTestId("switch-root");
        const control = getSwitch("Dark mode");

        expect(control).toHaveAttribute("aria-busy", "true");
        expect(root).not.toHaveAttribute("aria-busy");
        expect(screen.getByTestId("thumb-state")).toHaveTextContent("OFF");

        await user.click(control);
        expect(screen.getByTestId("thumb-state")).toHaveTextContent("ON");
    });

    it("supports canceling changes via details.cancel() and committing imperatively", async () => {
        const user = userEvent.setup();
        const controller = createSwitchController();

        render(
            <Switch
                controller={controller}
                defaultChecked={false}
                onCheckedChange={(_next, details) => {
                    if (details.reason !== "imperative") {
                        details.cancel();
                    }
                }}
            >
                Automatic backups
            </Switch>
        );

        const control = getSwitch("Automatic backups");
        await user.click(control);
        expect(control).toHaveAttribute("aria-checked", "false");

        act(() => {
            controller.setChecked(true, { reason: "imperative" });
        });
        expect(control).toHaveAttribute("aria-checked", "true");
    });

    it("participates in form submission and reset", async () => {
        const user = userEvent.setup();

        render(
            <form data-testid="switch-form">
                <Switch
                    defaultChecked
                    name="digest"
                    value="weekly"
                >
                    Weekly digest
                </Switch>
                <Switch name="updates">Product updates</Switch>
            </form>
        );

        const form = screen.getByTestId("switch-form") as HTMLFormElement;
        expect(new FormData(form).get("digest")).toBe("weekly");
        expect(new FormData(form).get("updates")).toBeNull();

        await user.click(getSwitch("Product updates"));
        expect(new FormData(form).get("updates")).toBe("on");

        form.reset();
        expect(new FormData(form).get("digest")).toBe("weekly");
        expect(new FormData(form).get("updates")).toBeNull();
    });
});
