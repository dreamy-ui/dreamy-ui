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
                isOpen
                onClose={() => {}}
            >
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>Edit settings</Drawer.Header>
                    <Drawer.CloseButton />
                    <Drawer.Body>Adjust your preferences.</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        );

        const dialog = await screen.findByRole("dialog");

        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAttribute("tabIndex", "-1");
        expect(dialog).toHaveAccessibleName("Edit settings");

        const labelledBy = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(labelledBy!)).toHaveTextContent("Edit settings");
    });

    it("associates Body via aria-describedby when present", async () => {
        render(
            <Drawer.Root
                isOpen
                onClose={() => {}}
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
                    isOpen
                    onClose={() => {}}
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
        const onClose = vi.fn();

        function Fixture() {
            const [isOpen, setIsOpen] = useState(false);

            return (
                <>
                    <button
                        onClick={() => setIsOpen(true)}
                        type="button"
                    >
                        Open drawer
                    </button>
                    <Drawer.Root
                        isOpen={isOpen}
                        onClose={() => {
                            onClose();
                            setIsOpen(false);
                        }}
                        returnFocusOnClose
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

        const trigger = screen.getByRole("button", { name: "Open drawer" });
        await user.click(trigger);

        const dialog = await screen.findByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
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
        const onClose = vi.fn();

        render(
            <Drawer.Root
                isOpen
                onClose={onClose}
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

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when closeOnEsc is enabled and Escape is pressed", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onEsc = vi.fn();

        render(
            <Drawer.Root
                closeOnEsc
                isOpen
                onClose={onClose}
                onEsc={onEsc}
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

        expect(onClose).toHaveBeenCalled();
        expect(onEsc).toHaveBeenCalled();
    });

    it("does not close on Escape when closeOnEsc is false", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <Drawer.Root
                closeOnEsc={false}
                isOpen
                onClose={onClose}
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

        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("returns focus to finalFocusRef when provided", async () => {
        const user = userEvent.setup();

        function Fixture() {
            const [isOpen, setIsOpen] = useState(true);
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
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        returnFocusOnClose
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

    it("forwards placement, variant, and modality props without throwing", async () => {
        render(
            <Drawer.Root
                autoFocus
                blockScrollOnMount
                isOpen
                onClose={() => {}}
                placement="left"
                preserveScrollBarGap
                scrollBehavior="inside"
                trapFocus
                variant="simple"
            >
                <Drawer.Overlay data-testid="drawer-overlay" />
                <Drawer.Content data-testid="drawer-content">
                    <Drawer.Header>Props</Drawer.Header>
                    <Drawer.Footer>
                        <button type="button">OK</button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Root>
        );

        expect(await screen.findByTestId("drawer-content")).toBeInTheDocument();
        expect(screen.getByTestId("drawer-overlay")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    });
});
