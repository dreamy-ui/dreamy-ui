import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as Slider from "./index";

describe("Slider", () => {
    it("exposes a named slider thumb with aria value attributes inside Field", () => {
        render(
            <Field.Root>
                <Field.Label>Volume</Field.Label>
                <Slider.Root
                    defaultValue={40}
                    max={100}
                    min={0}
                >
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
                <Field.Hint>0–100</Field.Hint>
            </Field.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });

        expect(thumb).toHaveValue("40");
        expect(thumb).toHaveAttribute("min", "0");
        expect(thumb).toHaveAttribute("max", "100");
        expect(thumb).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("supports vertical orientation", () => {
        render(
            <Slider.Root
                aria-label="Height"
                defaultValue={25}
                orientation="vertical"
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        expect(screen.getByRole("slider", { name: "Height" })).toHaveAttribute(
            "aria-orientation",
            "vertical"
        );
    });

    it("adjusts value with arrow keys, Home, and End", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Slider.Root
                aria-label="Volume"
                defaultValue={50}
                max={100}
                min={0}
                onValueChange={onValueChange}
                step={1}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });
        thumb.focus();

        await user.keyboard("{ArrowRight}");
        expect(thumb).toHaveValue("51");
        expect(onValueChange.mock.calls.at(-1)?.[0]).toBe(51);

        await user.keyboard("{ArrowLeft}");
        expect(thumb).toHaveValue("50");

        await user.keyboard("{Home}");
        expect(thumb).toHaveValue("0");

        await user.keyboard("{End}");
        expect(thumb).toHaveValue("100");
    });

    it("does not change value when disabled", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
            <Slider.Root
                aria-label="Volume"
                defaultValue={30}
                disabled
                onValueChange={onValueChange}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });

        expect(thumb).toBeDisabled();
        thumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(onValueChange).not.toHaveBeenCalled();
        expect(thumb).toHaveValue("30");
    });

    it("reflects read-only and invalid states", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Volume</Field.Label>
                <Slider.Root
                    defaultValue={10}
                    isInvalid
                    readOnly
                >
                    <Slider.Track>
                        <Slider.FilledTrack />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Root>
                <Field.Error>Pick a louder volume.</Field.Error>
            </Field.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });

        expect(thumb).toHaveAttribute("aria-readonly", "true");
        expect(thumb.closest('[data-slot="slider-thumb"]')).toHaveAttribute("data-invalid");
        expect(screen.getByText("Pick a louder volume.")).toBeVisible();
    });
});
