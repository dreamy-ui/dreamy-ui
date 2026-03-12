import { DatePicker } from "@/ui";
import { useToast } from "@dreamy-ui/react";
import { useState } from "react";

export function ControlledDatePicker() {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <DatePicker.Root
            onChange={setDate}
            value={date}
        >
            <DatePicker.Input />
            <DatePicker.PopoverContent>
                <DatePicker.Header />
                <DatePicker.Control />
                <DatePicker.Calendar />
                <DatePicker.Footer />
            </DatePicker.PopoverContent>
        </DatePicker.Root>
    );
}

export function DatePickerWithFooter() {
    const [date, setDate] = useState<Date | null>(null);

    const { toast } = useToast();

    function handleApply() {
        toast({
            title: "Date applied",
            description: date ? date.toISOString() : "No date selected",
            status: "success"
        });
    }

    function handleCancel() {
        toast({
            title: "Date selection cancelled",
            status: "info"
        });
    }

    return (
        <DatePicker.Root
            onApply={handleApply}
            onCancel={handleCancel}
            onChange={setDate}
            value={date}
        >
            <DatePicker.Input />
            <DatePicker.PopoverContent>
                <DatePicker.Header />
                <DatePicker.Control />
                <DatePicker.Calendar />
                <DatePicker.Footer />
            </DatePicker.PopoverContent>
        </DatePicker.Root>
    );
}
