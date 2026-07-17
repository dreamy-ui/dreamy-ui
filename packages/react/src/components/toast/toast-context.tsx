import type { MotionProps } from "motion/react";
import { createContext, useContext } from "react";

const positions = [
    "top",
    "top-left",
    "top-right",
    "bottom",
    "bottom-left",
    "bottom-right"
] as const;

export type Position = (typeof positions)[number];

export interface ToastContainerProps extends MotionProps {}

interface ToastBase {
    /**
     * Unique toast id. Generated automatically when creating a toast.
     */
    id: string;
    /**
     * Primary toast title text.
     */
    title?: string;
    /**
     * Secondary description shown under the title.
     */
    description?: string;
    /**
     * Visual status of the toast.
     */
    status: "success" | "error" | "info" | "warning" | "loading";
    /**
     * Auto-dismiss duration in milliseconds. Omit or use a large value for persistent toasts.
     */
    duration?: number;
    /**
     * Screen corner / edge where the toast is placed.
     */
    position: Position;
    /**
     * If `true`, a close button is shown on the toast.
     *
     * @default false
     */
    isClosable?: boolean;
    /**
     * Optional content rendered on the right side of the toast.
     */
    rightContent?: React.ReactNode;
    /**
     * Called when the pointer enters the toast (pauses dismissal when applicable).
     */
    onMouseEnter?: () => void;
    /**
     * Called when the pointer leaves the toast (resumes dismissal when applicable).
     */
    onMouseLeave?: () => void;
    /**
     * Motion/container props forwarded to the toast wrapper.
     */
    containerProps?: ToastContainerProps;
}

export interface ToastWithRender extends ToastBase {
    /**
     * Custom render function. Receives the toast data without a `render` field.
     */
    render: (toast: ToastWithoutRender) => React.ReactNode;
}

export interface ToastWithoutRender extends ToastBase {
    render?: undefined;
}

export type IToast = ToastWithRender | ToastWithoutRender;

export interface ToastContextType {
    /**
     * Creates a toast and returns its id.
     */
    toast(toast: Omit<Partial<IToast>, "id">): string;
    /**
     * Updates an existing toast by id.
     */
    updateToast(id: string, toast: Partial<IToast>): void;
    /**
     * Removes a toast by id.
     */
    removeToast(id: string): void;
    /**
     * Pauses auto-dismiss for a toast (e.g. while hovered).
     */
    pauseToast(id: string): void;
    /**
     * Resumes auto-dismiss for a toast.
     */
    resumeToast(id: string): void;
    /**
     * Currently active toasts.
     */
    toasts: IToast[];
}

export const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
}
