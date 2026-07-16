import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Box } from "./index";

describe("Box", () => {
    it("renders children", () => {
        render(<Box>Box content</Box>);

        expect(screen.getByText("Box content")).toBeInTheDocument();
    });

    it("forwards props to the root element", () => {
        render(
            <Box
                className="custom-box"
                data-testid="box-root"
                id="box-id"
            >
                Content
            </Box>
        );

        const root = screen.getByTestId("box-root");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveClass("custom-box");
        expect(root).toHaveAttribute("id", "box-id");
    });

    it("passes through role when provided", () => {
        render(
            <Box
                role="region"
                aria-label="Content region"
            >
                Region content
            </Box>
        );

        expect(screen.getByRole("region", { name: "Content region" })).toBeInTheDocument();
    });
});
