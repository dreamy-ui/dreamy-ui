"use client";

import {
    type IToast,
    type Position,
    ToastContext,
    type ToastWithRender,
    type ToastWithoutRender,
    useReducedMotion
} from "@dreamy-ui/react";
import {
    type ToastType,
    type Toaster,
    ToastRegion as UiSdkToastRegion,
    createToaster
} from "@ui-sdk/react/toast";
import {
    type PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Toast } from "../toast";

export interface ToastProviderProps extends PropsWithChildren {
    /**
     * Default props applied to every toast created via `useToast().toast()`.
     */
    defaultToastProps?: Partial<IToast>;
    /**
     * Maximum visible toasts per position region.
     */
    maxVisible?: number;
}

const emptyObject: Partial<IToast> = {};

const POSITION_CONFIG = [
    { position: "top-left", side: "top", align: "start" },
    { position: "top", side: "top", align: "center" },
    { position: "top-right", side: "top", align: "end" },
    { position: "bottom-left", side: "bottom", align: "start" },
    { position: "bottom", side: "bottom", align: "center" },
    { position: "bottom-right", side: "bottom", align: "end" }
] as const;

type ToasterMap = Record<Position, Toaster<string>>;

interface ToastMotionControl {
    registerElement: (id: string, el: HTMLElement | null) => void;
    armExitGate: (id: string) => void;
    finishExitGate: (id: string) => void;
    reduceMotion: boolean;
}

const ToasterMapContext = createContext<{
    toasters: ToasterMap;
    motionControl: ToastMotionControl;
} | null>(null);

function createToasterMap(): ToasterMap {
    return {
        "top-left": createToaster<string>(),
        top: createToaster<string>(),
        "top-right": createToaster<string>(),
        "bottom-left": createToaster<string>(),
        bottom: createToaster<string>(),
        "bottom-right": createToaster<string>()
    };
}

function mapStatusToType(status: IToast["status"]): ToastType {
    switch (status) {
        case "success":
        case "error":
        case "warning":
        case "info":
        case "loading":
            return status;
        default:
            return "default";
    }
}

/**
 * ToastProvider component — hosts UI SDK toast queues and renders regions by position.
 *
 * @see Docs https://dreamy-ui.com/docs/components/toast
 */
