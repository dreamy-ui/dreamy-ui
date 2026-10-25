import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import * as Field from "../field";
import { render } from "../test/render";
import * as DateRangePicker from "./index";

describe("DateRangePicker", () => {
    it("shows the formatted range value and is named by Field.Label", () => {
        render(
            <Field.Root>
                <Field.Label>Stay dates</Field.Label>
                <DateRangePicker.Root
                    defaultValue={{
                        start: new Date(2026, 0, 1),
                        end: new Date(2026, 0, 7)
                    }}
                    popoverProps={{ usePortal: false }}
                >
                    <DateRangePicker.Input />
                    <DateRangePicker.PopoverContent>
                        <DateRangePicker.Calendar />
                    </DateRangePicker.PopoverContent>
                </DateRangePicker.Root>
                <Field.Hint>Select check-in and check-out.</Field.Hint>
            </Field.Root>
        );

        const input = screen.getByPlaceholderText("Select date range");
        expect(input).toHaveValue("Jan 1, 2026 – Jan 7, 2026");
        expect(input).toHaveAccessibleName(/Stay dates/i);
    });

    it("exposes a calendar grid with labelled nav and full-date day names when open", () => {
        render(
            <DateRangePicker.Root
                defaultValue={{
                    start: new Date(2026, 6, 1),
                    end: new Date(2026, 6, 10)
                }}
                popoverProps={{ usePortal: false, open: true }}
            >
                <DateRangePicker.Input />
                <DateRangePicker.PopoverContent>
                    <DateRangePicker.Calendar />
                </DateRangePicker.PopoverContent>
            </DateRangePicker.Root>
        );

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByRole("grid")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next month" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /July 1, 2026/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /July 10, 2026/i })).toBeInTheDocument();
    });

    it("closes on Escape and restores focus to the trigger", async () => {
        const user = userEvent.setup();

        render(
            <DateRangePicker.Root popoverProps={{ usePortal: false }}>
                <DateRangePicker.Input />
                <DateRangePicker.PopoverContent>
                    <DateRangePicker.Calendar />
                </DateRangePicker.PopoverContent>
            </DateRangePicker.Root>
        );

        const input = screen.getByPlaceholderText("Select date range");
        await user.click(input);

        await waitFor(function assertOpen() {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        await user.keyboard("{Escape}");

        await waitFor(function assertClosed() {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
        expect(input).toHaveFocus();
    });

    it("names preset and footer buttons when provided", () => {
        render(
            <DateRangePicker.Root
                popoverProps={{ usePortal: false, open: true }}
                presets={{
                    week: {
                        label: "This week",
                        value: {
                            start: new Date(2026, 0, 1),
                            end: new Date(2026, 0, 7)
                        }
                    }
                }}
                showFooter
            >
                <DateRangePicker.Input />
                <DateRangePicker.PopoverContent>
                    <DateRangePicker.RangePreset />
                    <DateRangePicker.Calendar />
                    <DateRangePicker.Footer />
                </DateRangePicker.PopoverContent>
            </DateRangePicker.Root>
        );

        expect(screen.getByRole("button", { name: "This week" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    });
});
