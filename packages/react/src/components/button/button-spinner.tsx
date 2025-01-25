import { Box } from "@/components/box/box";
import { Spinner } from "@/components/spinner";
import type { HTMLDreamProps } from "@/utils/types";
import { css, cx } from "@dreamy-ui/system/css";

export interface ButtonSpinnerOptions {
	loadingText?: React.ReactNode;
	spinnerPlacement?: "start" | "end";
}

interface ButtonSpinnerProps
	extends HTMLDreamProps<"div">,
		ButtonSpinnerOptions {}

export function ButtonSpinner(props: ButtonSpinnerProps) {
	const {
		loadingText,
		spinnerPlacement = "start",
		children = (
			<Spinner
				color="currentColor"
				width="1em"
				height="1em"
				size={"sm"}
			/>
		),
		...rest
	} = props;

	return (
		<Box
			{...rest}
			data-part={
				spinnerPlacement === "start"
					? "icon-left"
					: spinnerPlacement === "end"
					? "icon-right"
					: undefined
			}
			className={cx(
				css({
					display: "flex",
					alignItems: "center",
					position: loadingText ? "relative" : "absolute",
					lineHeight: "normal"
				}),
				rest.className
			)}
		>
			{children}
		</Box>
	);
}
ButtonSpinner.displayName = "ButtonSpinner";
