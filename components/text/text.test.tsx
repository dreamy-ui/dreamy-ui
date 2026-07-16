import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Text } from "./index";

describe("Text", () => {
    it("defaults to a paragraph for body copy", () => {
        render(<Text>Body copy</Text>);

        const text = screen.getByText("Body copy");

        expect(text.tagName).toBe("P");
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    it("supports polymorphic as for inline text", () => {
        render(
            <Text
                as="span"
                data-testid="text"
                size="sm"
            >
                Inline note
            </Text>
        );

        const text = screen.getByTestId("text");

        expect(text.tagName).toBe("SPAN");
        expect(text).toHaveTextContent("Inline note");
    });

    it("does not expose heading semantics when styled large", () => {
        render(
            <Text size="2xl">
                Large supporting text
            </Text>
        );

        expect(screen.getByText("Large supporting text").tagName).toBe("P");
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
});
