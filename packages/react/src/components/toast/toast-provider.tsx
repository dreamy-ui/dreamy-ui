import { useDefaultToastProps } from "@/provider/dreamy-provider";
import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState
} from "react";
import type { MotionBoxProps } from "../box";

export interface Toast {
	id: string;
	title?: string;
	description?: string;
	status: "success" | "error" | "info" | "warning" | "loading";
	// variant: "default" | "subtle";
	duration?: number;
	position: Position;
	containerProps?: MotionBoxProps;
	render?: (toast: Toast) => React.ReactNode;
	isClosable?: boolean;
	rightContent?: React.ReactNode;
}

interface ToastContextType {
	toast(toast: Omit<Partial<Toast>, "id">): string;
	updateToast(id: string, toast: Partial<Toast>): void;
	removeToast(id: string): void;
	toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const defaultToastProps = useDefaultToastProps();

	const toast = useCallback(
		(toast: Omit<Partial<Toast>, "id">) => {
			if (!toast.status) {
				toast.status = defaultToastProps.status || "info";
			}

			if (!toast.position) {
				toast.position = defaultToastProps.position || "bottom-right";
			}

			if (!toast.duration) {
				toast.duration = defaultToastProps.duration || 5000;
			}

			if (!toast.render) {
				toast.render = defaultToastProps.render;
			}

			if (!toast.isClosable) {
				toast.isClosable = defaultToastProps.isClosable ?? false;
			}

			if (!toast.rightContent) {
				toast.rightContent = defaultToastProps.rightContent;
			}

			const id = crypto.randomUUID();
			setToasts((prev) => [...prev, { ...(toast as Toast), id }]);
			if (toast.duration !== Number.POSITIVE_INFINITY) {
				setTimeout(() => removeToast(id), toast.duration || 5000);
			}

			return id;
		},
		[defaultToastProps]
	);

	const updateToast = useCallback((id: string, toast: Partial<Toast>) => {
		if (toast.duration !== Number.POSITIVE_INFINITY) {
			setTimeout(() => removeToast(id), toast.duration || 5000);
		}

		setToasts((prev) =>
			prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
		);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const contextValue = useMemo(
		() => ({ toast, updateToast, removeToast, toasts }),
		[toast, updateToast, removeToast, toasts]
	);

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast(): ToastContextType {
	const context = useContext(ToastContext);
	if (!context)
		throw new Error("useToast must be used within a ToastProvider");
	return context;
}

export const positions = [
	"top",
	"top-left",
	"top-right",
	"bottom",
	"bottom-left",
	"bottom-right"
] as const;

export type Position = (typeof positions)[number];
