import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Skeleton, SkeletonText } from "./index";

describe("Skeleton", () => {
    it("is not focusable and can be decorative with aria-hidden", () => {
        render(
            <Skeleton
                aria-hidden="true"
                data-testid="skeleton"
            />
        );

        const skeleton = screen.getByTestId("skeleton");

        expect(skeleton).toHaveAttribute("aria-hidden", "true");
        expect(skeleton).not.toHaveAttribute("tabindex");
        expect(skeleton.tagName).toBe("DIV");
    });

    it("supports isLoaded and variant props", () => {
        render(
            <Skeleton
                data-testid="skeleton"
                isLoaded
                variant="shine"
            >
                Loaded content
            </Skeleton>
        );

        const skeleton = screen.getByTestId("skeleton");

        expect(skeleton).toBeInTheDocument();
        expect(screen.getByText("Loaded content")).toBeInTheDocument();
    });

    it("renders SkeletonText with the requested number of lines", () => {
        const { container } = render(
            <SkeletonText
                aria-hidden="true"
                lines={3}
            />
        );

        const wrapper = container.querySelector("[data-skeleton-text-wrapper]");
        const lines = container.querySelectorAll("[data-skeleton-text]");

        expect(wrapper).toBeInTheDocument();
        expect(lines).toHaveLength(3);
        for (const line of lines) {
            expect(line).toHaveAttribute("aria-hidden", "true");
        }
    });
});
