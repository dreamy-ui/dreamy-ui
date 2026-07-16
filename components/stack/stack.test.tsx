import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { HStack, Stack, VStack } from "./index";

describe("Stack", () => {
    it("renders children", () => {
        render(
            <Stack>
                <span>One</span>
                <span>Two</span>
            </Stack>
        );

        expect(screen.getByText("One")).toBeInTheDocument();
        expect(screen.getByText("Two")).toBeInTheDocument();
    });

    it("renders separators between children", () => {
        render(
            <Stack separator={<span data-testid="stack-sep">|</span>}>
                <span>A</span>
                <span>B</span>
                <span>C</span>
            </Stack>
        );

        expect(screen.getAllByTestId("stack-sep")).toHaveLength(2);
        expect(screen.getByText("A")).toBeInTheDocument();
        expect(screen.getByText("C")).toBeInTheDocument();
    });

    it("forwards props to the root element", () => {
        render(
            <Stack
                className="custom-stack"
                data-testid="stack-root"
                gap={3}
                direction="horizontal"
            >
                Content
            </Stack>
        );

        const root = screen.getByTestId("stack-root");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveClass("custom-stack");
    });
});

describe("HStack", () => {
    it("renders children and separators", () => {
        render(
            <HStack
                data-testid="hstack-root"
                separator={<span aria-hidden="true">·</span>}
            >
                <span>Left</span>
                <span>Right</span>
            </HStack>
        );

        expect(screen.getByTestId("hstack-root").tagName).toBe("DIV");
        expect(screen.getByText("Left")).toBeInTheDocument();
        expect(screen.getByText("Right")).toBeInTheDocument();
        expect(screen.getByText("·")).toHaveAttribute("aria-hidden", "true");
    });
});

describe("VStack", () => {
    it("renders children", () => {
        render(
            <VStack data-testid="vstack-root">
                <span>Top</span>
                <span>Bottom</span>
            </VStack>
        );

        expect(screen.getByTestId("vstack-root")).toBeInTheDocument();
        expect(screen.getByText("Top")).toBeInTheDocument();
        expect(screen.getByText("Bottom")).toBeInTheDocument();
    });
});
