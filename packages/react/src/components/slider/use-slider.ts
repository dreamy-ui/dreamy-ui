import { useCallbackRef, useUpdateEffect } from "@/hooks";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useLatestRef } from "@/hooks/use-latest-ref";
import { type ReactRef, mergeRefs } from "@/hooks/use-merge-refs";
import { usePanEvent } from "@/hooks/use-pan-event";
import { createContext } from "@/provider/create-context";
import { type PropGetter, type RequiredPropGetter, callAllHandlers } from "@/utils";
import { ariaAttr, dataAttr } from "@/utils/attr";
import { percentToValue, roundValueToStep, valueToPercent } from "@/utils/number";
import {
	type ComponentPropsWithoutRef,
	useCallback,
	useId,
	useMemo,
	useRef,
	useState
} from "react";
import { useFieldContext } from "../field";

interface SliderContext extends Omit<UseSliderReturn, "getRootProps" | "getInputProps"> {}

export const [SliderProvider, useSliderContext] = createContext<SliderContext>({
	name: "SliderContext",
	hookName: "useSliderContext",
	providerName: "<Slider />"
});

export interface UseSliderProps
	extends Omit<ComponentPropsWithoutRef<"div">, "id" | "name" | "onChange"> {
	ref?: ReactRef<HTMLDivElement>;
	/**
	 * The minimum allowed value of the slider. Cannot be greater than max.
	 * @default 0
	 */
	min?: number;
	/**
	 * The maximum allowed value of the slider. Cannot be less than min.
	 * @default 100
	 */
	max?: number;
	/**
	 * The step in which increments/decrements have to be made
	 * @default 1
	 */
	step?: number;
	/**
	 * The value of the slider in controlled mode
	 */
	value?: number;
	/**
	 * The initial value of the slider in uncontrolled mode
	 */
	defaultValue?: number;
	/**
	 * Orientation of the slider
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical";
	/**
	 * If `true`, the value will be incremented or decremented in reverse.
	 */
	isReversed?: boolean;
	/**
	 * The size of the slider thumb in pixels. Used for calculating pointer interactions.
	 * @default 28
	 */
	thumbSize?: number;
	/**
	 * Function called when the user starts selecting a new value (by dragging or clicking)
	 */
	onChangeStart?(value: number): void;
	/**
	 * Function called when the user is done selecting a new value (by dragging or clicking)
	 */
	onChangeEnd?(value: number): void;
	/**
	 * Function called whenever the slider value changes  (by dragging or clicking)
	 */
	onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
	/**
	 * Function called whenever the slider value changes with value only (by dragging or clicking)
	 */
	onChangeValue?(value: number): void;
	/**
	 * The base `id` to use for the slider and its components
	 */
	id?: string;
	/**
	 * The name attribute of the hidden `input` field.
	 * This is particularly useful in forms
	 */
	name?: string;
	/**
	 * If `true`, the slider will be disabled
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * If `true`, the slider will be in `invalid` state
	 * @default false
	 */
	isInvalid?: boolean;
	/**
	 * If `true`, the slider will be in `read-only` state
	 * @default false
	 */
	isReadOnly?: boolean;
	/**
	 * If `false`, the slider handle will not capture focus when value changes.
	 * @default true
	 */
	focusThumbOnChange?: boolean;
	/**
	 * The static string to use used for `aria-valuetext`
	 */
	"aria-valuetext"?: string;
	/**
	 * The static string to use used for `aria-label`
	 * if no visible label is used.
	 */
	"aria-label"?: string;
	/**
	 * The static string `aria-labelledby` that points to the
	 * ID of the element that serves as label for the slider
	 */
	"aria-labelledby"?: string;
}

export interface SliderActions {
	stepUp(step?: number): void;
	stepDown(step?: number): void;
	reset(): void;
	stepTo(value: number): void;
}

