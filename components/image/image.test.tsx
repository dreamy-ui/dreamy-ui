import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../test/render";
import { Image } from "./index";

describe("Image", () => {
    it("exposes meaningful alt text for informative images", () => {
        render(
            <Image
                alt="Coffee and cookies"
                src="/coffee-n-cookies.webp"
            />
        );

        const image = screen.getByRole("img", { name: "Coffee and cookies" });
        expect(image.tagName).toBe("IMG");
        expect(image).toHaveAttribute("alt", "Coffee and cookies");
        expect(image).toHaveAttribute("src", "/coffee-n-cookies.webp");
    });

    it("skips decorative images with empty alt", () => {
        render(
            <Image
                alt=""
                data-testid="decorative"
                src="/decor.webp"
            />
        );

        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        expect(screen.getByTestId("decorative")).toHaveAttribute("alt", "");
    });

    it("hides the blur shadow clone from AT", () => {
        const { container } = render(
            <Image
                alt="Outdoor cat"
                blurShadow
                src="/outdoor-cat.webp"
            />
        );

        const images = container.querySelectorAll("img");
        expect(images.length).toBe(2);
        expect(images[0]).toHaveAttribute("alt", "Outdoor cat");
        expect(images[1]).toHaveAttribute("aria-hidden", "true");
    });

    it("forwards remaining props to the image element", () => {
        render(
            <Image
                alt="Product"
                className="custom-image"
                data-testid="image"
                loading="lazy"
                src="/product.webp"
            />
        );

        const image = screen.getByTestId("image");
        expect(image).toHaveClass("custom-image");
        expect(image).toHaveAttribute("loading", "lazy");
    });
});
