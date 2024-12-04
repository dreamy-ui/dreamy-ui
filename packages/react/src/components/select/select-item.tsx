import { dream } from "@/components/factory";
import { SelectItemIndicator } from "@/components/select/select";
import { useSelectContext } from "@/components/select/select-context";
import { type UseSelectItemProps, useSelectItem } from "@/components/select/use-select";
import { styled } from "@dreamy-ui/system/jsx";
import { forwardRef } from "react";

export interface SelectItemProps extends UseSelectItemProps {}

const StyledItem = styled(dream.button);

export const SelectItemBase = forwardRef<HTMLDivElement, SelectItemProps>(
    function SelectItem(props, ref) {
        const { selectedStrategy, selectedKeys } = useSelectContext();
        const itemProps = useSelectItem(props, ref);

        return (
            <StyledItem {...(itemProps as any)}>
                {itemProps.children}

                {(selectedStrategy === "checkmark" || selectedStrategy === "both") &&
                    selectedKeys.includes(itemProps.value) && <SelectItemIndicator />}
            </StyledItem>
        );
    }
);

SelectItemBase.displayName = "SelectItem";
