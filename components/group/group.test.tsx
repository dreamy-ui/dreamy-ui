import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Group } from "./index";

describe("Group", () => {
    it("renders children", () => {
        render(
            <Group>
                <button type="button">One</button>
                <button type="button">Two</button>
            </Group>
        );

        expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
    });

    it("marks multiple children with group item metadata", () => {
        render(
            <Group data-testid="group-root">
                <button type="button">First</button>
                <button type="button">Middle</button>
                <button type="button">Last</button>
            </Group>
        );

        const first = screen.getByRole("button", { name: "First" });
        const middle = screen.getByRole("button", { name: "Middle" });
        const last = screen.getByRole("button", { name: "Last" });

        expect(first).toHaveAttribute("data-group-item");
        expect(first).toHaveAttribute("data-first");
        expect(middle).toHaveAttribute("data-between");
        expect(last).toHaveAttribute("data-last");
        expect(screen.getByTestId("group-root")).not.toHaveAttribute("role");
    });

    it("supports role=group with an accessible name", () => {
        render(
            <Group
                role="group"
                aria-label="Text alignment"
            >
                <button type="button">Left</button>
                <button type="button">Center</button>
                <button type="button">Right</button>
            </Group>
        );

        expect(screen.getByRole("group", { name: "Text alignment" })).toBeInTheDocument();
    });

    it("forwards props to the root element", () => {
        render(
            <Group
                className="custom-group"
                data-testid="group-root"
                attached
                orientation="horizontal"
            >
                <button type="button">A</button>
                <button type="button">B</button>
            </Group>
        );

        const root = screen.getByTestId("group-root");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveClass("custom-group");
    });
});
