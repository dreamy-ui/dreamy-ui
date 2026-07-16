import { useRipple } from "@dreamy-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "../test/render";
import { Ripple } from "./index";

function RippleHost() {
    const { ripples, onPointerDown, onClick, onClear, currentRipple, isDisabled } = useRipple();

    return (
        <button
            type="button"
            aria-label="Ripple host"
            disabled={isDisabled}
            onClick={onClick}
            onPointerDown={onPointerDown}
            style={{ position: "relative", width: 80, height: 40 }}
        >
            Host
            <Ripple
                ripples={isDisabled ? [] : ripples}
                currentRipple={currentRipple}
                onClear={onClear}
            />
        </button>
    );
}

describe("Ripple", () => {
    it("marks ripple nodes as decorative and non-focusable", () => {
        const onClear = vi.fn();

        render(
            <div style={{ position: "relative" }}>
                <Ripple
                    ripples={[{ key: "ripple-1", x: 10, y: 10, size: 40 }]}
                    currentRipple={null}
                    onClear={onClear}
                />
            </div>
        );

        const ripple = document.querySelector('[data-part="ripple"]');

        expect(ripple).toBeTruthy();
        expect(ripple).toHaveAttribute("aria-hidden", "true");
        expect(ripple).not.toHaveAttribute("role");
        expect(ripple).not.toHaveAttribute("aria-label");
        expect(ripple).not.toHaveAttribute("aria-live");
        expect(ripple).not.toHaveAttribute("tabindex");
        expect(ripple).toHaveStyle({ pointerEvents: "none" });
    });

    it("keeps the host control keyboard operable without relying on ripple", async () => {
        const user = userEvent.setup();
        const onActivate = vi.fn();

        function Host() {
            const { ripples, onPointerDown, onClick, onClear, currentRipple } = useRipple();

            return (
                <button
                    type="button"
                    onClick={function handleClick(event) {
                        onClick(event);
                        onActivate();
                    }}
                    onPointerDown={onPointerDown}
                >
                    Activate
                    <Ripple
                        ripples={ripples}
                        currentRipple={currentRipple}
                        onClear={onClear}
                    />
                </button>
            );
        }

        render(<Host />);

        const button = screen.getByRole("button", { name: "Activate" });
        button.focus();
        await user.keyboard("{Enter}");

        expect(onActivate).toHaveBeenCalled();
        expect(button).toHaveAccessibleName("Activate");
    });

    it("does not steal accessible naming from the host", () => {
        render(<RippleHost />);

        expect(screen.getByRole("button", { name: "Ripple host" })).toBeInTheDocument();
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("renders no interactive ripple role when ripples are present", () => {
        const onClear = vi.fn();

        render(
            <Ripple
                ripples={[
                    { key: "a", x: 0, y: 0, size: 20 },
                    { key: "b", x: 5, y: 5, size: 30 }
                ]}
                currentRipple="b"
                onClear={onClear}
            />
        );

        expect(document.querySelectorAll('[data-part="ripple"]')).toHaveLength(2);
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
    });
});
