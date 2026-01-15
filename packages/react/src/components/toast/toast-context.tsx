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
    id: string;
    title?: string;
    description?: string;
    status: "success" | "error" | "info" | "warning" | "loading";
    duration?: number;
    position: Position;
    isClosable?: boolean;
    rightContent?: React.ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    containerProps?: ToastContainerProps;
}

export interface ToastWithRender extends ToastBase {
    render: (toast: ToastWithoutRender) => React.ReactNode;
}

export interface ToastWithoutRender extends ToastBase {
    render?: undefined;
}

export type IToast = ToastWithRender | ToastWithoutRender;

export interface ToastContextType {
    toast(toast: Omit<Partial<IToast>, "id">): string;
    updateToast(id: string, toast: Partial<IToast>): void;
    removeToast(id: string): void;
    pauseToast(id: string): void;
    resumeToast(id: string): void;
    toasts: IToast[];
}

export const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
}
