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

interface RangeSliderContext extends Omit<UseRangeSliderReturn, "getRootProps" | "getInputProps"> {}

export const [RangeSliderProvider, useRangeSliderContext] = createContext<RangeSliderContext>({
	name: "RangeSliderContext",
	hookName: "useRangeSliderContext",
	providerName: "<RangeSlider />"
});

export interface UseRangeSliderProps
	extends Omit<
		ComponentPropsWithoutRef<"div">,
		| "id"
		| "name"
		| "onChange"
		| "defaultValue"
		| "aria-label"
		| "aria-valuetext"
		| "aria-labelledby"
	> {
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
	value?: [number, number];
	/**
	 * The initial value of the slider in uncontrolled mode
	 */
	defaultValue?: [number, number];
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
	 * Function called when the user starts selecting a new value (by dragging or clicking)
	 */
	onChangeStart?(value: [number, number]): void;
	/**
	 * Function called when the user is done selecting a new value (by dragging or clicking)
	 */
	onChangeEnd?(value: [number, number]): void;
	/**
	 * Function called whenever the slider value changes  (by dragging or clicking)
	 */
	onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
	/**
	 * Function called whenever the slider value changes with value only (by dragging or clicking)
	 */
	onChangeValue?(value: [number, number]): void;
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
	 * The size of the slider thumb in pixels. Used for calculating pointer interactions.
	 * @default 28
	 */
	thumbSize?: number;
	/**
	 * The static string to use used for `aria-valuetext`
	 */
	"aria-valuetext"?: [string, string];
	/**
	 * The static string to use used for `aria-label`
	 * if no visible label is used.
	 */
	"aria-label"?: [string, string];
	/**
	 * The static string `aria-labelledby` that points to the
	 * ID of the element that serves as label for the slider
	 */
	"aria-labelledby"?: [string, string];
}

export interface RangeSliderActions {
	stepUp(thumb: 0 | 1, step?: number): void;
	stepDown(thumb: 0 | 1, step?: number): void;
	reset(): void;
	stepTo(thumb: 0 | 1, value: number): void;
}

export interface UseRangeSliderReturn {
	value: [number, number];
	trackValue: [number, number];
	thumbPercent: [number, number];
	rangePercent: number;
	isDisabled: boolean | undefined;
	isReadOnly: boolean | undefined;
	focusedThumb: 0 | 1 | null;
	isDragging: boolean;
	activeThumb: 0 | 1 | null;
	isInteractive: boolean;
	isVertical: boolean;
	actions: RangeSliderActions;
	getRootProps: PropGetter;
	getTrackProps: PropGetter;
	getInnerTrackProps: PropGetter;
	getThumbProps: (thumbIndex: 0 | 1) => PropGetter<React.ComponentPropsWithoutRef<"div">>;
	getMarkerProps: RequiredPropGetter<{ value: number }>;
	getInputProps: (thumbIndex: 0 | 1) => PropGetter<React.ComponentPropsWithoutRef<"input">>;
}

