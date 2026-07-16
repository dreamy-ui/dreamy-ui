import { useReducedMotion } from "@dreamy-ui/react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { MotionBox, MotionFlex } from "./index";

function ReduceMotionProbe() {
    const reduceMotion = useReducedMotion();

    return <span data-testid="reduce-motion">{String(reduceMotion)}</span>;
}

describe("MotionBox", () => {
    it("renders children", () => {
        render(
            <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Motion content
            </MotionBox>
        );

        expect(screen.getByText("Motion content")).toBeInTheDocument();
    });

    it("forwards props to the root element", () => {
        render(
            <MotionBox
                className="custom-motion"
                data-testid="motion-root"
                id="motion-id"
            >
                Content
            </MotionBox>
        );

        const root = screen.getByTestId("motion-root");

        expect(root.tagName).toBe("DIV");
        expect(root).toHaveClass("custom-motion");
        expect(root).toHaveAttribute("id", "motion-id");
    });

    it("respects reduceMotion from DreamyProvider", () => {
        render(
            <>
                <ReduceMotionProbe />
                <MotionBox
                    data-testid="motion-root"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Available without waiting on motion
                </MotionBox>
            </>
        );

        expect(screen.getByTestId("reduce-motion")).toHaveTextContent("true");
        expect(screen.getByText("Available without waiting on motion")).toBeInTheDocument();
        expect(screen.getByTestId("motion-root")).toBeInTheDocument();
    });
});

describe("MotionFlex", () => {
    it("renders children with flex layout props", () => {
        render(
            <MotionFlex
                data-testid="motion-flex"
                direction="column"
                gap={2}
                align="center"
            >
                <span>First</span>
                <span>Second</span>
            </MotionFlex>
        );

        expect(screen.getByTestId("motion-flex").tagName).toBe("DIV");
        expect(screen.getByText("First")).toBeInTheDocument();
        expect(screen.getByText("Second")).toBeInTheDocument();
    });
});
