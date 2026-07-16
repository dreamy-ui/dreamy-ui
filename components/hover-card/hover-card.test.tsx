import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as HoverCard from "./index";

describe("HoverCard", () => {
    it("opens on keyboard focus and associates trigger with content", async () => {
        const user = userEvent.setup();

        render(
            <HoverCard.Root
                closeDelay={0}
                openDelay={0}
            >
                <HoverCard.Trigger>
                    <button type="button">@dreamy</button>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Header>Dreamy UI</HoverCard.Header>
                    <HoverCard.Body>Component library preview</HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        );

        const trigger = screen.getByRole("button", { name: "@dreamy" });
        await user.tab();
        expect(trigger).toHaveFocus();

        const content = await waitFor(() => {
            const dialog = screen.queryByRole("dialog");
            const tooltip = screen.queryByRole("tooltip");
            const node = dialog ?? tooltip;
            expect(node).toBeTruthy();
            return node!;
        });

        expect(content).toHaveAccessibleName("Dreamy UI");
        expect(content).not.toHaveAttribute("aria-modal", "true");

        const describedBy = trigger.getAttribute("aria-describedby");
        const controls = trigger.getAttribute("aria-controls");
        expect(describedBy || controls).toBeTruthy();
    });

    it("opens on pointer hover", async () => {
        const user = userEvent.setup();

        render(
            <HoverCard.Root
                closeDelay={0}
                openDelay={0}
            >
                <HoverCard.Trigger>
                    <a href="https://dreamy-ui.com">Profile</a>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Body>Hover preview</HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        );

        await user.hover(screen.getByRole("link", { name: "Profile" }));

        await waitFor(() => {
            expect(
                screen.queryByRole("dialog") ?? screen.queryByRole("tooltip")
            ).toBeInTheDocument();
        });
        expect(screen.getByText("Hover preview")).toBeInTheDocument();
    });

    it("dismisses on Escape", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <HoverCard.Root
                closeDelay={0}
                closeOnEsc
                onClose={onClose}
                openDelay={0}
            >
                <HoverCard.Trigger>
                    <button type="button">Trigger</button>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Header>Dismissible</HoverCard.Header>
                    <HoverCard.Body>Press Escape</HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        );

        await user.tab();
        await waitFor(() => {
            expect(
                screen.queryByRole("dialog") ?? screen.queryByRole("tooltip")
            ).toBeInTheDocument();
        });

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        });
        expect(onClose).toHaveBeenCalled();
    });

    it("supports controlled open state and interactive footer without aria-modal", async () => {
        render(
            <HoverCard.Root
                closeDelay={0}
                isOpen
                openDelay={0}
            >
                <HoverCard.Trigger>
                    <button type="button">Controlled</button>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Header>Interactive</HoverCard.Header>
                    <HoverCard.Body>Contains actions</HoverCard.Body>
                    <HoverCard.Footer>
                        <button type="button">Follow</button>
                    </HoverCard.Footer>
                </HoverCard.Content>
            </HoverCard.Root>
        );

        expect(await screen.findByText("Contains actions")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();

        const content =
            screen.queryByRole("dialog") ??
            screen.queryByRole("tooltip") ??
            document.body.querySelector(".hover-card__content");
        expect(content).toBeTruthy();
        // Interactive hover cards must not use tooltip semantics (APG).
        expect(content).toHaveAttribute("role", "dialog");
        expect(content).not.toHaveAttribute("aria-modal", "true");
    });
});
