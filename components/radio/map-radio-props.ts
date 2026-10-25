import type { RadioGroupRootProps as ArkRadioGroupRootProps } from "@ark-ui/react/radio-group";
import type { RadioGroupItemProps as ArkRadioItemProps } from "@ark-ui/react/radio-group";

export interface DreamyRadioControlProps {
    isChecked?: boolean;
    defaultChecked?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onChangeValue?: (value: string) => void;
}

export function mapRadioItemProps(
    props: DreamyRadioControlProps & Record<string, unknown>
): ArkRadioItemProps {
    const {
        isChecked,
        defaultChecked,
        isDisabled,
        isInvalid,
        isReadOnly,
        isRequired,
        onChange,
        onChangeValue,
        value,
        ...rest
    } = props;

    const dreamyOnlyKeys = new Set([
        "children",
        "scheme",
        "size",
        "variant",
        "className",
        "reduceMotion",
        "isCard",
        "onBlur",
        "onFocus",
        "name",
        "autoFocus",
        "tabIndex"
    ]);

    const arkRest = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !dreamyOnlyKeys.has(key))
    );

    return {
        ...arkRest,
        value: String(value ?? ""),
        checked: isChecked,
        defaultChecked,
        disabled: isDisabled,
        invalid: isInvalid,
        readOnly: isReadOnly,
        required: isRequired,
        onCheckedChange: (details) => {
            if (details.checked && value != null) {
                onChangeValue?.(String(value));
            }
            onChange?.({
                target: { checked: details.checked === true, value }
            } as React.ChangeEvent<HTMLInputElement>);
        }
    } as ArkRadioItemProps;
}

export function mapRadioGroupProps(props: {
    isDisabled?: boolean;
    isInvalid?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    name?: string;
}): ArkRadioGroupRootProps {
    const { isDisabled, isInvalid, isReadOnly, isRequired, value, defaultValue, onChange, name } =
        props;

    return {
        disabled: isDisabled,
        invalid: isInvalid,
        readOnly: isReadOnly,
        required: isRequired,
        value,
        defaultValue,
        name,
        onValueChange: (details) => {
            onChange?.(details.value ?? "");
        }
    };
}