export function useSlider(props: UseSliderProps) {
	const {
		ref,
		id,
		name,
		value: valueProp,
		max = 100,
		min = 0,
		step = 1,
		isDisabled,
		isInvalid,
		isReadOnly,
		isReversed,
		defaultValue,
		orientation = "horizontal",
		onChange,
		onChangeValue,
		onChangeStart: onChangeStartProp,
		onChangeEnd: onChangeEndProp,
		focusThumbOnChange = true,
		thumbSize = 28,
		id: idProp,
		"aria-valuetext": ariaValueText,
		"aria-label": ariaLabel,
		"aria-labelledby": ariaLabelledBy,
		...htmlProps
	} = props;

	const BORDER_SIZE = thumbSize / 2;

	const field = useFieldContext();

	const onChangeStart = useCallbackRef(onChangeStartProp);
	const onChangeEnd = useCallbackRef(onChangeEndProp);

	/**
	 * Enable the slider handle controlled and uncontrolled scenarios
	 */
	const [computedValue, setValue] = useControllableState({
		value: valueProp,
		defaultValue: defaultValue ?? getDefaultValue(min, max),
		onChange: onChangeValue
	});

	const [isDragging, setDragging] = useState(false);
	const [isFocused, setFocused] = useState(false);
	const isInteractive = useMemo(() => !(isDisabled || isReadOnly), [isDisabled, isReadOnly]);

	const clampValue = useCallback(
		(valueToClamp: number) => Math.min(Math.max(valueToClamp, min), max),
		[min, max]
	);

	/**
	 * Constrain the value because it can't be less than min
	 * or greater than max
	 */
	const value = useMemo(() => clampValue(computedValue), [clampValue, computedValue]);
	const reversedValue = useMemo(() => max - value + min, [max, min, value]);
	const trackValue = useMemo(
		() => (isReversed ? reversedValue : value),
		[isReversed, reversedValue, value]
	);
	const thumbPercent = useMemo(
		() => valueToPercent(trackValue, min, max),
		[trackValue, min, max]
	);

	const isVertical = useMemo(() => orientation === "vertical", [orientation]);

	const stateRef = useLatestRef({
		min,
		max,
		step,
		isDisabled,
		value,
		isInteractive,
		isReversed,
		isVertical,
		eventSource: null as "pointer" | "keyboard" | null,
		focusThumbOnChange,
		orientation
	});

	const tenSteps = useMemo(() => (max - min) / 10, [max, min]);
	const oneStep = useMemo(() => step || (max - min) / 100, [max, min, step]);

	const trackRef = useRef<HTMLElement>(null);
	const thumbRef = useRef<HTMLElement>(null);
	const rootRef = useRef<HTMLElement>(null);

	/**
	 * Generate unique ids for component parts
	 */
	const reactId = useId();
	const uuid = useMemo(() => idProp ?? reactId, [idProp, reactId]);
	const [thumbId, trackId] = [`slider-thumb-${uuid}`, `slider-track-${uuid}`];

	const getValueFromPointer = useCallback(
		(event: any) => {
			if (!trackRef.current) return;

			const state = stateRef.current;
			state.eventSource = "pointer";

			const trackRect = trackRef.current.getBoundingClientRect();
			const { clientX, clientY } = event.touches?.[0] ?? event;

			// Adjust diff to ignore the left border (BORDER_SIZE)
			const diff = isVertical
				? trackRect.bottom - clientY - BORDER_SIZE
				: clientX - trackRect.left - BORDER_SIZE;

			// Adjust the total length to ignore both borders (BORDER_SIZE * 2)
			const length = isVertical
				? trackRect.height - BORDER_SIZE * 2
				: trackRect.width - BORDER_SIZE * 2;

			let percent = diff / length;

			if (percent < 0) percent = 0; // Ensure the value stays within valid range
			if (percent > 1) percent = 1;

			if (isReversed) {
				percent = 1 - percent;
			}

			let nextValue = percentToValue(percent, state.min, state.max);

			if (state.step) {
				nextValue = Number.parseFloat(roundValueToStep(nextValue, state.min, state.step));
			}

			nextValue = clampValue(nextValue);

			return nextValue;
		},
		[isVertical, isReversed, stateRef, clampValue, BORDER_SIZE]
	);

	const constrain = useCallback(
		(value: number) => {
			const state = stateRef.current;
			if (!state.isInteractive) return;
			value = Number.parseFloat(roundValueToStep(value, state.min, oneStep));
			value = clampValue(value);
			setValue(value);
		},
		[oneStep, setValue, stateRef, clampValue]
	);

	const actions: SliderActions = useMemo(
		() => ({
			stepUp(step = oneStep) {
				const next = isReversed ? value - step : value + step;
				constrain(next);
			},
			stepDown(step = oneStep) {
				const next = isReversed ? value + step : value - step;
				constrain(next);
			},
			reset() {
				constrain(defaultValue || 0);
			},
			stepTo(value: number) {
				constrain(value);
			}
		}),
		[constrain, isReversed, value, oneStep, defaultValue]
	);

	/**
	 * Keyboard interaction to ensure users can operate
	 * the slider using only their keyboard.
	 */
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			const state = stateRef.current;

			const keyMap: Record<string, React.KeyboardEventHandler> = {
				ArrowRight: () => actions.stepUp(),
				ArrowUp: () => actions.stepUp(),
				ArrowLeft: () => actions.stepDown(),
				ArrowDown: () => actions.stepDown(),
				PageUp: () => actions.stepUp(tenSteps),
				PageDown: () => actions.stepDown(tenSteps),
				Home: () => constrain(state.min),
				End: () => constrain(state.max)
			};

			const action = keyMap[event.key];

			if (action) {
				event.preventDefault();
				event.stopPropagation();
				action(event);
				state.eventSource = "keyboard";
			}
		},
		[actions, constrain, tenSteps, stateRef]
	);

	const focusThumb = useCallback(() => {
		const state = stateRef.current;
		if (state.focusThumbOnChange) {
			setTimeout(() => thumbRef.current?.focus());
		}
	}, [stateRef]);

	useUpdateEffect(() => {
		const state = stateRef.current;
		focusThumb();
		if (state.eventSource === "keyboard") {
			onChangeEnd?.(state.value);
		}
	}, [value, onChangeEnd]);

	const setValueFromPointer = useCallback(
		(event: MouseEvent | TouchEvent | PointerEvent) => {
			const nextValue = getValueFromPointer(event);
			if (nextValue != null && nextValue !== stateRef.current.value) {
				setValue(nextValue);
			}
		},
		[getValueFromPointer, setValue, stateRef]
	);

	usePanEvent(rootRef, {
		onPanSessionStart(event) {
			const state = stateRef.current;
			if (!state.isInteractive) return;
			setDragging(true);
			focusThumb();
			setValueFromPointer(event);
			onChangeStart?.(state.value);
		},
		onPanSessionEnd() {
			const state = stateRef.current;
			if (!state.isInteractive) return;
			setDragging(false);
			onChangeEnd?.(state.value);
		},
		onPan(event) {
			const state = stateRef.current;
			if (!state.isInteractive) return;
			setValueFromPointer(event);
		}
	});

	const getRootProps: PropGetter = useCallback(
		(props = {}, ref = null) => {
			return {
				...props,
				...htmlProps,
				draggable: false,
				ref: mergeRefs(ref, rootRef),
				tabIndex: -1,
				"aria-disabled": ariaAttr(isDisabled),
				"data-focused": dataAttr(isFocused),
				"data-orientation": orientation,
				"data-reversed": dataAttr(isReversed)
			};
		},
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		[htmlProps, isDisabled, isFocused, orientation, isReversed]
	);

	const getTrackProps: PropGetter = useCallback(
		(props = {}, ref = null) => {
			return {
				...props,
				ref: mergeRefs(ref, trackRef),
				draggable: false,
				id: trackId,
				"data-disabled": dataAttr(isDisabled)
			};
		},
		[isDisabled, trackId]
	);

	const getInnerTrackProps: PropGetter = useCallback(
		(props = {}, ref = null) => {
			return {
				...props,
				draggable: false,
				style: {
					...props.style,
					...orient({
						orientation,
						vertical: {
							height: isReversed ? `${100 - thumbPercent}%` : `${thumbPercent}%`,
							transform: isReversed ? "scaleY(-1)" : undefined
						},
						horizontal: {
							width: isReversed ? `${100 - thumbPercent}%` : `${thumbPercent}%`,
							transform: isReversed ? "scaleX(-1)" : undefined
						}
					})
				},
				ref
			};
		},
		[thumbPercent, orientation, isReversed]
	);

	const getThumbProps: PropGetter = useCallback(
		(props = {}, ref = null) => {
			return {
				...props,
				ref: mergeRefs(ref, thumbRef),
				role: "slider",
				tabIndex: isInteractive ? 0 : undefined,
				id: thumbId,
				draggable: false,
				"data-active": dataAttr(isDragging),
				"aria-valuetext": ariaValueText,
				"aria-valuemin": min,
				"aria-valuemax": max,
				"aria-valuenow": value,
				"aria-orientation": orientation,
				"aria-disabled": ariaAttr(isDisabled),
				"aria-readonly": ariaAttr(isReadOnly),
				"aria-label": ariaLabel,
				"aria-labelledby": field ? field.labelId : ariaLabel ? undefined : ariaLabelledBy,
				"data-invalid": dataAttr(isInvalid),
				style: {
					...props.style,
					...orient({
						orientation,
						vertical: {
							bottom: `${thumbPercent}%`
						},
						horizontal: {
							left: `${thumbPercent}%`
						}
					})
				},
				onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
				onFocus: callAllHandlers(props.onFocus, () => setFocused(true)),
				onBlur: callAllHandlers(props.onBlur, () => setFocused(false))
			};
		},
		[
			isInteractive,
			thumbId,
			isDragging,
			ariaValueText,
			min,
			field,
			max,
			value,
			orientation,
			isDisabled,
			isReadOnly,
			isInvalid,
			ariaLabel,
			ariaLabelledBy,
			onKeyDown,
			thumbPercent
		]
	);

	const getMarkerProps: RequiredPropGetter<{ value: number }> = useCallback(
		(props, ref = null) => {
			const isInRange = !(props.value < min || props.value > max);
			const isHighlighted = value >= props.value;
			const markerPercent = valueToPercent(props.value, min, max);

			const markerStyle: React.CSSProperties = {
				position: "absolute",
				...orient({
					orientation,
					vertical: {
						right: -48,
						bottom: isReversed ? `${100 - markerPercent}%` : `${markerPercent}%`
					},
					horizontal: {
						bottom: -32,
						left: isReversed ? `${100 - markerPercent}%` : `${markerPercent}%`
					}
				})
			};

			return {
				...props,
				ref,
				role: "presentation",
				"aria-hidden": true,
				"data-disabled": dataAttr(isDisabled),
				"data-invalid": dataAttr(!isInRange),
				"data-highlighted": dataAttr(isHighlighted),
				style: {
					...props.style,
					...markerStyle
				}
			};
		},
		[min, max, value, orientation, isReversed, isDisabled]
	);

	const getInputProps: PropGetter = useCallback(
		(props = {}, ref = null) => {
			return {
				...props,
				ref,
				value,
				name,
				id,
				hidden: true,
				type: "range",
				"aria-invalid": ariaAttr(isInvalid),
				"data-invalid": dataAttr(isInvalid),
				invalid: isInvalid,
				disabled: isDisabled,
				"data-disabled": dataAttr(isDisabled),
				readOnly: isReadOnly,
				"data-readonly": dataAttr(isReadOnly),
				onChange: callAllHandlers(props.onChange, onChange, (e) => {
					console.log("input on change", e);
					const val = Number.parseFloat(e.target.value);
					setValue(val);
				})
			};
		},
		[value, name, id, isInvalid, isDisabled, isReadOnly, onChange, setValue]
	);

	return {
		value,
		trackValue,
		thumbPercent,
		isDisabled,
		isReadOnly,
		isFocused,
		isDragging,
		isInteractive,
		isVertical,
		actions,
		getRootProps,
		getTrackProps,
		getInnerTrackProps,
		getThumbProps,
		getMarkerProps,
		getInputProps
	};
}

export type UseSliderReturn = ReturnType<typeof useSlider>;

function getDefaultValue(min: number, max: number) {
	return max < min ? min : min + (max - min) / 2;
}

function orient(options: {
	orientation: UseSliderProps["orientation"];
	vertical: React.CSSProperties;
	horizontal: React.CSSProperties;
}) {
	const { orientation, vertical, horizontal } = options;
	return orientation === "vertical" ? vertical : horizontal;
}
