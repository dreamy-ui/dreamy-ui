import { PopoverTrigger } from "@/components/popover";
import { SelectIndicator, SelectIndicatorGroup } from "@/components/select/select";
import { useSelectContext } from "@/components/select/select-context";
import { useSafeLayoutEffect } from "@/hooks";
import type { HTMLDreamProps } from "@/utils/types";
import { forwardRef, useState } from "react";
import { dreamy } from "../factory";

export interface SelectTriggerProps extends HTMLDreamProps<"button"> {
    placeholder?: string;
}

const StyledTrigger = dreamy.button;

export const SelectTriggerBase = forwardRef<HTMLButtonElement, SelectTriggerProps>(
    function SelectTrigger({ children, placeholder, ...rest }, ref) {
        const { getTriggerProps, selectedKeys, descendants } = useSelectContext();

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
            <PopoverTrigger>
                <StyledTrigger {...(getTriggerProps(rest, ref) as any)}>
                    <span>
                        {selectedNames.length === 1
                            ? selectedNames[0]
                            : selectedNames.length > 1
                              ? `${selectedNames.length} Selected`
                              : placeholder}
                    </span>
                    <SelectIndicatorGroup>
                        <SelectIndicator />
                    </SelectIndicatorGroup>
                </StyledTrigger>
            </PopoverTrigger>
        );
    }
);

SelectTriggerBase.displayName = "SelectTrigger";
