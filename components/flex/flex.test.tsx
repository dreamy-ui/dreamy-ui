import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Flex } from "./index";

describe("Flex", () => {
    it("renders children", () => {
        render(
            <Flex>
                <span>First</span>
                <span>Second</span>
            </Flex>
        );

        expect(screen.getByText("First")).toBeInTheDocument();
        expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("forwards props to the root element", () => {
        render(
            <Flex
                className="custom-flex"
                data-testid="flex-root"
                direction="column"
                gap={2}
            >
                Content
            </Flex>
        );

        const root = screen.getByTestId("flex-root");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveClass("custom-flex");
        expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("does not expose a default ARIA role", () => {
        render(
            <Flex data-testid="flex-root">
                Item
            </Flex>
        );

        expect(screen.getByTestId("flex-root")).not.toHaveAttribute("role");
    });
});
