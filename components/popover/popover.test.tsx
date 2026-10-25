import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Popover from "./index";

describe("Popover", () => {
    it("opens from the trigger and exposes dialog semantics without aria-modal", async () => {
        const user = userEvent.setup();

        render(
            <Popover.Root>
                <Popover.Trigger>
                    <button type="button">Open popover</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Header>Delete post</Popover.Header>
                    <Popover.Body>Are you sure?</Popover.Body>
                    <Popover.CloseButton />
                </Popover.Content>
            </Popover.Root>
        );

        const trigger = screen.getByRole("button", { name: "Open popover" });

        expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
        expect(trigger).toHaveAttribute("aria-expanded", "false");

        await user.click(trigger);

        const dialog = await screen.findByRole("dialog");

        expect(dialog).not.toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAccessibleName("Delete post");
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        const controls = trigger.getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        expect(document.getElementById(controls!)).toBe(dialog);
    });

    it("closes on Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Popover.Root
                closeOnEscape
                onOpenChange={onOpenChange}
                restoreFocus
            >
                <Popover.Trigger>
                    <button type="button">Trigger</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Header>Escapable</Popover.Header>
                    <Popover.Body>
                        <button type="button">Inside</button>
                    </Popover.Body>
                </Popover.Content>
            </Popover.Root>
        );

        const trigger = screen.getByRole("button", { name: "Trigger" });
        await user.click(trigger);

        const dialog = await screen.findByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith({ open: false });
        });
        await waitFor(() => {
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });
        await waitFor(() => {
            expect(trigger).toHaveFocus();
        });
    });

    it("closes via named CloseButton", async () => {
        const user = userEvent.setup();

        render(
            <Popover.Root>
                <Popover.Trigger>
                    <button type="button">Open</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.CloseButton />
                    <Popover.Header>Closeable</Popover.Header>
                    <Popover.Body>Body</Popover.Body>
                </Popover.Content>
            </Popover.Root>
        );

        await user.click(screen.getByRole("button", { name: "Open" }));
        await screen.findByRole("dialog");

        await user.click(screen.getByRole("button", { name: "Close" }));

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    it("supports controlled open and onOpenChange", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        const { rerender } = render(
            <Popover.Root
                open={false}
                onOpenChange={onOpenChange}
            >
                <Popover.Trigger>
                    <button type="button">Controlled</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Body>Content</Popover.Body>
                </Popover.Content>
            </Popover.Root>
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Controlled" }));
        expect(onOpenChange).toHaveBeenCalledWith({ open: true });

        rerender(
            <Popover.Root
                open
                onOpenChange={onOpenChange}
            >
                <Popover.Trigger>
                    <button type="button">Controlled</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Body>Content</Popover.Body>
                </Popover.Content>
            </Popover.Root>
        );

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("renders an arrow with Ark sizing and background variables when hasArrow is set", async () => {
        const user = userEvent.setup();

        render(
            <Popover.Root hasArrow>
                <Popover.Trigger>
                    <button type="button">Arrow trigger</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Body>With arrow</Popover.Body>
                </Popover.Content>
            </Popover.Root>
        );

        await user.click(screen.getByRole("button", { name: "Arrow trigger" }));
        await screen.findByRole("dialog");

        const arrow = document.querySelector("[data-scope='popover'][data-part='arrow']");
        const arrowTip = document.querySelector("[data-scope='popover'][data-part='arrow-tip']");

        expect(arrow).toBeTruthy();
        expect(arrowTip).toBeTruthy();

        const arrowEl = arrow as HTMLElement;

        expect(arrowEl.style.getPropertyValue("--arrow-size")).toBe("8px");
        expect(arrowEl.style.getPropertyValue("--arrow-background")).toBe(
            "var(--colors-bg-panel)"
        );
        expect(arrowEl.style.width).toBe("var(--arrow-size)");
    });

    it("respects placement and closeOnEscape props", async () => {
        const user = userEvent.setup();

        render(
            <Popover.Root
                closeOnEscape={false}
                positioning={{ placement: "bottom-start" }}
            >
                <Popover.Trigger>
                    <button type="button">Placed</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Header>Placed popover</Popover.Header>
                    <Popover.Body>
                        <button type="button">Inside</button>
                    </Popover.Body>
                    <Popover.Footer>
                        <button type="button">Action</button>
                    </Popover.Footer>
                </Popover.Content>
            </Popover.Root>
        );

        await user.click(screen.getByRole("button", { name: "Placed" }));
        await screen.findByRole("dialog");
        await user.keyboard("{Escape}");

        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
});
