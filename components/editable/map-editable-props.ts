import type { EditableRootProps as ArkEditableRootProps } from "@ark-ui/react/editable";

export interface DreamyEditableRootProps {
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    onCancel?: (previousValue: string) => void;
    onEdit?: () => void;
    isEditing?: boolean;
    defaultIsEditing?: boolean;
    startWithEditView?: boolean;
    isDisabled?: boolean;
    useDoubleClick?: boolean;
    isPreviewFocusable?: boolean;
    submitOnBlur?: boolean;
    selectAllOnFocus?: boolean;
    placeholder?: string;
    children?: ArkEditableRootProps["children"];
}

const dreamyOnlyKeys = new Set([
    "children",
    "onChange",
    "onSubmit",
    "onCancel",
    "onEdit",
    "isEditing",
    "defaultIsEditing",
    "startWithEditView",
    "isDisabled",
    "useDoubleClick",
    "isPreviewFocusable",
    "submitOnBlur",
    "selectAllOnFocus",
    "variant",
    "className"
]);

export function mapEditableRootProps(
    props: DreamyEditableRootProps & Record<string, unknown>
): {
    arkProps: ArkEditableRootProps;
    children: DreamyEditableRootProps["children"];
} {
    const {
        children,
        defaultValue,
        value,
        onChange,
        onSubmit,
        onCancel,
        onEdit,
        isEditing,
        defaultIsEditing,
        startWithEditView,
        isDisabled,
        useDoubleClick,
        isPreviewFocusable = true,
        submitOnBlur = true,
        selectAllOnFocus = true,
        placeholder,
        ...rest
    } = props;

    const arkRest = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !dreamyOnlyKeys.has(key))
    ) as Omit<ArkEditableRootProps, keyof DreamyEditableRootProps>;

    let committedValue = value ?? defaultValue ?? "";

    let activationMode: ArkEditableRootProps["activationMode"] = "focus";
    if (useDoubleClick) {
        activationMode = "dblclick";
    } else if (isPreviewFocusable === false) {
        activationMode = "none";
    }

    let submitMode: ArkEditableRootProps["submitMode"] = "both";
    if (submitOnBlur === false) {
        submitMode = "enter";
    }

    const defaultEdit = defaultIsEditing ?? startWithEditView;

    const arkProps: ArkEditableRootProps = {
        ...arkRest,
        defaultValue,
        value,
        defaultEdit,
        edit: isEditing,
        disabled: isDisabled,
        activationMode,
        submitMode,
        selectOnFocus: selectAllOnFocus,
        placeholder,
        translations: {
            edit: "Edit",
            submit: "Submit",
            cancel: "Cancel"
        },
        onEditChange: (details) => {
            if (details.edit) {
                committedValue = value ?? committedValue;
                onEdit?.();
            }
        },
        onValueChange: (details) => {
            onChange?.(details.value);
        },
        onValueCommit: (details) => {
            committedValue = details.value;
            onSubmit?.(details.value);
        },
        onValueRevert: () => {
            onCancel?.(committedValue);
        }
    };

    return { arkProps, children };
}
