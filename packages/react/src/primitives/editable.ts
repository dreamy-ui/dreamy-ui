import {
    type ChangeDetails,
    type ChangeOptions,
    type Named,
    type PrimitiveOptions,
    createChange,
    createController,
    definePrimitive
} from "@ui-sdk/core";

export type EditableActivationMode = "focus" | "dblclick" | "none";
export type EditableSubmitMode = "enter" | "blur" | "both" | "none";

export type EditableValueChangeReason = "input-change" | "escape-key" | "close-press" | "imperative";
export type EditableEditingChangeReason =
    | "trigger-press"
    | "focus-in"
    | "focus-out"
    | "input-commit"
    | "escape-key"
    | "close-press"
    | "imperative";

export interface EditableFocusTarget {
    current: { focus(): void } | null;
}

export interface EditableOptions extends PrimitiveOptions {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, details: ChangeDetails<EditableValueChangeReason>) => void;
    onValueCommit?: (value: string) => void;
    onValueRevert?: (previousValue: string) => void;
    editing?: boolean;
    defaultEditing?: boolean;
    onEditingChange?: (editing: boolean, details: ChangeDetails<EditableEditingChangeReason>) => void;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    activationMode?: EditableActivationMode;
    submitMode?: EditableSubmitMode;
    selectOnFocus?: boolean;
    placeholder?: string;
    finalFocusRef?: EditableFocusTarget;
    controller?: EditableController;
}

interface EditableInternalState {
    value: string;
    editing: boolean;
    disabled: boolean;
    readOnly: boolean;
    invalid: boolean;
    activationMode: EditableActivationMode;
    submitMode: EditableSubmitMode;
    selectOnFocus: boolean;
    placeholder: string;
}

export interface EditableRootState {
    value: string;
    editing: boolean;
    disabled: boolean;
    readOnly: boolean;
    invalid: boolean;
}

export interface EditablePreviewState {
    value: string;
    editing: boolean;
    empty: boolean;
    placeholder: string;
    disabled: boolean;
    readOnly: boolean;
}

export interface EditableTriggerState {
    editing: boolean;
    disabled: boolean;
}

export interface EditableApi {
    setValue: (value: string, options?: ChangeOptions<EditableValueChangeReason>) => boolean;
    edit: (options?: ChangeOptions<EditableEditingChangeReason>) => boolean;
    submit: (options?: ChangeOptions<EditableEditingChangeReason>) => boolean;
    cancel: (options?: ChangeOptions<EditableEditingChangeReason>) => boolean;
    internal: {
        isFocusRestorationPending: () => boolean;
        clearFocusRestoration: () => void;
        isRestoringFocus: () => boolean;
        runWithRestoringFocus: (run: () => void) => void;
        restoreFocusTarget: () => { focus(options?: FocusOptions): void } | null;
        rootEl: () => HTMLElement | undefined;
    };
}

export type EditableController = Omit<EditableApi, "internal">;

function scheduleFocus(run: () => void, el: HTMLElement) {
    if (!el.hidden && el.isConnected) {
        run();
        return;
    }
    queueMicrotask(() => {
        if (!el.hidden && el.isConnected) {
            run();
            return;
        }
        requestAnimationFrame(() => {
            if (!el.hidden && el.isConnected) {
                run();
            }
        });
    });
}