export function useRangeSlider(props: UseRangeSliderProps): UseRangeSliderReturn {
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

	const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);
	const [isDragging, setDragging] = useState(false);
	const [focusedThumb, setFocusedThumb] = useState<0 | 1 | null>(null);
	const [initialDragValue, setInitialDragValue] = useState<number | null>(null);
	const isInteractive = useMemo(() => !(isDisabled || isReadOnly), [isDisabled, isReadOnly]);

	const clampValue = useCallback(
		(valueToClamp: number) => Math.min(Math.max(valueToClamp, min), max),
		[min, max]
	);

	/**
	 * Constrain the value because it can't be less than min
	 * or greater than max
	 */
	const value = useMemo<[number, number]>(
		() => [clampValue(computedValue[0]), clampValue(computedValue[1])],
		[clampValue, computedValue]
	);

	const reversedValue = useMemo<[number, number]>(
		() => [max - value[0] + min, max - value[1] + min],
		[max, min, value]
	);

	const trackValue = useMemo(
		() => (isReversed ? reversedValue : value),
		[isReversed, reversedValue, value]
	);

	const thumbPercent = useMemo<[number, number]>(
		() => [valueToPercent(trackValue[0], min, max), valueToPercent(trackValue[1], min, max)],
		[trackValue, min, max]
	);

	const rangePercent = useMemo(() => Math.abs(thumbPercent[1] - thumbPercent[0]), [thumbPercent]);

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
	const thumbRef = [useRef<HTMLElement>(null), useRef<HTMLElement>(null)];
	const rootRef = useRef<HTMLElement>(null);

	/**
	 * Generate unique ids for component parts
	 */
	const reactId = useId();
	const uuid = useMemo(() => idProp ?? reactId, [idProp, reactId]);
	const [thumbId, trackId] = [
		[`range-slider-thumb-${uuid}-0`, `range-slider-thumb-${uuid}-1`],
		`range-slider-track-${uuid}`
	];

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

			if (percent < 0) percent = 0;
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
		(thumbIndex: 0 | 1, newValue: number) => {
			const state = stateRef.current;
			if (!state.isInteractive) return;

			newValue = Number.parseFloat(roundValueToStep(newValue, state.min, oneStep));
			newValue = clampValue(newValue);

			const newValues: [number, number] = [...state.value];

			// Ensure thumbs don't cross each other
			if (thumbIndex === 0) {
				newValues[0] = Math.min(newValue, state.value[1]);
			} else {
				newValues[1] = Math.max(newValue, state.value[0]);
			}

			setValue(newValues);
		},
		[oneStep, setValue, stateRef, clampValue]
	);

	const actions: RangeSliderActions = useMemo(
		() => ({
			stepUp(thumb: 0 | 1, step = oneStep) {
				const next = isReversed ? value[thumb] - step : value[thumb] + step;
				constrain(thumb, next);
			},
			stepDown(thumb: 0 | 1, step = oneStep) {
				const next = isReversed ? value[thumb] + step : value[thumb] - step;
				constrain(thumb, next);
			},
			reset() {
				setValue(defaultValue || getDefaultValue(min, max));
			},
			stepTo(thumb: 0 | 1, value: number) {
				constrain(thumb, value);
			}
		}),
		[constrain, isReversed, value, oneStep, defaultValue, min, max, setValue]
	);

	/**
	 * Keyboard interaction to ensure users can operate
	 * the slider using only their keyboard.
	 */
	const onKeyDown = useCallback(
		(thumbIndex: 0 | 1) => (event: React.KeyboardEvent) => {
			const state = stateRef.current;

			const keyMap: Record<string, React.KeyboardEventHandler> = {
				ArrowRight: () => actions.stepUp(thumbIndex),
				ArrowUp: () => actions.stepUp(thumbIndex),
				ArrowLeft: () => actions.stepDown(thumbIndex),
				ArrowDown: () => actions.stepDown(thumbIndex),
				PageUp: () => actions.stepUp(thumbIndex, tenSteps),
				PageDown: () => actions.stepDown(thumbIndex, tenSteps),
				Home: () => constrain(thumbIndex, state.min),
				End: () => constrain(thumbIndex, state.max)
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

	const focusThumb = useCallback(
		(thumbIndex: 0 | 1 | null) => {
			const state = stateRef.current;
			if (state.focusThumbOnChange && thumbIndex !== null) {
				setTimeout(() => thumbRef[thumbIndex].current?.focus());
			}
		},
		[stateRef]
	);

	useUpdateEffect(() => {
		const state = stateRef.current;
		if (focusedThumb !== null) {
			focusThumb(focusedThumb);
		}
		if (state.eventSource === "keyboard") {
			onChangeEnd?.(state.value);
		}
	}, [value, onChangeEnd]);

	const setValueFromPointer = useCallback(
		(event: MouseEvent | TouchEvent | PointerEvent) => {
			const nextValue = getValueFromPointer(event);
			if (nextValue == null) return;

			const state = stateRef.current;

			// Determine which thumb to move based on proximity
			let thumbToMove: 0 | 1;
			if (activeThumb !== null) {
				thumbToMove = activeThumb;
			} else {
				// Check if a thumb was directly clicked by checking the event target
				const target = event.target as HTMLElement;
				const clickedThumb0 = thumbRef[0].current?.contains(target);
				const clickedThumb1 = thumbRef[1].current?.contains(target);

				// Check if both thumbs are at the same position
				const thumbsOverlap = Math.abs(state.value[0] - state.value[1]) < 0.01;

				if (thumbsOverlap && (clickedThumb0 || clickedThumb1)) {
					// Both thumbs are at the same position, determine by direction
					// Use initial drag value if available to determine intended direction
					if (initialDragValue !== null) {
						// If moving left/down from initial position, move thumb 0
						// If moving right/up from initial position, move thumb 1
						thumbToMove = nextValue < initialDragValue ? 0 : 1;
					} else {
						// First movement, use current position
						thumbToMove = nextValue <= state.value[0] ? 0 : 1;
					}
				} else if (clickedThumb0 && !clickedThumb1) {
					thumbToMove = 0;
				} else if (clickedThumb1 && !clickedThumb0) {
					thumbToMove = 1;
				} else if (clickedThumb0 && clickedThumb1) {
					// Both contain the target (shouldn't happen often), use proximity
					const dist0 = Math.abs(state.value[0] - nextValue);
					const dist1 = Math.abs(state.value[1] - nextValue);
					thumbToMove = dist0 <= dist1 ? 0 : 1;
				} else {
					// Neither thumb was clicked directly, determine by proximity and direction
					const dist0 = Math.abs(state.value[0] - nextValue);
					const dist1 = Math.abs(state.value[1] - nextValue);

					// If both thumbs are at the same position (or very close),
					// determine which thumb to move based on the direction of movement
					if (Math.abs(dist0 - dist1) < 0.01) {
						// If trying to move left/down, move the lower thumb (0)
						// If trying to move right/up, move the upper thumb (1)
						thumbToMove = nextValue < state.value[0] ? 0 : 1;
					} else {
						// Otherwise, move the closest thumb
						thumbToMove = dist0 < dist1 ? 0 : 1;
					}
				}
			}

			constrain(thumbToMove, nextValue);
			setActiveThumb(thumbToMove);
		},
		[getValueFromPointer, stateRef, activeThumb, constrain, initialDragValue]
	);

	usePanEvent(rootRef, {
		onPanSessionStart(event) {
			const state = stateRef.current;
			if (!state.isInteractive) return;
			setDragging(true);
			const startValue = getValueFromPointer(event);
			setInitialDragValue(startValue ?? null);
			setValueFromPointer(event);
			onChangeStart?.(state.value);
		},
		onPanSessionEnd() {
			const state = stateRef.current;
			if (!state.isInteractive) return;
			setDragging(false);
			setActiveThumb(null);
			setInitialDragValue(null);
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
				"data-focused": dataAttr(focusedThumb !== null),
				"data-orientation": orientation,
				"data-reversed": dataAttr(isReversed)
			};
		},
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		[htmlProps, isDisabled, focusedThumb, orientation, isReversed]
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
			const minPercent = Math.min(thumbPercent[0], thumbPercent[1]);

			return {
				...props,
				draggable: false,
				style: {
					...props.style,
					...orient({
						orientation,
						vertical: {
							height: `${rangePercent}%`,
							bottom: `${minPercent}%`
						},
						horizontal: {
							width: `${rangePercent}%`,
							left: `${minPercent}%`
						}
					})
				},
				ref
			};
		},
		[thumbPercent, rangePercent, orientation]
	);

	const getThumbProps = useCallback(
		(thumbIndex: 0 | 1) =>
			(props: React.ComponentPropsWithoutRef<"div"> = {}, ref?: React.Ref<any>) => {
				return {
					...props,
					ref: mergeRefs(ref, thumbRef[thumbIndex]),
					role: "slider",
					tabIndex: isInteractive ? 0 : undefined,
					id: thumbId[thumbIndex],
					draggable: false,
					"data-active": dataAttr(isDragging && activeThumb === thumbIndex),
					"aria-valuetext": ariaValueText?.[thumbIndex],
					"aria-valuemin": min,
					"aria-valuemax": max,
					"aria-valuenow": value[thumbIndex],
					"aria-orientation": orientation,
					"aria-disabled": ariaAttr(isDisabled),
					"aria-readonly": ariaAttr(isReadOnly),
					"aria-label": ariaLabel?.[thumbIndex],
					"aria-labelledby": field
						? field.labelId
						: ariaLabel
						? undefined
						: ariaLabelledBy?.[thumbIndex],
					"data-invalid": dataAttr(isInvalid),
					style: {
						...props.style,
						...orient({
							orientation,
							vertical: {
								bottom: `${thumbPercent[thumbIndex]}%`
							},
							horizontal: {
								left: `${thumbPercent[thumbIndex]}%`
							}
						}),
						zIndex:
							focusedThumb === thumbIndex
								? 3
								: activeThumb === thumbIndex
								? 2
								: thumbIndex === 0
								? 1
								: 0
					},
					onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown(thumbIndex)),
					onFocus: callAllHandlers(props.onFocus, () => setFocusedThumb(thumbIndex)),
					onBlur: callAllHandlers(props.onBlur, () => setFocusedThumb(null)),
					onPointerDown: callAllHandlers(props.onPointerDown, () => {
						if (isInteractive) {
							setActiveThumb(thumbIndex);
						}
					})
				};
			},
		[
			isInteractive,
			thumbId,
			isDragging,
			activeThumb,
			focusedThumb,
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
			const isHighlighted = props.value >= value[0] && props.value <= value[1];
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

	const getInputProps = useCallback(
		(thumbIndex: 0 | 1) =>
			(props: React.ComponentPropsWithoutRef<"input"> = {}, ref?: React.Ref<any>) => {
				return {
					...props,
					ref,
					value: value[thumbIndex],
					name: name ? `${name}[${thumbIndex}]` : undefined,
					id: id ? `${id}-${thumbIndex}` : undefined,
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
						const val = Number.parseFloat(e.target.value);
						constrain(thumbIndex, val);
					})
				};
			},
		[value, name, id, isInvalid, isDisabled, isReadOnly, onChange, constrain]
	);

	return {
		value,
		trackValue,
		thumbPercent,
		rangePercent,
		isDisabled,
		isReadOnly,
		focusedThumb,
		isDragging,
		activeThumb,
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

function getDefaultValue(min: number, max: number): [number, number] {
	const range = max - min;
	return [min + range * 0.25, min + range * 0.75];
}

function orient(options: {
	orientation: UseRangeSliderProps["orientation"];
	vertical: React.CSSProperties;
	horizontal: React.CSSProperties;
}) {
	const { orientation, vertical, horizontal } = options;
	return orientation === "vertical" ? vertical : horizontal;
}
