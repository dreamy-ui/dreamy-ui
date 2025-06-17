import { forwardRef, useMemo } from "react";
import { type ProgressVariantProps, progress } from "styled-system/recipes";
import { Box } from "./box";
import { dreamy, HTMLDreamyProps } from "./factory";

interface ProgressFilledTrackProps
	extends HTMLDreamyProps<"div">,
		GetProgressPropsOptions {}

const ProgressFilledTrack = forwardRef<
	HTMLDivElement,
	ProgressFilledTrackProps
>((props, ref) => {
	const { min, max, value, isIndeterminate, role, ...rest } = props;
	const progress = useMemo(
		() => getProgressProps({ value, min, max, isIndeterminate, role }),
		[value, min, max, isIndeterminate, role]
	);

	return (
		<Box
			data-part="filled-track"
			ref={ref}
			{...rest}
			style={{ width: `${progress.percent}%`, ...rest.style }}
			{...progress.bind}
		/>
	);
});

interface ProgressOptions {
	/**
	 * The `value` of the progress indicator.
	 * If `undefined` the progress bar will be in `indeterminate` state
	 */
	value?: number;
	/**
	 * The minimum value of the progress
	 * @default 0
	 */
	min?: number;
	/**
	 * The maximum value of the progress
	 * @default 100
	 */
	max?: number;
	/**
	 * The speed of indeterminate progress
	 * @default 1s
	 */
	speed?: string;
}

export interface ProgressProps
	extends ProgressOptions,
		ProgressVariantProps,
		HTMLDreamyProps<"div"> {
	"aria-label": string;
}

const StyledProgress = dreamy("div", progress);

/**
 * Progress component
 *
 * @See Docs https://dreamy-ui.com/docs/components/progress
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
	(props, ref) => {
		const {
			value,
			min = 0,
			max = 100,
			children,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledBy,
			"aria-valuetext": ariaValueText,
			title,
			role,
			style,
			speed = "1s",
			...rest
		} = props;

		return (
			<StyledProgress
				ref={ref}
				{...rest}
				data-speed={speed}
				style={{
					// @ts-expect-error
					"--speed": speed,
					...style
				}}
			>
				<ProgressFilledTrack
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					aria-valuetext={ariaValueText}
					min={min}
					max={max}
					value={value}
					title={title}
					role={role}
				/>
				{children}
			</StyledProgress>
		);
	}
);

Progress.displayName = "Progress";

function valueToPercent(value: number, min: number, max: number) {
	return ((value - min) * 100) / (max - min);
}

interface GetProgressPropsOptions {
	value?: number;
	min: number;
	max: number;
	valueText?: string;
	getValueText?(value: number, percent: number): string;
	isIndeterminate?: boolean;
	role?: React.AriaRole;
}

function getProgressProps(options: GetProgressPropsOptions) {
	const {
		value = 0,
		min,
		max,
		valueText,
		getValueText,
		isIndeterminate,
		role = "progressbar"
	} = options;

	const percent = valueToPercent(value, min, max);

	const getAriaValueText = () => {
		if (value == null) return undefined;
		return typeof getValueText === "function"
			? getValueText(value, percent)
			: valueText;
	};

	return {
		bind: {
			"data-indeterminate": isIndeterminate ? "" : undefined,
			"aria-valuemax": max,
			"aria-valuemin": min,
			"aria-valuenow": isIndeterminate ? undefined : value,
			"aria-valuetext": getAriaValueText(),
			role
		},
		percent,
		value
	};
}
