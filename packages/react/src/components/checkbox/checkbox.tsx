import { type CheckboxVariantProps, checkbox } from "@dreamy-ui/system/recipes";
import { type ReactElement, cloneElement, forwardRef, useMemo } from "react";
import { dreamy } from "../factory";
import { VisuallyHiddenInput } from "../visually-hidden";
import { CheckboxIcon } from "./checkbox-icon";
import { type UseCheckboxProps, useCheckbox } from "./use-checkbox";

export interface CheckboxProps extends UseCheckboxProps, CheckboxVariantProps {}

const StyledCheckbox = dreamy("div", checkbox);

/**
 * Checkbox component
 *
 * @See Docs https://dreamy-ui.com/docs/components/checkbox
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const {
        children,
        icon = <CheckboxIcon />,
        getRootProps,
        getWrapperProps,
        getInputProps,
        getIconProps,
        getLabelProps
    } = useCheckbox({ ...props, ref });

    const clonedIcon = useMemo(() => {
        return typeof icon === "function"
            ? icon(getIconProps() as any)
            : cloneElement(icon as ReactElement, getIconProps());
    }, [getIconProps, icon]);

    return (
        <StyledCheckbox {...(getRootProps() as any)}>
            <VisuallyHiddenInput {...(getInputProps() as any)} />
            <span {...getWrapperProps()}>{clonedIcon}</span>
            {children && <span {...getLabelProps()}>{children}</span>}
        </StyledCheckbox>
    );
});

Checkbox.displayName = "Checkbox";
