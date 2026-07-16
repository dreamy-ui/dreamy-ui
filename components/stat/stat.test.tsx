import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import * as Stat from "./index";

describe("Stat", () => {
    it("uses description list semantics for label and value", () => {
        render(
            <Stat.Root data-testid="stat">
                <Stat.Label>Unique visitors</Stat.Label>
                <Stat.ValueText>192.1k</Stat.ValueText>
            </Stat.Root>
        );

        const root = screen.getByTestId("stat");

        expect(root.tagName).toBe("DL");
        expect(screen.getByText("Unique visitors").tagName).toBe("DT");
        expect(screen.getByText("192.1k").tagName).toBe("DD");
    });

    it("exposes visible label, value, unit, and hint text", () => {
        render(
            <Stat.Root>
                <Stat.Label>Time to complete</Stat.Label>
                <Stat.ValueText>
                    3 <Stat.ValueUnit>hr</Stat.ValueUnit>
                </Stat.ValueText>
                <Stat.Hint>+12% from last month</Stat.Hint>
            </Stat.Root>
        );

        expect(screen.getByText("Time to complete")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("hr")).toBeInTheDocument();
        expect(screen.getByText("+12% from last month")).toBeInTheDocument();
    });

    it("provides a text alternative for up indicators", () => {
        render(
            <Stat.Root>
                <Stat.Label>Sales</Stat.Label>
                <Stat.ValueText>$4,200</Stat.ValueText>
                <Stat.UpIndicator data-testid="up" />
            </Stat.Root>
        );

        const indicator = screen.getByTestId("up");

        expect(indicator).toHaveAttribute("data-type", "up");
        expect(
            indicator.getAttribute("aria-label") ||
                indicator.textContent ||
                indicator.querySelector("[aria-hidden='true']")
        ).toBeTruthy();

        const hasTextAlternative =
            Boolean(indicator.getAttribute("aria-label")) ||
            /up|increase|increased/i.test(indicator.textContent ?? "") ||
            Boolean(
                indicator.querySelector("[aria-hidden='true']") &&
                    screen.queryByText(/up|increase|increased/i)
            );

        expect(hasTextAlternative).toBe(true);
    });

    it("provides a text alternative for down indicators", () => {
        render(
            <Stat.Root>
                <Stat.Label>Conversions</Stat.Label>
                <Stat.ValueText>2.4%</Stat.ValueText>
                <Stat.DownIndicator data-testid="down" />
            </Stat.Root>
        );

        const indicator = screen.getByTestId("down");

        expect(indicator).toHaveAttribute("data-type", "down");

        const hasTextAlternative =
            Boolean(indicator.getAttribute("aria-label")) ||
            /down|decrease|decreased/i.test(indicator.textContent ?? "") ||
            Boolean(
                indicator.querySelector("[aria-hidden='true']") &&
                    screen.queryByText(/down|decrease|decreased/i)
            );

        expect(hasTextAlternative).toBe(true);
    });

    it("does not make presentational parts focusable controls", () => {
        render(
            <Stat.Root data-testid="stat">
                <Stat.Label>Revenue</Stat.Label>
                <Stat.ValueText>$935.40</Stat.ValueText>
                <Stat.Hint>Helper</Stat.Hint>
                <Stat.UpIndicator data-testid="up" />
            </Stat.Root>
        );

        const root = screen.getByTestId("stat");
        const label = screen.getByText("Revenue");
        const value = screen.getByText("$935.40");
        const hint = screen.getByText("Helper");
        const up = screen.getByTestId("up");

        for (const node of [root, label, value, hint, up]) {
            expect(node).not.toHaveAttribute("tabindex");
            expect(node).not.toHaveAttribute("role", "button");
        }
    });

    it("keeps trend meaning available beyond color via adjacent text", () => {
        render(
            <Stat.Root>
                <Stat.Label>Sales</Stat.Label>
                <Stat.ValueText>$4,200</Stat.ValueText>
                <span>
                    <Stat.UpIndicator aria-hidden="true" />
                    12% increase
                </span>
            </Stat.Root>
        );

        expect(screen.getByText(/12% increase/i)).toBeInTheDocument();
        expect(screen.getByText("Sales")).toBeInTheDocument();
    });
});
