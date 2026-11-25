import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import * as HoverCard from "./index";

describe("HoverCard", () => {
    it("opens on keyboard focus and exposes UI SDK slots and open state", async () => {
        const user = userEvent.setup();

        render(
            <HoverCard.Root
                closeDelay={0}
                delay={0}
            >
                <HoverCard.Trigger>
                    <a href="https://dreamy-ui.com">@dreamy</a>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Header>Dreamy UI</HoverCard.Header>
                    <HoverCard.Body>Component library preview</HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        );

        const trigger = screen.getByRole("link", { name: "@dreamy" });
        expect(trigger).toHaveAttribute("data-slot", "hover-card-trigger");

        await user.tab();
        expect(trigger).toHaveFocus();

        expect(await screen.findByText("Component library preview")).toBeInTheDocument();
        const content = document.querySelector("[data-slot='hover-card-content']");
        expect(content).toBeTruthy();
        expect(content).toHaveAttribute("data-open", "");
        expect(trigger).toHaveAttribute("data-open", "");
    });

    it("opens on pointer hover", async () => {
        const user = userEvent.setup();

        render(
            <HoverCard.Root
                closeDelay={0}
                delay={0}
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

        expect(await screen.findByText("Hover preview")).toBeInTheDocument();
    });

    it("dismisses on Escape and notifies onOpenChange with details", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <HoverCard.Root
                closeDelay={0}
                delay={0}
                onOpenChange={onOpenChange}
            >
                <HoverCard.Trigger>
                    <a href="https://dreamy-ui.com">Trigger</a>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Header>Dismissible</HoverCard.Header>
                    <HoverCard.Body>Press Escape</HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        );

        await user.tab();
        expect(await screen.findByText("Press Escape")).toBeInTheDocument();

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByText("Press Escape")).not.toBeInTheDocument();
        });
        expect(onOpenChange).toHaveBeenCalledWith(
            false,
            expect.objectContaining({ reason: "escape-key" })
        );
    });

    it("supports controlled open state, arrow, and interactive footer", async () => {
        render(
            <HoverCard.Root
                arrowSize={10}
                closeDelay={0}
                delay={0}
                hasArrow
                open
            >
                <HoverCard.Trigger>
                    <a href="https://dreamy-ui.com">Controlled</a>
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

        const arrow = document.querySelector("[data-slot='hover-card-arrow']") as HTMLElement | null;
        expect(arrow).toBeTruthy();
        expect(arrow!.style.getPropertyValue("--arrow-size")).toBe("10px");
    });

    it("does not open when disabled", async () => {
        const user = userEvent.setup();

        render(
            <HoverCard.Root
                closeDelay={0}
                delay={0}
                disabled
            >
                <HoverCard.Trigger>
                    <a href="https://dreamy-ui.com">Disabled link</a>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <HoverCard.Body>Hidden preview</HoverCard.Body>
                </HoverCard.Content>
            </HoverCard.Root>
        );

        await user.hover(screen.getByRole("link", { name: "Disabled link" }));
        expect(screen.queryByText("Hidden preview")).not.toBeInTheDocument();
    });
});
