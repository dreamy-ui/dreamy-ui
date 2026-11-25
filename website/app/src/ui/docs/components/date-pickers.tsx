import { DatePicker } from "@/ui";
import { useToast } from "@dreamy-ui/react";
import { useState } from "react";

export function ControlledDatePicker() {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <DatePicker.Root
            onValueChange={setDate}
            value={date}
        >
            <DatePicker.Input />
            <DatePicker.Content>
                <DatePicker.Header />
                <DatePicker.Control />
                <DatePicker.Calendar />
                <DatePicker.Footer />
            </DatePicker.Content>
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
            onValueChange={setDate}
            value={date}
        >
            <DatePicker.Input />
            <DatePicker.Content>
                <DatePicker.Header />
                <DatePicker.Control />
                <DatePicker.Calendar />
                <DatePicker.Footer />
            </DatePicker.Content>
        </DatePicker.Root>
    );
}
