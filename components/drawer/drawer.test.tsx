import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Drawer from "./index";

describe("Drawer", () => {
    it("exposes dialog role, aria-modal, and accessible name from Header", async () => {
        render(
            <Drawer.Root
                open
                onOpenChange={() => {}}
            >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Confirm delete</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>This action cannot be undone.</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        const dialog = await screen.findByRole("dialog");

        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAttribute("tabIndex", "-1");
        expect(dialog).toHaveAccessibleName("Confirm delete");

        const labelledBy = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(labelledBy!)).toHaveTextContent("Confirm delete");
    });

    it("associates Body via aria-describedby when present", async () => {
        render(
            <Drawer.Root
                open
                onOpenChange={() => {}}
            >
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

    it("focuses the element pointed to by initialFocusRef when open", async () => {
        function Fixture() {
            const inputRef = useRef<HTMLInputElement>(null);

            return (
                <Drawer.Root
                    initialFocusRef={inputRef}
                    open
                    onOpenChange={() => {}}
                >
                    <Drawer.Content>
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

    it("closes on Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        function Fixture() {
            const [open, setOpen] = useState(false);

            return (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        type="button"
                    >
                        Open Drawer
                    </button>
                    <Drawer.Root
                        open={open}
                        onOpenChange={(details) => {
                            onOpenChange(details);
                            setOpen(details.open);
                        }}
                        restoreFocus
                    >
                        <Drawer.Content>
                            <Drawer.Header>Keyboard dismiss</Drawer.Header>
                            <Drawer.CloseButton />
                            <Drawer.Body>Press Escape</Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Root>
                </>
            );
        }

        render(<Fixture />);

        const trigger = screen.getByRole("button", { name: "Open Drawer" });
        await user.click(trigger);

        const dialog = await screen.findByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(onOpenChange).toHaveBeenCalledWith({ open: false });
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
                open
                onOpenChange={onOpenChange}
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

        expect(onOpenChange).toHaveBeenCalledWith({ open: false });
    });

    it("calls onOpenChange when closeOnEscape is enabled and Escape is pressed", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Drawer.Root
                closeOnEscape
                open
                onOpenChange={onOpenChange}
            >
                <Drawer.Content>
                    <Drawer.Header>Esc</Drawer.Header>
                    <Drawer.Body>
                        <button type="button">Focusable</button>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        await screen.findByRole("dialog");
        await user.click(screen.getByRole("button", { name: "Focusable" }));
        await user.keyboard("{Escape}");

        expect(onOpenChange).toHaveBeenCalledWith({ open: false });
    });

    it("does not close on Escape when closeOnEscape is false", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Drawer.Root
                closeOnEscape={false}
                open
                onOpenChange={onOpenChange}
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

        expect(onOpenChange).not.toHaveBeenCalledWith({ open: false });
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("returns focus to finalFocusRef when provided", async () => {
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
                        finalFocusRef={finalRef}
                        open={open}
                        onOpenChange={({ open: nextOpen }) => setOpen(nextOpen)}
                        restoreFocus
                    >
                        <Drawer.Content>
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

    it("forwards trapFocus and related Drawerity props without throwing", async () => {
        render(
            <Drawer.Root
                autoFocus
                blockScrollOnMount
                open
                onOpenChange={() => {}}
                preserveScrollBarGap
                scrollBehavior="inside"
                trapFocus
            >
                <Drawer.Overlay data-testid="Drawer-overlay" />
                <Drawer.Content data-testid="Drawer-content">
                    <Drawer.Header>Props</Drawer.Header>
                    <Drawer.Footer>
                        <button type="button">OK</button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>
        );

        expect(await screen.findByTestId("Drawer-content")).toBeInTheDocument();
        expect(screen.getByTestId("Drawer-overlay")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    });
});