const _editablePrimitive = definePrimitive({
    name: "editable",
    options: {
        value: "string",
        defaultValue: "string",
        onValueChange: "callback",
        onValueCommit: "callback",
        onValueRevert: "callback",
        editing: "boolean",
        defaultEditing: "boolean",
        onEditingChange: "callback",
        disabled: "boolean",
        readOnly: "boolean",
        invalid: "boolean",
        activationMode: "string",
        submitMode: "string",
        selectOnFocus: "boolean",
        placeholder: "string",
        finalFocusRef: "value",
        controller: "value"
    },
    controlled: ["value", "editing"],
    state: (options: EditableOptions): EditableInternalState => ({
        value: options.value ?? options.defaultValue ?? "",
        editing: options.editing ?? options.defaultEditing ?? false,
        disabled: options.disabled ?? false,
        readOnly: options.readOnly ?? false,
        invalid: options.invalid ?? false,
        activationMode: options.activationMode ?? "focus",
        submitMode: options.submitMode ?? "both",
        selectOnFocus: options.selectOnFocus ?? true,
        placeholder: options.placeholder ?? ""
    }),
    sync: (options): Partial<EditableInternalState> => {
        const next: Partial<EditableInternalState> = {};
        if (options.value !== undefined) next.value = options.value;
        if (options.editing !== undefined) next.editing = options.editing;
        if (options.disabled !== undefined) next.disabled = options.disabled;
        if (options.readOnly !== undefined) next.readOnly = options.readOnly;
        if (options.invalid !== undefined) next.invalid = options.invalid;
        if (options.activationMode !== undefined) next.activationMode = options.activationMode;
        if (options.submitMode !== undefined) next.submitMode = options.submitMode;
        if (options.selectOnFocus !== undefined) next.selectOnFocus = options.selectOnFocus;
        if (options.placeholder !== undefined) next.placeholder = options.placeholder;
        return next;
    },
    api: (context): EditableApi => {
        const change = createChange(context);
        let previousValue = context.store.get().value;
        let restoreFocusPending = false;
        let restoringFocus = false;

        function setValue(next: string, options?: ChangeOptions<EditableValueChangeReason>) {
            if (next === context.store.get().value) {
                return false;
            }
            return change("value", next, {
                reason: options?.reason ?? "imperative",
                event: options?.event
            });
        }

        function edit(options?: ChangeOptions<EditableEditingChangeReason>) {
            const state = context.store.get();
            if (state.disabled || state.readOnly || state.editing) {
                return false;
            }
            previousValue = state.value;
            return change("editing", true, {
                reason: options?.reason ?? "imperative",
                event: options?.event
            });
        }

        function submit(options?: ChangeOptions<EditableEditingChangeReason>) {
            const state = context.store.get();
            if (!state.editing) {
                return false;
            }
            const committed = state.value;
            previousValue = committed;
            restoreFocusPending = true;
            const changed = change("editing", false, {
                reason: options?.reason ?? "imperative",
                event: options?.event
            });
            context.options().onValueCommit?.(committed);
            return changed;
        }

        function cancel(options?: ChangeOptions<EditableEditingChangeReason>) {
            const state = context.store.get();
            if (!state.editing) {
                return false;
            }
            const reverted = previousValue;
            restoreFocusPending = true;
            if (reverted !== state.value) {
                const valueReason: EditableValueChangeReason =
                    options?.reason === "escape-key" ? "escape-key" : "close-press";
                change("value", reverted, {
                    reason: valueReason,
                    event: options?.event
                });
            }
            const changed = change("editing", false, {
                reason: options?.reason ?? "imperative",
                event: options?.event
            });
            context.options().onValueRevert?.(reverted);
            return changed;
        }

        return {
            setValue,
            edit,
            submit,
            cancel,
            internal: {
                isFocusRestorationPending: () => restoreFocusPending,
                clearFocusRestoration: () => {
                    restoreFocusPending = false;
                },
                isRestoringFocus: () => restoringFocus,
                runWithRestoringFocus: (run: () => void) => {
                    restoringFocus = true;
                    try {
                        run();
                    } finally {
                        restoringFocus = false;
                    }
                },
                restoreFocusTarget: () => {
                    const finalRef = context.options().finalFocusRef?.current;
                    if (finalRef) return finalRef;
                    if (context.store.get().activationMode !== "none") {
                        return context.element("preview") ?? null;
                    }
                    return null;
                },
                rootEl: () => context.element("root")
            }
        };
    },
    slots: (slot) => ({
        root: slot<{}, EditableRootState>({
            state: (state) => ({
                value: state.value,
                editing: state.editing,
                disabled: state.disabled,
                readOnly: state.readOnly,
                invalid: state.invalid
            }),
            attrs: (state) => ({
                "data-editable-state": state.editing ? "editing" : "view",
                "data-disabled": state.disabled ? "" : undefined,
                "data-invalid": state.invalid ? "" : undefined
            })
        }),
        preview: slot<{}, EditablePreviewState>({
            state: (state) => ({
                value: state.value,
                editing: state.editing,
                empty: state.value.length === 0,
                placeholder: state.placeholder,
                disabled: state.disabled,
                readOnly: state.readOnly
            }),
            attrs: (state) => {
                const focusable =
                    state.activationMode !== "none" && !state.disabled && !state.readOnly;
                return {
                    "aria-disabled": state.disabled ? "true" : undefined,
                    "data-disabled": state.disabled ? "" : undefined,
                    "data-empty": state.value.length === 0 ? "" : undefined,
                    hidden: state.editing ? "" : undefined,
                    tabindex: focusable ? "0" : undefined
                };
            },
            on: {
                click: (event, { store, api }) => {
                    if (store.get().activationMode === "focus") {
                        api.edit({ reason: "trigger-press", event });
                    }
                },
                dblclick: (event, { store, api }) => {
                    if (store.get().activationMode === "dblclick") {
                        api.edit({ reason: "trigger-press", event });
                    }
                },
                focus: (event, { store, api }) => {
                    if (api.internal.isRestoringFocus()) return;
                    if (store.get().activationMode === "focus") {
                        api.edit({ reason: "focus-in", event });
                    }
                },
                keydown: (event, { store, api }) => {
                    if (
                        (event.key === "Enter" || event.key === " ") &&
                        store.get().activationMode !== "none"
                    ) {
                        event.preventDefault();
                        api.edit({ reason: "trigger-press", event });
                    }
                }
            },
            bind: (el, part) => {
                let wasEditing = part.store.get().editing;
                return part.store.subscribe(() => {
                    const state = part.store.get();
                    const exited = wasEditing && !state.editing;
                    wasEditing = state.editing;
                    if (!exited || !part.api.internal.isFocusRestorationPending()) return;
                    part.api.internal.clearFocusRestoration();
                    const target = part.api.internal.restoreFocusTarget();
                    if (!target) return;
                    if (target === el) {
                        scheduleFocus(
                            () =>
                                part.api.internal.runWithRestoringFocus(() => {
                                    el.focus({ preventScroll: true });
                                }),
                            el
                        );
                    } else {
                        queueMicrotask(() => target.focus());
                    }
                });
            }
        }),
        input: slot<{}, EditableRootState>({
            state: (state) => ({
                value: state.value,
                editing: state.editing,
                disabled: state.disabled,
                readOnly: state.readOnly,
                invalid: state.invalid
            }),
            attrs: (state) => ({
                placeholder: state.placeholder || undefined,
                disabled: state.disabled ? "" : undefined,
                readonly: state.readOnly ? "" : undefined,
                "aria-invalid": state.invalid ? "true" : undefined,
                hidden: state.editing ? undefined : ""
            }),
            on: {
                input: (event, { api }) => {
                    const target = event.target as HTMLInputElement;
                    api.setValue(target.value, { reason: "input-change", event });
                },
                keydown: (event, { store, api }) => {
                    const { submitMode } = store.get();
                    if (event.key === "Enter" && (submitMode === "enter" || submitMode === "both")) {
                        event.preventDefault();
                        api.submit({ reason: "input-commit", event });
                    } else if (event.key === "Escape") {
                        event.preventDefault();
                        api.cancel({ reason: "escape-key", event });
                    }
                },
                focusout: (event, { store, api }) => {
                    const { submitMode } = store.get();
                    if (submitMode !== "blur" && submitMode !== "both") return;
                    const nextFocused = event.relatedTarget as Node | null;
                    const root = api.internal.rootEl();
                    if (nextFocused && root?.contains(nextFocused)) return;
                    api.submit({ reason: "focus-out", event });
                }
            },
            bind: (el, part) => {
                const input = el as HTMLInputElement;
                let wasEditing = part.store.get().editing;

                function syncValue() {
                    const { value } = part.store.get();
                    if (input.value !== value) {
                        input.value = value;
                    }
                }

                function focusInput() {
                    const { selectOnFocus } = part.store.get();
                    scheduleFocus(() => {
                        input.focus({ preventScroll: true });
                        if (selectOnFocus && typeof input.select === "function") {
                            input.select();
                        }
                    }, input);
                }

                syncValue();
                if (wasEditing) {
                    focusInput();
                }

                return part.store.subscribe(() => {
                    const state = part.store.get();
                    syncValue();
                    if (!wasEditing && state.editing) {
                        focusInput();
                    }
                    wasEditing = state.editing;
                });
            }
        }),
        "edit-trigger": slot<{ disabled?: boolean }, EditableTriggerState>({
            props: { disabled: "boolean" },
            state: (state, { props }) => ({
                editing: state.editing,
                disabled: props.disabled ?? (state.disabled || state.readOnly)
            }),
            attrs: (state, { props }) => {
                const disabled = props.disabled ?? (state.disabled || state.readOnly);
                return {
                    type: "button",
                    disabled: disabled ? "" : undefined,
                    hidden: state.editing ? "" : undefined
                };
            },
            press: ({ api, props, store }, event) => {
                const state = store.get();
                if (props.disabled ?? (state.disabled || state.readOnly)) return;
                api.edit({ reason: "trigger-press", event });
            }
        }),
        "submit-trigger": slot<{ disabled?: boolean }, EditableTriggerState>({
            props: { disabled: "boolean" },
            state: (state, { props }) => ({
                editing: state.editing,
                disabled: props.disabled ?? state.disabled
            }),
            attrs: (state, { props }) => {
                const disabled = props.disabled ?? state.disabled;
                return {
                    type: "button",
                    disabled: disabled ? "" : undefined,
                    hidden: state.editing ? undefined : ""
                };
            },
            press: ({ api, props, store }, event) => {
                if (props.disabled ?? store.get().disabled) return;
                api.submit({ reason: "trigger-press", event });
            }
        }),
        "cancel-trigger": slot<{ disabled?: boolean }, EditableTriggerState>({
            props: { disabled: "boolean" },
            state: (state, { props }) => ({
                editing: state.editing,
                disabled: props.disabled ?? state.disabled
            }),
            attrs: (state, { props }) => {
                const disabled = props.disabled ?? state.disabled;
                return {
                    type: "button",
                    disabled: disabled ? "" : undefined,
                    hidden: state.editing ? undefined : ""
                };
            },
            press: ({ api, props, store }, event) => {
                if (props.disabled ?? store.get().disabled) return;
                api.cancel({ reason: "close-press", event });
            }
        })
    }),
    agent: {
        actions: ["setValue", "edit", "submit", "cancel"]
    }
});

export interface EditablePrimitive extends Named<typeof _editablePrimitive> {}
export const editablePrimitive: EditablePrimitive = _editablePrimitive;

export function createEditableController(): EditableController {
    return createController<EditableController>();
}
