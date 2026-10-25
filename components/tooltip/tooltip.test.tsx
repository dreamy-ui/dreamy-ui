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
                openDelay={0}
            >
                <button type="button">Info</button>
            </Tooltip>
        );

        const trigger = screen.getByRole("button", { name: "Info" });
        expect(trigger).not.toHaveAttribute("aria-describedby");

        await user.tab();
        expect(trigger).toHaveFocus();

        const tooltip = await screen.findByRole("tooltip");
        expect(tooltip).toHaveTextContent("Helpful tip");

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
                openDelay={0}
            >
                <button type="button">Hover me</button>
            </Tooltip>
        );

        await user.hover(screen.getByRole("button", { name: "Hover me" }));

        expect(await screen.findByRole("tooltip")).toHaveTextContent("Hover tip");
    });

    it("dismisses on Escape while open", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();

        render(
            <Tooltip
                closeDelay={0}
                closeOnEscape
                content="Esc tip"
                onOpenChange={onOpenChange}
                openDelay={0}
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
        expect(onOpenChange).toHaveBeenCalledWith({ open: false });
    });

    it("hides on blur and does not trap focus or set aria-modal", async () => {
        const user = userEvent.setup();

        render(
            <>
                <Tooltip
                    closeDelay={0}
                    content="Blur tip"
                    openDelay={0}
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
                openDelay={0}
                shouldWrapChildren
            >
                Plain text trigger
            </Tooltip>
        );

        await user.tab();
        expect(await screen.findByRole("tooltip")).toHaveTextContent("Wrapped");
    });

    it("supports placement and disabled", async () => {
        const user = userEvent.setup();

        render(
            <Tooltip
                content="Disabled tip"
                disabled
                openDelay={0}
                positioning={{ placement: "top" }}
            >
                <button type="button">Disabled tooltip</button>
            </Tooltip>
        );

        await user.hover(screen.getByRole("button", { name: "Disabled tooltip" }));
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("renders an arrow with Ark sizing and background variables when hasArrow is set", async () => {
        const user = userEvent.setup();

        render(
            <Tooltip
                arrowSize={12}
                closeDelay={0}
                content="With arrow"
                hasArrow
                openDelay={0}
            >
                <button type="button">Arrow trigger</button>
            </Tooltip>
        );

        await user.hover(screen.getByRole("button", { name: "Arrow trigger" }));
        await screen.findByRole("tooltip");

        const arrow = document.querySelector("[data-scope='tooltip'][data-part='arrow']");
        const arrowTip = document.querySelector("[data-scope='tooltip'][data-part='arrow-tip']");

        expect(arrow).toBeTruthy();
        expect(arrowTip).toBeTruthy();

        const arrowEl = arrow as HTMLElement;

        expect(arrowEl.style.getPropertyValue("--arrow-size")).toBe("12px");
        expect(arrowEl.style.getPropertyValue("--arrow-background")).toBe("var(--tooltip-bg)");
        expect(arrowEl.style.width).toBe("var(--arrow-size)");
    });
});
