import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Span } from "./index";

describe("Span", () => {
    it("renders children as an inline span", () => {
        render(<Span>Inline text</Span>);

        const el = screen.getByText("Inline text");

        expect(el.tagName).toBe("SPAN");
    });

    it("forwards props to the root element", () => {
        render(
            <Span
                className="custom-span"
                data-testid="span-root"
                id="span-id"
            >
                Fragment
            </Span>
        );

        const root = screen.getByTestId("span-root");

        expect(root.tagName).toBe("SPAN");
        expect(root).toHaveClass("custom-span");
        expect(root).toHaveAttribute("id", "span-id");
    });
});
