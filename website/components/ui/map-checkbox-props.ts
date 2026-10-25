import type { CheckboxRootProps as ArkCheckboxRootProps } from "@ark-ui/react/checkbox";
import type { CheckboxCheckedState } from "@ark-ui/react/checkbox";

export interface DreamyCheckboxControlProps {
    isChecked?: boolean;
    defaultChecked?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    isIndeterminate?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onChangeValue?: (value: boolean) => void;
}

export function mapCheckedState(
    isChecked?: boolean,
    isIndeterminate?: boolean
): CheckboxCheckedState | undefined {
    if (isIndeterminate && isChecked !== true) {
        return "indeterminate";
    }
    if (isChecked !== undefined) {
        return isChecked;
    }
    if (isIndeterminate) {
        return "indeterminate";
    }
    return undefined;
}

const dreamyOnlyKeys = new Set([
    "children",
    "icon",
    "reduceMotion",
    "animationTime",
    "pathProps",
    "scheme",
    "size",
    "variant",
    "isCard",
    "className",
    "onBlur",
    "onFocus",
    "name",
    "autoFocus",
    "tabIndex"
]);

export function mapCheckboxRootProps(
    props: DreamyCheckboxControlProps & Record<string, unknown>
): ArkCheckboxRootProps {
    const {
        isChecked,
        defaultChecked,
        isDisabled,
        isInvalid,
        isReadOnly,
        isRequired,
        isIndeterminate,
        onChange,
        onChangeValue,
        ...rest
    } = props;

    const arkRest = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !dreamyOnlyKeys.has(key))
    );

    const checked = mapCheckedState(isChecked, isIndeterminate);

    return {
        ...arkRest,
        checked,
        defaultChecked,
        disabled: isDisabled,
        invalid: isInvalid,
        readOnly: isReadOnly,
        required: isRequired,
        onCheckedChange: (details) => {
            onChangeValue?.(details.checked === true);
            onChange?.({
                target: { checked: details.checked === true }
            } as React.ChangeEvent<HTMLInputElement>);
        }
    } as ArkCheckboxRootProps;
}
