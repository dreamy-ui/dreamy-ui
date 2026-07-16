import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Wrap } from "./index";

describe("Wrap", () => {
    it("renders children", () => {
        render(
            <Wrap>
                <span>Chip A</span>
                <span>Chip B</span>
            </Wrap>
        );

        expect(screen.getByText("Chip A")).toBeInTheDocument();
        expect(screen.getByText("Chip B")).toBeInTheDocument();
    });

    it("forwards props to the root element", () => {
        render(
            <Wrap
                className="custom-wrap"
                data-testid="wrap-root"
                gap={2}
                justify="center"
            >
                Content
            </Wrap>
        );

        const root = screen.getByTestId("wrap-root");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveClass("custom-wrap");
        expect(root).not.toHaveAttribute("role");
    });
});
