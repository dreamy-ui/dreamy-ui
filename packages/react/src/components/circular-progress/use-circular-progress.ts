import type { ReactRef } from "@/hooks/use-merge-refs";
import type { PropGetter } from "@/utils";
import { dataAttr } from "@/utils/attr";
import { useDOMRef } from "@/utils/dom";
import { objectToDeps } from "@/utils/object";
import { useCallback, useMemo } from "react";

export interface UseCircularProgressProps {
	/**
	 * Ref to the DOM node.
	 */
	ref?: ReactRef<HTMLElement | null> | null;
	/**
	 * Whether to show the value label.
	 * @default false
	 */
	showValueLabel?: boolean;
	/**
	 * The label of the progress circular.
	 */
	label?: string;
	/**
	 * The value label of the progress circular.
	 */
	valueLabel?: string;
	/**
	 * The value of the progress circular.
	 */
	value?: number;
	/**
	 * The minimum value of the progress circular.
	 * @default 0
	 */
	minValue?: number;
	/**
	 * The maximum value of the progress circular.
	 * @default 100
	 */
	maxValue?: number;
	/**
	 * Whether the progress circular is disabled.
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * Whether the progress circular is indeterminate.
	 * @default true
	 */
	isIndeterminate?: boolean;
	/**
	 * The speed of the progress circular.
	 * @default "1.5s"
	 */
	speed?: string;
	/**
	 * The format options of the progress circular.
	 */
	formatOptions?: Intl.NumberFormatOptions;
	id?: string;
}

export function useCircularProgress(props: UseCircularProgressProps) {
	const {
		ref,
		id,
		label,
		speed,
		valueLabel,
		value = undefined,
		minValue = 0,
		maxValue = 100,
		showValueLabel = false,
		formatOptions = {
			style: "percent"
		},
		...rest
	} = props;

	const domRef = useDOMRef(ref);

	// default isIndeterminate to true
	const isIndeterminate = (rest.isIndeterminate ?? true) && value === undefined;

	const percentage = useMemo(() => {
		if (isIndeterminate) {
			return 0.25;
		}

		return value ? clampPercentage((value - minValue) / (maxValue - minValue), 1) : 0;
	}, [value, minValue, maxValue, isIndeterminate]);

	const valueText = useMemo(() => {
		return valueLabel ?? Intl.NumberFormat(undefined, formatOptions).format(percentage);
	}, [percentage, formatOptions, valueLabel]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const getProgressBarProps = useCallback<PropGetter>(
		(props = {}) => ({
			ref: domRef,
			"data-indeterminate": dataAttr(isIndeterminate),
			"data-disabled": dataAttr(rest.isDisabled),
			...props,
			...rest
		}),
		[domRef, isIndeterminate, ...objectToDeps(rest)]
	);

	const getLabelProps = useCallback<PropGetter>(
		(props = {}) => ({
			...props,
			"data-part": "label"
		}),
		[]
	);

	const getSvgProps = useCallback<PropGetter>(
		(props = {}) => ({
			// viewBox: "0 0 32 32",
			fill: "none",
			...props,
			style: {
				width: "var(--size)",
				height: "var(--size)",
				"--radius": "calc(var(--size) / 2 - var(--thickness) / 2)",
				"--speed": speed,
				...props.style
			},
			"data-part": "circle"
		}),
		[speed]
	);

	const getIndicatorProps = useCallback<PropGetter>(
		(props = {}) => ({
			role: "presentation",
			...props,
			style: {
				cx: "calc(var(--size) / 2)",
				cy: "calc(var(--size) / 2)",
				"--percent": percentage,
				"--circumference": "calc(2 * 3.14159 * var(--radius))",
				strokeDashoffset:
					"calc(var(--circumference) - var(--percent) * var(--circumference))",
				strokeDasharray: "var(--circumference) var(--circumference)",
				strokeLinecap: "round",
				r: "var(--radius)",
				rotate: "-90deg",
				transformOrigin: "center",
				strokeWidth: "var(--thickness)",
				...props.style
			},
			"data-part": "circleRange"
		}),
		[percentage]
	);

	const getTrackProps = useCallback<PropGetter>(
		(props = {}) => ({
			role: "presentation",
			...props,
			style: {
				cx: "calc(var(--size) / 2)",
				cy: "calc(var(--size) / 2)",
				r: "var(--radius)",
				strokeWidth: "var(--thickness)",
				...props.style
			},
			"data-part": "circleTrack"
		}),
		[]
	);

	return {
		domRef,
		label,
		showValueLabel,
		valueText,
		getProgressBarProps,
		getLabelProps,
		getSvgProps,
		getIndicatorProps,
		getTrackProps
	};
}

export type UseCircularProgressReturn = ReturnType<typeof useCircularProgress>;

function clampPercentage(percentage: number, max: number) {
	return Math.min(Math.max(percentage, 0), max);
}
