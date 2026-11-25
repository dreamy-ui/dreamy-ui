import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Drawer from "./index";

describe("Drawer", () => {
    it("exposes dialog role, aria-modal, UI SDK slot, and accessible name from Header", async () => {
        render(
            <Drawer.Root open>
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Confirm delete</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>This action cannot be undone.</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        const dialog = await screen.findByRole("dialog");

        expect(dialog).toHaveAttribute("data-slot", "drawer-content");
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAccessibleName("Confirm delete");

        const labelledBy = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(labelledBy!)).toHaveTextContent("Confirm delete");
    });

    it("associates Body via aria-describedby when present", async () => {
        render(
            <Drawer.Root open>
                <Drawer.Content>
                    <Drawer.Header>Title</Drawer.Header>
                    <Drawer.Body>Primary message for assistive tech</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        const dialog = await screen.findByRole("dialog");
        const describedBy = dialog.getAttribute("aria-describedby");

        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toHaveTextContent(
            "Primary message for assistive tech"
        );
    });

    it("focuses the element pointed to by initialFocus when open", async () => {
        function Fixture() {
            const inputRef = useRef<HTMLInputElement>(null);

            return (
                <Drawer.Root open>
                    <Drawer.Content initialFocus={() => inputRef.current}>
                        <Drawer.Header>Edit profile</Drawer.Header>
                        <Drawer.CloseButton />
                        <Drawer.Body>
                            <button type="button">Other control</button>
                            <input
                                aria-label="Display name"
                                ref={inputRef}
                            />
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            );
        }

        render(<Fixture />);

        const input = await screen.findByRole("textbox", { name: "Display name" });
        await waitFor(() => {
            expect(input).toHaveFocus();
        });
    });

    it("opens via Trigger, closes on Escape, and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Drawer.Root onOpenChange={onOpenChange}>
                <Drawer.Trigger>Open Drawer</Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Keyboard dismiss</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>Press Escape</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        const trigger = screen.getByRole("button", { name: "Open Drawer" });
        await user.click(trigger);

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
        });
        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(trigger).toHaveFocus();
        });
    });

    it("closes via CloseButton which has an accessible name", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Drawer.Root
                onOpenChange={onOpenChange}
                open
            >
                <Drawer.Content>
                    <Drawer.Header>Closeable</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>Body</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        const close = await screen.findByRole("button", { name: "Close" });
        await user.click(close);

        expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it("does not close on Escape when dismissible is false and calls onDismissAttempt", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        const onDismissAttempt = vi.fn();

        render(
            <Drawer.Root
                dismissible={false}
                onDismissAttempt={onDismissAttempt}
                onOpenChange={onOpenChange}
                open
            >
                <Drawer.Content>
                    <Drawer.Header>Stay open</Drawer.Header>
                    <Drawer.Body>
                        <button type="button">Focusable</button>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        await screen.findByRole("dialog");
        await user.click(screen.getByRole("button", { name: "Focusable" }));
        await user.keyboard("{Escape}");

        expect(onDismissAttempt).toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("returns focus to finalFocus target when provided", async () => {
        const user = userEvent.setup();

        function Fixture() {
            const [open, setOpen] = useState(true);
            const finalRef = useRef<HTMLButtonElement>(null);

            return (
                <>
                    <button
                        ref={finalRef}
                        type="button"
                    >
                        Final focus target
                    </button>
                    <Drawer.Root
                        onOpenChange={(next) => setOpen(next)}
                        open={open}
                    >
                        <Drawer.Content finalFocus={() => finalRef.current}>
                            <Drawer.Header>Final focus</Drawer.Header>
                            <Drawer.CloseButton />
                            <Drawer.Body>Body</Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Root>
                </>
            );
        }

        render(<Fixture />);

        await screen.findByRole("dialog");
        await user.click(screen.getByRole("button", { name: "Close" }));

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Final focus target" })).toHaveFocus();
        });
    });

    it("supports placement, snapPoints, and Grabber handle", async () => {
        render(
            <Drawer.Root
                defaultSnapPoint={0.5}
                open
                placement="bottom"
                snapPoints={[0.25, 0.5, 1]}
            >
                <Drawer.Overlay data-testid="drawer-overlay" />
                <Drawer.Content data-testid="drawer-content">
                    <Drawer.Grabber>
                        <Drawer.GrabberIndicator />
                    </Drawer.Grabber>
                    <Drawer.Header>Sheet</Drawer.Header>
                    <Drawer.Footer>
                        <Drawer.Close>OK</Drawer.Close>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>
        );

        const content = await screen.findByTestId("drawer-content");
        expect(content).toHaveAttribute("data-side", "bottom");
        expect(screen.getByTestId("drawer-overlay")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Resize drawer" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    });
});
