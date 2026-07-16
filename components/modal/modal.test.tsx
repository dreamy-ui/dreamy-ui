import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as Modal from "./index";

describe("Modal", () => {
    it("exposes dialog role, aria-modal, and accessible name from Header", async () => {
        render(
            <Modal.Root
                isOpen
                onClose={() => {}}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>Confirm delete</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>This action cannot be undone.</Modal.Body>
                </Modal.Content>
            </Modal.Root>
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
            <Modal.Root
                isOpen
                onClose={() => {}}
            >
                <Modal.Content>
                    <Modal.Header>Title</Modal.Header>
                    <Modal.Body>Primary message for assistive tech</Modal.Body>
                </Modal.Content>
            </Modal.Root>
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
                <Modal.Root
                    initialFocusRef={inputRef}
                    isOpen
                    onClose={() => {}}
                >
                    <Modal.Content>
                        <Modal.Header>Edit profile</Modal.Header>
                        <Modal.CloseButton />
                        <Modal.Body>
                            <button type="button">Other control</button>
                            <input
                                aria-label="Display name"
                                ref={inputRef}
                            />
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
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
                        Open modal
                    </button>
                    <Modal.Root
                        isOpen={isOpen}
                        onClose={() => {
                            onClose();
                            setIsOpen(false);
                        }}
                        returnFocusOnClose
                    >
                        <Modal.Content>
                            <Modal.Header>Keyboard dismiss</Modal.Header>
                            <Modal.CloseButton />
                            <Modal.Body>Press Escape</Modal.Body>
                        </Modal.Content>
                    </Modal.Root>
                </>
            );
        }

        render(<Fixture />);

        const trigger = screen.getByRole("button", { name: "Open modal" });
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
            <Modal.Root
                isOpen
                onClose={onClose}
            >
                <Modal.Content>
                    <Modal.Header>Closeable</Modal.Header>
                    <Modal.CloseButton />
                    <Modal.Body>Body</Modal.Body>
                </Modal.Content>
            </Modal.Root>
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
            <Modal.Root
                closeOnEsc
                isOpen
                onClose={onClose}
                onEsc={onEsc}
            >
                <Modal.Content>
                    <Modal.Header>Esc</Modal.Header>
                    <Modal.Body>
                        <button type="button">Focusable</button>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
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
            <Modal.Root
                closeOnEsc={false}
                isOpen
                onClose={onClose}
            >
                <Modal.Content>
                    <Modal.Header>Stay open</Modal.Header>
                    <Modal.Body>
                        <button type="button">Focusable</button>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
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
                    <Modal.Root
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        returnFocusOnClose
                    >
                        <Modal.Content>
                            <Modal.Header>Final focus</Modal.Header>
                            <Modal.CloseButton />
                            <Modal.Body>Body</Modal.Body>
                        </Modal.Content>
                    </Modal.Root>
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

    it("forwards trapFocus and related modality props without throwing", async () => {
        render(
            <Modal.Root
                autoFocus
                blockScrollOnMount
                isOpen
                onClose={() => {}}
                preserveScrollBarGap
                scrollBehavior="inside"
                trapFocus
            >
                <Modal.Overlay data-testid="modal-overlay" />
                <Modal.Content data-testid="modal-content">
                    <Modal.Header>Props</Modal.Header>
                    <Modal.Footer>
                        <button type="button">OK</button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        );

        expect(await screen.findByTestId("modal-content")).toBeInTheDocument();
        expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    });
});
