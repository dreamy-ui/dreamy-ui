import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import { Tooltip } from "./index";

describe("Tooltip", () => {
    it("shows role=tooltip on focus and sets aria-describedby on the trigger", async () => {
        const user = userEvent.setup();

        render(
            <Tooltip
                closeDelay={0}
                content="Helpful tip"
                delay={0}
            >
                <button type="button">Info</button>
            </Tooltip>
        );

        const trigger = screen.getByRole("button", { name: "Info" });

        await user.tab();
        expect(trigger).toHaveFocus();

        const tooltip = await screen.findByRole("tooltip");
        expect(tooltip).toHaveTextContent("Helpful tip");
        expect(tooltip).toHaveAttribute("data-slot", "tooltip-content");
        expect(tooltip).toHaveAttribute("data-open", "");

        await waitFor(() => {
            expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
        });
    });

    it("shows on pointer hover", async () => {
        const user = userEvent.setup();

        render(
            <Tooltip
                closeDelay={0}
                content="Hover tip"
                delay={0}
            >
                <button type="button">Hover me</button>
            </Tooltip>
        );

        await user.hover(screen.getByRole("button", { name: "Hover me" }));

        expect(await screen.findByRole("tooltip")).toHaveTextContent("Hover tip");
    });

    it("dismisses on Escape while open and notifies onOpenChange with details", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Tooltip
                closeDelay={0}
                content="Esc tip"
                delay={0}
                onOpenChange={onOpenChange}
            >
                <button type="button">Focus me</button>
            </Tooltip>
        );

        await user.tab();
        await screen.findByRole("tooltip");

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        });
        expect(onOpenChange).toHaveBeenCalledWith(
            false,
            expect.objectContaining({ reason: "escape-key" })
        );
    });

    it("hides on blur and does not trap focus or set aria-modal", async () => {
        const user = userEvent.setup();

        render(
            <>
                <Tooltip
                    closeDelay={0}
                    content="Blur tip"
                    delay={0}
                >
                    <button type="button">First</button>
                </Tooltip>
                <button type="button">Second</button>
            </>
        );

        await user.tab();
        const tooltip = await screen.findByRole("tooltip");
        expect(tooltip).not.toHaveAttribute("aria-modal");

        await user.tab();
        expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();

        await waitFor(() => {
            expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        });
    });

    it("renders children only when content is empty", () => {
        render(
            <Tooltip content={null}>
                <button type="button">Bare</button>
            </Tooltip>
        );

        expect(screen.getByRole("button", { name: "Bare" })).toBeInTheDocument();
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("wraps non-focusable children when shouldWrapChildren is true", async () => {
        const user = userEvent.setup();

        render(
            <Tooltip
                closeDelay={0}
                content="Wrapped"
                delay={0}
                shouldWrapChildren
            >
                Plain text trigger
            </Tooltip>
        );

        await user.tab();
        expect(await screen.findByRole("tooltip")).toHaveTextContent("Wrapped");
    });

    it("supports controlled open and disabled state", async () => {
        const user = userEvent.setup();

        const { rerender } = render(
            <Tooltip
                content="Disabled tip"
                delay={0}
                disabled
                positioning={{ placement: "top" }}
            >
                <button type="button">Disabled tooltip</button>
            </Tooltip>
        );

        await user.hover(screen.getByRole("button", { name: "Disabled tooltip" }));
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        rerender(
            <Tooltip
                content="Controlled tip"
                open
            >
                <button type="button">Controlled tooltip</button>
            </Tooltip>
        );

        expect(await screen.findByRole("tooltip")).toHaveTextContent("Controlled tip");
    });

    it("renders a UI SDK arrow with sizing and background variables when hasArrow is set", async () => {
        const user = userEvent.setup();

        render(
            <Tooltip
                arrowSize={12}
                closeDelay={0}
                content="With arrow"
                delay={0}
                hasArrow
            >
                <button type="button">Arrow trigger</button>
            </Tooltip>
        );

        await user.hover(screen.getByRole("button", { name: "Arrow trigger" }));
        await screen.findByRole("tooltip");

        const arrow = document.querySelector("[data-slot='tooltip-arrow']") as HTMLElement | null;
        expect(arrow).toBeTruthy();
        expect(arrow!.style.getPropertyValue("--arrow-size")).toBe("12px");
        expect(arrow!.style.getPropertyValue("--arrow-background")).toBe("var(--tooltip-bg)");
    });
});