export function ToastProvider({
    children,
    defaultToastProps = emptyObject,
    maxVisible
}: ToastProviderProps) {
    const [toasters] = useState<ToasterMap>(createToasterMap);
    const [toasts, setToasts] = useState<IToast[]>([]);
    const toastsByIdRef = useRef<Map<string, IToast>>(new Map());
    const toastElementsRef = useRef<Map<string, HTMLElement>>(new Map());
    const toastExitGatesRef = useRef<Map<string, Animation>>(new Map());
    const reduceMotion = useReducedMotion() ?? false;

    const registerElement = useCallback((id: string, el: HTMLElement | null) => {
        if (el) {
            toastElementsRef.current.set(id, el);
            return;
        }
        toastElementsRef.current.delete(id);
        const gate = toastExitGatesRef.current.get(id);
        if (gate) {
            try {
                gate.cancel();
            } catch {
                // ignore
            }
            toastExitGatesRef.current.delete(id);
        }
    }, []);

    const armExitGate = useCallback(
        (id: string) => {
            if (reduceMotion) return;
            const el = toastElementsRef.current.get(id);
            if (!el?.isConnected || typeof el.animate !== "function") return;
            const existing = toastExitGatesRef.current.get(id);
            if (existing) {
                try {
                    existing.cancel();
                } catch {
                    // ignore
                }
            }
            toastExitGatesRef.current.set(id, el.animate([], { duration: 600 }));
        },
        [reduceMotion]
    );

    const finishExitGate = useCallback((id: string) => {
        const gate = toastExitGatesRef.current.get(id);
        if (gate) {
            try {
                gate.finish();
            } catch {
                // ignore
            }
            toastExitGatesRef.current.delete(id);
        }
    }, []);

    const motionControl = useMemo<ToastMotionControl>(
        () => ({
            registerElement,
            armExitGate,
            finishExitGate,
            reduceMotion
        }),
        [armExitGate, finishExitGate, reduceMotion, registerElement]
    );

    useEffect(() => {
        return () => {
            for (const { position } of POSITION_CONFIG) {
                toasters[position].dismiss();
            }
            for (const gate of toastExitGatesRef.current.values()) {
                try {
                    gate.cancel();
                } catch {
                    // ignore
                }
            }
            toastExitGatesRef.current.clear();
        };
    }, [toasters]);

    const removeToast = useCallback(
        (id: string) => {
            const existing = toastsByIdRef.current.get(id);
            toastsByIdRef.current.delete(id);
            setToasts((prev) => prev.filter((item) => item.id !== id));
            if (existing) {
                toasters[existing.position].dismiss(id);
            } else {
                for (const { position } of POSITION_CONFIG) {
                    toasters[position].dismiss(id);
                }
            }
        },
        [toasters]
    );

    const pauseToast = useCallback((_id: string) => {
        // UI SDK ToastRegion automatically pauses timers on hover, focus, and blur.
    }, []);

    const resumeToast = useCallback((_id: string) => {
        // UI SDK ToastRegion automatically resumes timers when pointer/focus leaves.
    }, []);

    const toast = useCallback(
        (input: Omit<Partial<IToast>, "id">) => {
            const status = input.status ?? defaultToastProps.status ?? "info";
            const position = input.position ?? defaultToastProps.position ?? "bottom-right";
            const duration =
                input.duration ??
                defaultToastProps.duration ??
                (status === "loading" ? Number.POSITIVE_INFINITY : 5000);
            const isClosable = input.isClosable ?? defaultToastProps.isClosable ?? false;
            const rightContent = input.rightContent ?? defaultToastProps.rightContent;
            const resolvedRender = (input.render ?? defaultToastProps.render) as
                | ((toast: ToastWithoutRender) => React.ReactNode)
                | undefined;

            const id = crypto.randomUUID();
            const base = {
                ...input,
                id,
                status,
                position,
                duration,
                isClosable,
                rightContent
            };

            const nextToast: IToast =
                typeof resolvedRender === "function"
                    ? ({
                          ...(base as Omit<ToastWithRender, "render">),
                          render: resolvedRender
                      } as ToastWithRender)
                    : ({
                          ...(base as Omit<ToastWithoutRender, "render">),
                          render: undefined
                      } as ToastWithoutRender);

            toastsByIdRef.current.set(id, nextToast);
            setToasts((prev) => [...prev, nextToast]);

            toasters[position]({
                id,
                title: nextToast.title ?? "",
                description: nextToast.description,
                type: mapStatusToType(status),
                duration,
                priority: status === "error" ? "assertive" : "polite",
                dismissible: true,
                data: nextToast,
                onDismiss: () => {
                    armExitGate(id);
                    toastsByIdRef.current.delete(id);
                    setToasts((prev) => prev.filter((item) => item.id !== id));
                }
            });

            return id;
        },
        [armExitGate, defaultToastProps, toasters]
    );

    const updateToast = useCallback(
        (id: string, patch: Partial<IToast>) => {
            const current = toastsByIdRef.current.get(id);
            if (!current) return;

            const nextToast = { ...current, ...patch } as IToast;
            toastsByIdRef.current.set(id, nextToast);
            setToasts((prev) => prev.map((item) => (item.id === id ? nextToast : item)));

            toasters[current.position].update(id, {
                title: nextToast.title ?? "",
                description: nextToast.description,
                type: mapStatusToType(nextToast.status),
                duration: nextToast.duration,
                priority: nextToast.status === "error" ? "assertive" : "polite",
                data: nextToast
            });
        },
        [toasters]
    );

    const contextValue = useMemo(
        () => ({
            toast,
            updateToast,
            removeToast,
            pauseToast,
            resumeToast,
            toasts
        }),
        [pauseToast, removeToast, resumeToast, toast, toasts, updateToast]
    );

    const providerValue = useMemo(
        () => ({ toasters, motionControl }),
        [motionControl, toasters]
    );

    return (
        <ToasterMapContext.Provider value={providerValue}>
            <ToastContext.Provider value={contextValue}>
                {children}
                <ToastManager maxVisible={maxVisible} />
            </ToastContext.Provider>
        </ToasterMapContext.Provider>
    );
}

/**
 * ToastManager — renders UI SDK `ToastRegion` instances for each screen position.
 *
 * @internal Prefer using `ToastProvider`, which mounts this for you.
 */
export function ToastManager({ maxVisible }: { maxVisible?: number }) {
    const ctx = useContext(ToasterMapContext);
    if (!ctx) return null;
    const { toasters, motionControl } = ctx;

    return (
        <>
            {POSITION_CONFIG.map(({ position, side, align }) => (
                <UiSdkToastRegion
                    align={align}
                    expanded
                    key={position}
                    maxVisible={maxVisible}
                    side={side}
                    style={{
                        position: "fixed",
                        top: side === "top" ? 0 : undefined,
                        bottom: side === "bottom" ? 0 : undefined,
                        left: align === "start" || align === "center" ? 0 : undefined,
                        right: align === "end" || align === "center" ? 0 : undefined,
                        display: "flex",
                        flexDirection: "column",
                        alignItems:
                            align === "center"
                                ? "center"
                                : align === "start"
                                  ? "flex-start"
                                  : "flex-end",
                        gap: "8px",
                        padding: "1rem",
                        zIndex: "var(--z-index-toast)",
                        pointerEvents: "none"
                    }}
                    toaster={toasters[position]}
                >
                    {(item, toastState) => {
                        const data = item.data as IToast | undefined;
                        if (!data) return null;
                        return (
                            <Toast
                                leaving={toastState.leaving}
                                onExitAnimationComplete={motionControl.finishExitGate}
                                reduceMotion={motionControl.reduceMotion}
                                registerElement={motionControl.registerElement}
                                toast={data}
                            />
                        );
                    }}
                </UiSdkToastRegion>
            ))}
        </>
    );
}
