import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Heading } from "./index";

describe("Heading", () => {
    it("defaults to an h3 heading element", () => {
        render(<Heading>Section title</Heading>);

        const heading = screen.getByRole("heading", { level: 3, name: "Section title" });

        expect(heading.tagName).toBe("H3");
    });

    it("supports semantic heading levels via as", () => {
        render(
            <Heading
                as="h1"
                size="2xl"
            >
                Page title
            </Heading>
        );

        expect(screen.getByRole("heading", { level: 1, name: "Page title" }).tagName).toBe("H1");
    });

    it("can render other heading levels for nested outline", () => {
        render(
            <Heading as="h2">
                Nested section
            </Heading>
        );

        expect(screen.getByRole("heading", { level: 2, name: "Nested section" })).toBeInTheDocument();
    });
});
