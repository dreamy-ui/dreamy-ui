import { PopoverTrigger } from "@/components/popover";
import { SelectIndicator, SelectIndicatorGroup } from "@/components/select/select";
import { useSelectContext } from "@/components/select/select-context";
import type { HTMLDreamProps } from "@/utils/types";
import { styled } from "@dreamy-ui/system/jsx";
import { forwardRef, useMemo } from "react";
import { dream } from "../factory";

export interface SelectTriggerProps extends HTMLDreamProps<"button"> {
    placeholder?: string;
}

const StyledTrigger = styled(dream.button);

/**
 *
 */
export const SelectTriggerBase = forwardRef<HTMLButtonElement, SelectTriggerProps>(
    function SelectTrigger({ children, placeholder, ...rest }, ref) {
        const { getTriggerProps, selectedKeys, descendants } = useSelectContext();

        const selectedNames = useMemo(() => {
            return selectedKeys.map((key) => {
                const item: any = Array.from(descendants.values()).find((node: any) => {
                    console.log("node", node);
                    return node.node.value === key;
                });
                return item?.node.name;
            });
        }, [selectedKeys, descendants]);

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
