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
        const onClose = vi.fn();

        render(
            <Tooltip
                closeDelay={0}
                closeOnEsc
                content="Esc tip"
                onClose={onClose}
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
        expect(onClose).toHaveBeenCalled();
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

    it("supports placement and isDisabled", async () => {
        const user = userEvent.setup();

        render(
            <Tooltip
                content="Disabled tip"
                isDisabled
                openDelay={0}
                positioning={{ placement: "top" }}
            >
                <button type="button">Disabled tooltip</button>
            </Tooltip>
        );

        await user.hover(screen.getByRole("button", { name: "Disabled tooltip" }));
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
});
