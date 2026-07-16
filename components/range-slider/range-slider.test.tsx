import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as RangeSlider from "./index";

describe("RangeSlider", () => {
    it("exposes two distinctly named slider thumbs with aria value attributes", () => {
        render(
            <RangeSlider.Root
                aria-label={["Minimum price", "Maximum price"]}
                defaultValue={[20, 80]}
                max={100}
                min={0}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        const minThumb = screen.getByRole("slider", { name: "Minimum price" });
        const maxThumb = screen.getByRole("slider", { name: "Maximum price" });

        expect(minThumb).toHaveAttribute("aria-valuenow", "20");
        expect(minThumb).toHaveAttribute("aria-valuemin", "0");
        expect(minThumb).toHaveAttribute("aria-valuemax", "100");
        expect(minThumb).toHaveAttribute("aria-orientation", "horizontal");

        expect(maxThumb).toHaveAttribute("aria-valuenow", "80");
        expect(maxThumb).toHaveAttribute("aria-valuemin", "0");
        expect(maxThumb).toHaveAttribute("aria-valuemax", "100");
    });

    it("keeps distinct thumb names when composed inside Field", () => {
        render(
            <Field.Root>
                <Field.Label>Price range</Field.Label>
                <RangeSlider.Root
                    aria-label={["Minimum price", "Maximum price"]}
                    defaultValue={[20, 80]}
                >
                    <RangeSlider.Track>
                        <RangeSlider.FilledTrack />
                    </RangeSlider.Track>
                    <RangeSlider.Thumb index={0} />
                    <RangeSlider.Thumb index={1} />
                </RangeSlider.Root>
            </Field.Root>
        );

        // Group label from Field must not erase per-thumb names (APG multi-thumb)
        expect(screen.getByRole("slider", { name: "Minimum price" })).toBeInTheDocument();
        expect(screen.getByRole("slider", { name: "Maximum price" })).toBeInTheDocument();
    });

    it("supports vertical orientation on both thumbs", () => {
        render(
            <RangeSlider.Root
                aria-label={["Min", "Max"]}
                defaultValue={[10, 90]}
                orientation="vertical"
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        for (const thumb of screen.getAllByRole("slider")) {
            expect(thumb).toHaveAttribute("aria-orientation", "vertical");
        }
    });

    it("tabs between thumbs and adjusts the focused thumb with arrows", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <RangeSlider.Root
                aria-label={["Minimum", "Maximum"]}
                defaultValue={[30, 70]}
                max={100}
                min={0}
                onChangeValue={onChangeValue}
                step={1}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        const minThumb = screen.getByRole("slider", { name: "Minimum" });
        const maxThumb = screen.getByRole("slider", { name: "Maximum" });

        minThumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(minThumb).toHaveAttribute("aria-valuenow", "31");
        expect(onChangeValue).toHaveBeenLastCalledWith([31, 70]);

        await user.tab();
        expect(maxThumb).toHaveFocus();

        await user.keyboard("{ArrowLeft}");
        expect(maxThumb).toHaveAttribute("aria-valuenow", "69");
    });

    it("does not change values when disabled", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <RangeSlider.Root
                aria-label={["Minimum", "Maximum"]}
                defaultValue={[25, 75]}
                isDisabled
                onChangeValue={onChangeValue}
            >
                <RangeSlider.Track>
                    <RangeSlider.FilledTrack />
                </RangeSlider.Track>
                <RangeSlider.Thumb index={0} />
                <RangeSlider.Thumb index={1} />
            </RangeSlider.Root>
        );

        const minThumb = screen.getByRole("slider", { name: "Minimum" });

        expect(minThumb).toHaveAttribute("aria-disabled", "true");
        minThumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(onChangeValue).not.toHaveBeenCalled();
        expect(minThumb).toHaveAttribute("aria-valuenow", "25");
    });
});
