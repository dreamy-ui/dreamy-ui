import { DatePicker } from "@/ui";
import { useState } from "react";

export function ControlledDatePicker() {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <DatePicker.Root
            value={date}
            onChange={setDate}
        >
            <DatePicker.Input />
            <DatePicker.PopoverContent>
                <DatePicker.Calendar />
            </DatePicker.PopoverContent>
        </DatePicker.Root>
    );
}

export function DatePickerWithFooter() {
    const [date, setDate] = useState<Date | null>(null);

    function handleApply() {
        console.log("Date applied:", date);
    }

    function handleCancel() {
        console.log("Date selection cancelled");
    }

    return (
        <DatePicker.Root
            value={date}
            onChange={setDate}
            showFooter
            onApply={handleApply}
            onCancel={handleCancel}
        >
            <DatePicker.Input />
            <DatePicker.PopoverContent>
                <DatePicker.Calendar />
                <DatePicker.Footer />
            </DatePicker.PopoverContent>
        </DatePicker.Root>
    );
}
