"use client";

import {
    type IToast,
    type Position,
    ToastContext,
    type ToastContextType,
    type ToastWithRender,
    type ToastWithoutRender,
    useToast
} from "@dreamy-ui/react";
import { AnimatePresence, m } from "motion/react";
import {
    Fragment,
    type PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState
} from "react";
import type { MotionBoxProps } from "./motion";
import { Toast } from "./toast";

export interface ToastProviderProps extends PropsWithChildren {
    defaultToastProps?: Partial<IToast>;
}

const emptyObject: Partial<IToast> = {};

export function ToastProvider({ children, defaultToastProps = emptyObject }: ToastProviderProps) {
    const [toasts, setToasts] = useState<IToast[]>([]);
    const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const remainingTimeRef = useRef<Map<string, number>>(new Map());
    const pauseTimeRef = useRef<Map<string, number>>(new Map());

    const removeToast = useCallback((id: string) => {
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(id);
        }
        remainingTimeRef.current.delete(id);
        pauseTimeRef.current.delete(id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const pauseToast = useCallback((id: string) => {
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(id);

            // Calculate remaining time
            const pauseTime = Date.now();
            const startTime = pauseTimeRef.current.get(id) || pauseTime;
            const elapsed = pauseTime - startTime;
            const currentRemaining = remainingTimeRef.current.get(id) || 0;
            const newRemaining = Math.max(0, currentRemaining - elapsed);

            remainingTimeRef.current.set(id, newRemaining);
        }
    }, []);

    const resumeToast = useCallback(
        (id: string) => {
            const remainingTime = remainingTimeRef.current.get(id);
            if (remainingTime && remainingTime > 0) {
                pauseTimeRef.current.set(id, Date.now());
                const timeout = setTimeout(() => removeToast(id), remainingTime);
                timeoutsRef.current.set(id, timeout);
            }
        },
        [removeToast]
    );

    const toast = useCallback(
        (toast: Omit<Partial<IToast>, "id">) => {
            if (!toast.status) {
                toast.status = defaultToastProps.status || "info";
            }

            if (!toast.position) {
                toast.position = defaultToastProps.position || "bottom-right";
            }

            if (!toast.duration) {
                toast.duration = defaultToastProps.duration || 5000;
            }

            const resolvedRender = (toast.render ?? defaultToastProps.render) as
                | ((toast: ToastWithoutRender) => React.ReactNode)
                | undefined;

            if (!toast.isClosable) {
                toast.isClosable = defaultToastProps.isClosable ?? false;
            }

            if (!toast.rightContent) {
                toast.rightContent = defaultToastProps.rightContent;
            }

            const id = crypto.randomUUID();
            const duration = toast.duration || 5000;

            // Add hover handlers to the toast
            const base = {
                ...toast,
                id,
                onMouseEnter: () => pauseToast(id),
                onMouseLeave: () => resumeToast(id)
            };

            if (typeof resolvedRender === "function") {
                const nextToast: ToastWithRender = {
                    ...(base as Omit<ToastWithRender, "render">),
                    render: resolvedRender
                };
                setToasts((prev) => [...prev, nextToast]);
            } else {
                const { render: _ignored, ...rest } = base as ToastWithoutRender & {
                    render?: undefined;
                };
                const nextToast: ToastWithoutRender = {
                    ...rest,
                    render: undefined
                };
                setToasts((prev) => [...prev, nextToast]);
            }

            if (duration !== Number.POSITIVE_INFINITY) {
                // Store initial timing information
                remainingTimeRef.current.set(id, duration);
                pauseTimeRef.current.set(id, Date.now());

                // Set initial timeout
                const timeout = setTimeout(() => removeToast(id), duration);
                timeoutsRef.current.set(id, timeout);
            }

            return id;
        },
        [defaultToastProps, pauseToast, resumeToast, removeToast]
    );

    const updateToast = useCallback(
        (id: string, toast: Partial<IToast>) => {
            if (toast.duration !== undefined) {
                const existingTimeout = timeoutsRef.current.get(id);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                    timeoutsRef.current.delete(id);
                }

                if (toast.duration !== Number.POSITIVE_INFINITY) {
                    remainingTimeRef.current.set(id, toast.duration);
                    pauseTimeRef.current.set(id, Date.now());
                    const timeout = setTimeout(() => removeToast(id), toast.duration);
                    timeoutsRef.current.set(id, timeout);
                }
            }

            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...(toast as IToast) } : t))
            );
        },
        [removeToast]
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
        [toast, updateToast, removeToast, pauseToast, resumeToast, toasts]
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastManager />
        </ToastContext.Provider>
    );
}

const positions = [
    "top",
    "top-left",
    "top-right",
    "bottom",
    "bottom-left",
    "bottom-right"
] as const;

export function ToastManager() {
    const { toasts } = useToast();

    const groupedToasts = useMemo(
        () =>
            positions.reduce(
                (acc, position) => {
                    acc[position] = toasts.filter((toast) => toast.position === position);
                    return acc;
                },
                {} as Record<Position, IToast[]>
            ),
        [toasts]
    );

    return (
        <>
            {positions.map((position) => (
                <Fragment key={`${position}-toast-container`}>
                    <AnimatePresence>
                        {!!groupedToasts[position].length && (
                            <m.div
                                key={`${position}-toast-container`}
                                style={{
                                    position: "fixed",
                                    top: position.includes("top") ? 0 : undefined,
                                    left:
                                        position.includes("left") ||
                                        ["bottom", "top"].includes(position)
                                            ? 0
                                            : undefined,
                                    right:
                                        position.includes("right") ||
                                        ["bottom", "top"].includes(position)
                                            ? 0
                                            : undefined,
                                    bottom: position.includes("bottom") ? 0 : undefined,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: ["bottom", "top"].includes(position)
                                        ? "center"
                                        : position.includes("left")
                                          ? "flex-start"
                                          : "flex-end",
                                    gap: "8px",
                                    padding: "1rem",
                                    zIndex: "var(--z-index-toast)",
                                    pointerEvents: "none"
                                }}
                            >
                                <AnimatePresence propagate={groupedToasts[position].length <= 1}>
                                    {groupedToasts[position].map((toast) => (
                                        <Toast
                                            key={toast.id}
                                            toast={toast}
                                        />
                                    ))}
                                </AnimatePresence>
                            </m.div>
                        )}
                    </AnimatePresence>
                </Fragment>
            ))}
        </>
    );
}
