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

        expect(thumb).toHaveAttribute("aria-valuenow", "40");
        expect(thumb).toHaveAttribute("aria-valuemin", "0");
        expect(thumb).toHaveAttribute("aria-valuemax", "100");
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
        const onChangeValue = vi.fn();

        render(
            <Slider.Root
                aria-label="Volume"
                defaultValue={50}
                max={100}
                min={0}
                onChangeValue={onChangeValue}
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
        expect(thumb).toHaveAttribute("aria-valuenow", "51");
        expect(onChangeValue).toHaveBeenLastCalledWith(51);

        await user.keyboard("{ArrowLeft}");
        expect(thumb).toHaveAttribute("aria-valuenow", "50");

        await user.keyboard("{Home}");
        expect(thumb).toHaveAttribute("aria-valuenow", "0");

        await user.keyboard("{End}");
        expect(thumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("does not change value when disabled", async () => {
        const user = userEvent.setup();
        const onChangeValue = vi.fn();

        render(
            <Slider.Root
                aria-label="Volume"
                defaultValue={30}
                isDisabled
                onChangeValue={onChangeValue}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider.Root>
        );

        const thumb = screen.getByRole("slider", { name: "Volume" });

        expect(thumb).toHaveAttribute("aria-disabled", "true");
        thumb.focus();
        await user.keyboard("{ArrowRight}");
        expect(onChangeValue).not.toHaveBeenCalled();
        expect(thumb).toHaveAttribute("aria-valuenow", "30");
    });

    it("reflects read-only and invalid states", () => {
        render(
            <Field.Root isInvalid>
                <Field.Label>Volume</Field.Label>
                <Slider.Root
                    defaultValue={10}
                    isInvalid
                    isReadOnly
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
        expect(thumb).toHaveAttribute("data-invalid");
        expect(screen.getByText("Pick a louder volume.")).toBeVisible();
    });
});
