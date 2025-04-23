import { PopoverTrigger } from "@/components/popover";
import {
    SelectClearButton,
    SelectIndicator,
    SelectIndicatorGroup
} from "@/components/select/select";
import { useSelectContext } from "@/components/select/select-context";
import { useSafeLayoutEffect } from "@/hooks";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef, useState } from "react";
import { dreamy } from "../factory";

export interface SelectTriggerProps extends HTMLDreamProps<"button"> {
    /**
     * Icon to show in the trigger.
     */
    icon?: React.ReactNode;
    /**
     * Placeholder text to show when no item is selected.
     */
    placeholder?: string;
    /**
     * Text to show when multiple items are selected.
     */
    multipleSelectedText?: (selectedKeys: string[]) => string;
}

const StyledTrigger = dreamy.button;

export const SelectTriggerBase = forwardRef<HTMLButtonElement, SelectTriggerProps>(
    function SelectTrigger(
        {
            children,
            placeholder,
            icon,
            multipleSelectedText = (selectedKeys) => `${selectedKeys.length} Selected`,
            ...rest
        },
        ref
    ) {
        const { getTriggerProps, selectedKeys, descendants, isClearable } = useSelectContext();

        const selectedNames = selectedKeys.map((key) => {
            const item: any = Array.from(descendants.values()).find((node: any) => {
                return node.node.value === key;
            });
            return item?.textValue;
        });

        const [, forceUpdate] = useState({});

        useSafeLayoutEffect(() => {
            forceUpdate({});
        }, []);

        return (
            <>
                <PopoverTrigger>
                    <StyledTrigger {...(getTriggerProps(rest, ref) as any)}>
                        {icon && icon}

                        <span>
                            {selectedNames.length === 1
                                ? selectedNames[0]
                                : selectedNames.length > 1
                                  ? multipleSelectedText(selectedNames)
                                  : placeholder}
                        </span>
                        <SelectIndicatorGroup>
                            {isClearable && selectedKeys.length > 0 && <SelectClearButton />}
                            <SelectIndicator />
                        </SelectIndicatorGroup>
                    </StyledTrigger>
                </PopoverTrigger>
            </>
        );
    }
);

SelectTriggerBase.displayName = "SelectTrigger";
