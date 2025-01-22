import { AnimatePresence, m } from "motion/react";
import { Fragment, useMemo } from "react";
import { ToastComponent } from "./toast";
import {
	type Position,
	type Toast,
	positions,
	useToast
} from "./toast-provider";

export function ToastManager() {
	const { toasts } = useToast();

	const groupedToasts = useMemo(
		() =>
			positions.reduce((acc, position) => {
				acc[position] = toasts.filter(
					(toast) => toast.position === position
				);
				return acc;
			}, {} as Record<Position, Toast[]>),
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
									top: position.includes("top")
										? 0
										: undefined,
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
									bottom: position.includes("bottom")
										? 0
										: undefined,
									display: "flex",
									flexDirection: "column",
									alignItems: ["bottom", "top"].includes(
										position
									)
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
								<AnimatePresence
									propagate={
										groupedToasts[position].length <= 1
									}
								>
									{groupedToasts[position].map((toast) => (
										<ToastComponent
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
