import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { render } from "../test/render";
import * as ActionBar from "./index";

function ActionBarHarness(props: { defaultOpen?: boolean; onClose?: () => void }) {
    const { defaultOpen = true, onClose } = props;
    const [isOpen, setIsOpen] = useState(defaultOpen);

    function handleClose() {
        setIsOpen(false);
        onClose?.();
    }

    return (
        <>
            <button
                type="button"
                onClick={function open() {
                    setIsOpen(true);
                }}
            >
                Open actions
            </button>
            <ActionBar.Root
                isOpen={isOpen}
                onClose={handleClose}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>3 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button size="sm">Delete</Button>
                    <Button
                        size="sm"
                        aria-label="Share selection"
                    >
                        Share
                    </Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

function getActionSurface() {
    const toolbar = screen.queryByRole("toolbar", { name: "Action bar" });
    if (toolbar) return toolbar;
    return screen.getByRole("dialog", { name: "Action bar" });
}

describe("ActionBar", () => {
    it("exposes a named toolbar surface when open", () => {
        render(
            <ActionBar.Root
                isOpen
                onClose={() => {}}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 items selected</ActionBar.SelectionTrigger>
                    <Button size="sm">Delete</Button>
                </ActionBar.Content>
            </ActionBar.Root>
        );

        const surface = getActionSurface();

        expect(surface).toHaveAttribute("role", "toolbar");
        expect(surface).toHaveAccessibleName("Action bar");
        expect(screen.getByText("2 items selected")).toBeInTheDocument();
    });

    it("names the close control and dismisses on click", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(<ActionBarHarness onClose={onClose} />);

        expect(getActionSurface()).toBeInTheDocument();

        const close = screen.getByRole("button", { name: "Close action bar" });
        await user.click(close);

        expect(onClose).toHaveBeenCalled();
        await waitFor(function assertClosed() {
            expect(screen.queryByRole("dialog", { name: "Action bar" })).not.toBeInTheDocument();
            expect(screen.queryByRole("toolbar", { name: "Action bar" })).not.toBeInTheDocument();
        });
    });

    it("dismisses with Escape when open", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(<ActionBarHarness onClose={onClose} />);

        getActionSurface().focus();
        await user.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalled();
        await waitFor(function assertClosed() {
            expect(screen.queryByRole("dialog", { name: "Action bar" })).not.toBeInTheDocument();
            expect(screen.queryByRole("toolbar", { name: "Action bar" })).not.toBeInTheDocument();
        });
    });

    it("keeps action buttons keyboard operable", async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();

        render(
            <ActionBar.Root
                isOpen
                onClose={() => {}}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>1 selected</ActionBar.SelectionTrigger>
                    <Button
                        size="sm"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        );

        const deleteButton = screen.getByRole("button", { name: "Delete" });
        await user.click(deleteButton);
        expect(onDelete).toHaveBeenCalledTimes(1);

        onDelete.mockClear();
        deleteButton.focus();
        await user.keyboard(" ");
        expect(onDelete).toHaveBeenCalled();
    });

    it("exposes a vertical separator", () => {
        render(
            <ActionBar.Root
                isOpen
                onClose={() => {}}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator data-testid="separator" />
                    <Button size="sm">Delete</Button>
                </ActionBar.Content>
            </ActionBar.Root>
        );

        const separator = screen.getByRole("separator");

        expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });

    it("does not leave content focusable when closed", async () => {
        const user = userEvent.setup();

        render(<ActionBarHarness defaultOpen={false} />);

        expect(screen.queryByRole("dialog", { name: "Action bar" })).not.toBeInTheDocument();
        expect(screen.queryByRole("toolbar", { name: "Action bar" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Open actions" }));
        expect(getActionSurface()).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("shows meaningful selection summary text", () => {
        render(
            <ActionBar.Root
                isOpen
                onClose={() => {}}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>12 files selected</ActionBar.SelectionTrigger>
                    <Button size="sm">Download</Button>
                </ActionBar.Content>
            </ActionBar.Root>
        );

        expect(screen.getByText("12 files selected")).toBeInTheDocument();
    });

    it("supports arrow-key focus movement among actions when toolbar semantics apply", async () => {
        const user = userEvent.setup();

        render(
            <ActionBar.Root
                isOpen
                onClose={() => {}}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <Button size="sm">Delete</Button>
                    <Button size="sm">Share</Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        );

        const surface = getActionSurface();
        expect(surface).toHaveAttribute("role", "toolbar");

        const deleteButton = screen.getByRole("button", { name: "Delete" });
        const shareButton = screen.getByRole("button", { name: "Share" });

        deleteButton.focus();
        await user.keyboard("{ArrowRight}");

        expect(shareButton).toHaveFocus();
    });
});
