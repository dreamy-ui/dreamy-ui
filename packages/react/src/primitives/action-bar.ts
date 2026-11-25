import {
    type ChangeDetails,
    type ChangeOptions,
    type Named,
    type PrimitiveOptions,
    createChange,
    createController,
    definePrimitive,
    isRTL,
    openAttrs
} from "@ui-sdk/core";

export type ActionBarOpenChangeReason = "close-press" | "escape-key" | "imperative";

export interface ActionBarOptions extends PrimitiveOptions {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails<ActionBarOpenChangeReason>) => void;
    closeOnEscape?: boolean;
    loop?: boolean;
    controller?: ActionBarController;
}

interface ActionBarInternalState {
    open: boolean;
    closeOnEscape: boolean;
    loop: boolean;
}

export interface ActionBarPartState {
    open: boolean;
}

export interface ActionBarApi {
    setOpen: (open: boolean, options?: ChangeOptions<ActionBarOpenChangeReason>) => boolean;
    open: (options?: ChangeOptions<ActionBarOpenChangeReason>) => boolean;
    close: (options?: ChangeOptions<ActionBarOpenChangeReason>) => boolean;
    isOpen: () => boolean;
}

export type ActionBarController = ActionBarApi;

function getOperableToolbarItems(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>("button, a[href]")).filter(
        (el) =>
            !("disabled" in el && (el as HTMLButtonElement).disabled) &&
            el.getAttribute("aria-disabled") !== "true"
    );
}

function isElementRTL(el: HTMLElement): boolean {
    if (isRTL(el)) return true;
    const dir = el.closest("[dir]")?.getAttribute("dir") ?? el.ownerDocument?.documentElement?.dir;
    return dir?.toLowerCase() === "rtl";
}

function moveToolbarFocus(container: HTMLElement, event: KeyboardEvent, loop: boolean): boolean {
    const items = getOperableToolbarItems(container);
    if (items.length === 0) return false;

    const rtl = isElementRTL(container);
    const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = rtl ? "ArrowRight" : "ArrowLeft";

    const active =
        document.activeElement instanceof HTMLElement && container.contains(document.activeElement)
            ? document.activeElement
            : null;
    const currentIndex = active ? items.indexOf(active) : -1;

    let nextIndex = -1;
    if (event.key === nextKey) {
        nextIndex =
            currentIndex < 0
                ? 0
                : currentIndex + 1 >= items.length
                  ? loop
                      ? 0
                      : currentIndex
                  : currentIndex + 1;
    } else if (event.key === prevKey) {
        nextIndex =
            currentIndex < 0
                ? items.length - 1
                : currentIndex - 1 < 0
                  ? loop
                      ? items.length - 1
                      : 0
                  : currentIndex - 1;
    } else if (event.key === "Home") {
        nextIndex = 0;
    } else if (event.key === "End") {
        nextIndex = items.length - 1;
    }

    if (nextIndex < 0) return false;

    const target = items[nextIndex];
    if (!target) return false;

    event.preventDefault();
    target.focus();
    return true;
}

const _actionBarPrimitive = definePrimitive({
    name: "action-bar",
    options: {
        open: "boolean",
        defaultOpen: "boolean",
        onOpenChange: "callback",
        closeOnEscape: "boolean",
        loop: "boolean",
        controller: "value"
    },
    controlled: ["open"],
    state: (options: ActionBarOptions): ActionBarInternalState => ({
        open: options.open ?? options.defaultOpen ?? false,
        closeOnEscape: options.closeOnEscape ?? true,
        loop: options.loop ?? true
    }),
    sync: (options): Partial<ActionBarInternalState> => {
        const next: Partial<ActionBarInternalState> = {};
        if (options.open !== undefined) next.open = options.open;
        if (options.closeOnEscape !== undefined) next.closeOnEscape = options.closeOnEscape;
        if (options.loop !== undefined) next.loop = options.loop;
        return next;
    },
    api: (context): ActionBarApi => {
        const change = createChange(context);

        function setOpen(next: boolean, options?: ChangeOptions<ActionBarOpenChangeReason>) {
            if (next === context.store.get().open) {
                return false;
            }
            return change("open", next, {
                reason: options?.reason ?? "imperative",
                event: options?.event
            });
        }

        return {
            setOpen,
            open: (options) => setOpen(true, options),
            close: (options) => setOpen(false, options),
            isOpen: () => context.store.get().open
        };
    },
    slots: (slot) => ({
        root: slot<{}, ActionBarPartState>({
            state: (state) => ({ open: state.open }),
            attrs: (state) => openAttrs(state.open)
        }),
        content: slot<{ loop?: boolean; keepMounted?: boolean }, ActionBarPartState>({
            role: "toolbar",
            keys: ["ArrowLeft", "ArrowRight", "Home", "End", "Escape"],
            props: {
                loop: "boolean",
                keepMounted: "boolean"
            },
            present: (state, { props }) => Boolean(props.keepMounted) || state.open,
            state: (state) => ({ open: state.open }),
            attrs: (state) => ({
                "aria-label": "Action bar",
                "aria-orientation": "horizontal",
                "data-orientation": "horizontal",
                tabindex: "-1",
                ...openAttrs(state.open)
            }),
            on: {
                keydown: (event, { el, props, store, api }) => {
                    const state = store.get();
                    if (event.key === "Escape") {
                        if (!state.closeOnEscape) return;
                        event.preventDefault();
                        api.close({ reason: "escape-key", event });
                        return;
                    }
                    if (!el) return;
                    moveToolbarFocus(el, event, props.loop ?? state.loop);
                }
            },
            bind: (el, part) => {
                const ownerDocument = el.ownerDocument;
                function handleDocumentKeyDown(event: KeyboardEvent) {
                    if (event.defaultPrevented || event.key !== "Escape") return;
                    const state = part.store.get();
                    if (!state.open || !state.closeOnEscape) return;
                    if (el.contains(event.target as Node | null)) return;
                    part.api.close({ reason: "escape-key", event });
                }
                ownerDocument.addEventListener("keydown", handleDocumentKeyDown);
                return () => {
                    ownerDocument.removeEventListener("keydown", handleDocumentKeyDown);
                };
            }
        }),
        "selection-trigger": slot<{}, ActionBarPartState>({
            state: (state) => ({ open: state.open }),
            attrs: (state) => openAttrs(state.open)
        }),
        separator: slot({
            role: "separator",
            attrs: () => ({
                "aria-orientation": "vertical"
            })
        }),
        "close-trigger": slot({
            attrs: () => ({
                type: "button",
                "aria-label": "Close action bar"
            }),
            press: ({ api }, event) => {
                api.close({ reason: "close-press", event });
            }
        })
    }),
    agent: {
        actions: ["open", "close", "setOpen"],
        shown: (state) => state.open
    }
});

export interface ActionBarPrimitive extends Named<typeof _actionBarPrimitive> {}
export const actionBarPrimitive: ActionBarPrimitive = _actionBarPrimitive;

export function createActionBarController(): ActionBarController {
    return createController<ActionBarApi>();
}
