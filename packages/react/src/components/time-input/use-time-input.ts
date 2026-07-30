import { useControllable, type useControllableProps } from "@/hooks";
import { useControllableState } from "@/hooks/use-controllable-state";
import { type ReactRef, mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider";
import { type PropGetter, callAllHandlers, dataAttr } from "@/utils";
import { ariaAttr } from "@/utils/attr";
import {
    type KeyboardEvent,
    type RefObject,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState
} from "react";
import { type UserFeedbackProps, useFieldProps } from "../field";
import {
    type TimeField,
    type TimePeriod,
    type TimeSegment,
    type TimeValue,
    formatSegmentValue,
    formatTime,
    getDisplayHour,
    getHourOptions,
    getMillisecondOptions,
    getMinuteOptions,
    getPeriod,
    getSecondOptions,
    getSegments,
    normalizeFields,
    parseTime,
    snapMillisecond,
    snapMinute,
    snapSecond,
    to24Hour,
    wrapIndex
} from "./time-utils";

export type { TimeField, TimePeriod, TimeSegment, TimeValue };
export {
    DEFAULT_TIME_FIELDS,
    formatSegmentValue,
    formatTime,
    getDisplayHour,
    getFieldSeparator,
    getPeriod,
    getSegments,
    normalizeFields,
    pad2,
    pad3
} from "./time-utils";

export interface TimeInputContextValue extends Omit<UseTimeInputReturn, "rest"> {}

export const [TimeInputProvider, useTimeInputContext] = createContext<TimeInputContextValue>({
    name: "TimeInputContext",
    hookName: "useTimeInputContext",
    providerName: "TimeInputProvider",
    errorMessage:
        "useTimeInputContext: `context` is undefined. Seems you forgot to wrap your components in `<TimeInput.Root />`"
});

export interface UseTimeInputProps extends UserFeedbackProps, useControllableProps {
    /**
     * Controlled time value. Format depends on `fields`
     * (e.g. `"HH:mm"`, `"HH:mm:ss"`, `"HH:mm:ss.SSS"`, `"mm:ss"`, `"ss.SSS"`).
     */
    value?: string;
    /**
     * Default time value. Format depends on `fields`.
     */
    defaultValue?: string;
    /**
     * Called when the time value changes. Format depends on `fields`.
     */
    onChange?: (value: string) => void;
    /**
     * Called with the native change event from the hidden input.
     */
    onChangeNative?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * Which time fields to show, in any subset of hour / minute / second / millisecond.
     * Order is always normalized to hour → minute → second → millisecond.
     * @default ["hour", "minute"]
     * @example
     * fields={["hour", "minute", "second"]}
     * fields={["second", "millisecond"]}
     */
    fields?: TimeField[];
    /**
     * When `true`, shows a 12-hour clock with an AM/PM segment (only if `hour` is in `fields`).
     * @default false
     */
    hour12?: boolean;
    /**
     * Minute increment step (e.g. `5` for 00, 05, 10, ...).
     * @default 1
     */
    minuteStep?: number;
    /**
     * Second increment step (e.g. `5` for 00, 05, 10, ...).
     * @default 1
     */
    secondStep?: number;
    /**
     * Millisecond increment step (e.g. `100` for 000, 100, 200, ...).
     * @default 1
     */
    millisecondStep?: number;
    /**
     * Name for the hidden form input.
     */
    name?: string;
    /**
     * Placeholder shown when no value is set.
     * @default "Select time"
     */
    placeholder?: string;
    /**
     * Id for the control. Inherits from Field when available.
     */
    id?: string;
    /**
     * Ref to the root control element.
     */
    ref?: ReactRef<HTMLDivElement>;
    /**
     * Whether to open the popover when the control is clicked.
     * @default true
     */
    openOnClick?: boolean;
    /**
     * Z-index for the popover content.
     * @default "var(--z-index-popover)"
     */
    contentZIndex?: string;
}

export interface UseTimeInputReturn {
    id: string;
    value: string;
    time: TimeValue | null;
    fields: TimeField[];
    hour12: boolean;
    minuteStep: number;
    secondStep: number;
    millisecondStep: number;
    minuteOptions: number[];
    secondOptions: number[];
    millisecondOptions: number[];
    hourOptions: number[];
    segments: TimeSegment[];
    focusedSegment: TimeSegment;
    setFocusedSegment: React.Dispatch<React.SetStateAction<TimeSegment>>;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    isDisabled: boolean;
    isInvalid: boolean;
    isRequired: boolean;
    isReadOnly: boolean;
    placeholder: string;
    name?: string;
    contentZIndex: string;
    openOnClick: boolean;
    triggerRef: RefObject<HTMLDivElement | null>;
    hourSegmentRef: RefObject<HTMLSpanElement | null>;
    minuteSegmentRef: RefObject<HTMLSpanElement | null>;
    secondSegmentRef: RefObject<HTMLSpanElement | null>;
    millisecondSegmentRef: RefObject<HTMLSpanElement | null>;
    periodSegmentRef: RefObject<HTMLSpanElement | null>;
    setTime: (next: TimeValue | null) => void;
    setHours: (hours: number) => void;
    setMinutes: (minutes: number) => void;
    setSeconds: (seconds: number) => void;
    setMilliseconds: (milliseconds: number) => void;
    setPeriod: (period: TimePeriod) => void;
    incrementSegment: (segment?: TimeSegment) => void;
    decrementSegment: (segment?: TimeSegment) => void;
    focusSegment: (segment: TimeSegment) => void;
    focusFirstSegment: () => void;
    /** @deprecated Use `focusFirstSegment` instead. */
    focusHour: () => void;
    getRootProps: PropGetter;
    getTriggerProps: PropGetter;
    getSegmentProps: (segment: TimeSegment) => Record<string, unknown>;
    getHiddenInputProps: PropGetter;
    getContentProps: PropGetter;
    rest: Record<string, unknown>;
}

/**
 * Headless logic for the Time Input compound component.
 */
export function useTimeInput(props: UseTimeInputProps = {}): UseTimeInputReturn {
    const {
        value: valueProp,
        defaultValue = "",
        onChange,
        onChangeNative,
        fields: fieldsProp,
        hour12 = false,
        minuteStep = 1,
        secondStep = 1,
        millisecondStep = 1,
        name,
        placeholder = "Select time",
        ref,
        openOnClick = true,
        contentZIndex = "var(--z-index-popover)",
        isOpen: isOpenProp,
        onOpen: onOpenProp,
        onClose: onCloseProp,
        defaultIsOpen,
        ...restProps
    } = props;

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        isReadOnly: isReadOnlyField = false,
        id: fieldId,
        onBlur: onBlurField,
        onFocus: onFocusField,
        "aria-describedby": ariaDescribedByField
    } = useFieldProps(props);

    const isDisabled = props.isDisabled ?? isDisabledField;
    const isRequired = props.isRequired ?? isRequiredField;
    const isInvalid = props.isInvalid ?? isInvalidField;
    const isReadOnly = props.isReadOnly ?? isReadOnlyField;

    const uuid = useId();
    const id = props.id ?? fieldId ?? `time-input-${uuid}`;

    const { isOpen, onOpen, onClose, onToggle } = useControllable({
        isOpen: isOpenProp,
        defaultIsOpen,
        onOpen: onOpenProp,
        onClose: onCloseProp
    });

    const [value, setValue] = useControllableState({
        value: valueProp,
        defaultValue,
        onChange
    });

    const fields = useMemo(
        function resolveFields() {
            return normalizeFields(fieldsProp);
        },
        [fieldsProp]
    );

    const time = useMemo(
        function resolveTime() {
            return parseTime(value, fields);
        },
        [fields, value]
    );

    const segments = useMemo(
        function resolveSegments() {
            return getSegments(fields, hour12);
        },
        [fields, hour12]
    );

    const hourOptions = useMemo(
        function resolveHourOptions() {
            return getHourOptions(hour12);
        },
        [hour12]
    );
    const minuteOptions = useMemo(
        function resolveMinuteOptions() {
            return getMinuteOptions(minuteStep);
        },
        [minuteStep]
    );
    const secondOptions = useMemo(
        function resolveSecondOptions() {
            return getSecondOptions(secondStep);
        },
        [secondStep]
    );
    const millisecondOptions = useMemo(
        function resolveMillisecondOptions() {
            return getMillisecondOptions(millisecondStep);
        },
        [millisecondStep]
    );

    const [focusedSegment, setFocusedSegment] = useState<TimeSegment>(
        function getInitialSegment() {
            return segments[0] ?? "hour";
        }
    );
    const digitBufferRef = useRef("");
    const digitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const triggerRef = useRef<HTMLDivElement>(null);
    const hourSegmentRef = useRef<HTMLSpanElement>(null);
    const minuteSegmentRef = useRef<HTMLSpanElement>(null);
    const secondSegmentRef = useRef<HTMLSpanElement>(null);
    const millisecondSegmentRef = useRef<HTMLSpanElement>(null);
    const periodSegmentRef = useRef<HTMLSpanElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const segmentRefMap = useMemo(
        function buildSegmentRefMap(): Record<TimeSegment, RefObject<HTMLSpanElement | null>> {
            return {
                hour: hourSegmentRef,
                minute: minuteSegmentRef,
                second: secondSegmentRef,
                millisecond: millisecondSegmentRef,
                period: periodSegmentRef
            };
        },
        []
    );

    useEffect(
        function syncFocusedSegment() {
            if (!segments.includes(focusedSegment)) {
                setFocusedSegment(segments[0] ?? "hour");
            }
        },
        [focusedSegment, segments]
    );

    const clearDigitBuffer = useCallback(function clearDigitBuffer() {
        digitBufferRef.current = "";
        if (digitTimeoutRef.current) {
            clearTimeout(digitTimeoutRef.current);
            digitTimeoutRef.current = null;
        }
    }, []);

    useEffect(function cleanupDigitTimeout() {
        return function onUnmount() {
            if (digitTimeoutRef.current) {
                clearTimeout(digitTimeoutRef.current);
            }
        };
    }, []);

    const ensureTime = useCallback(
        function ensureTime(): TimeValue {
            if (time) {
                return {
                    hours: time.hours,
                    minutes: snapMinute(time.minutes, minuteStep),
                    seconds: snapSecond(time.seconds, secondStep),
                    milliseconds: snapMillisecond(time.milliseconds, millisecondStep)
                };
            }

            const now = new Date();
            return {
                hours: now.getHours(),
                minutes: snapMinute(now.getMinutes(), minuteStep),
                seconds: snapSecond(now.getSeconds(), secondStep),
                milliseconds: snapMillisecond(now.getMilliseconds(), millisecondStep)
            };
        },
        [millisecondStep, minuteStep, secondStep, time]
    );

    const commitTime = useCallback(
        function commitTime(next: TimeValue | null) {
            if (isDisabled || isReadOnly) {
                return;
            }

            const nextValue = next ? formatTime(next, fields) : "";
            setValue(nextValue);

            if (hiddenInputRef.current && onChangeNative) {
                hiddenInputRef.current.value = nextValue;
                const event = {
                    target: hiddenInputRef.current,
                    currentTarget: hiddenInputRef.current
                } as React.ChangeEvent<HTMLInputElement>;
                onChangeNative(event);
            }
        },
        [fields, isDisabled, isReadOnly, onChangeNative, setValue]
    );

    const setTime = useCallback(
        function setTime(next: TimeValue | null) {
            if (!next) {
                commitTime(null);
                return;
            }

            commitTime({
                hours: wrapIndex(next.hours, 24),
                minutes: snapMinute(wrapIndex(next.minutes, 60), minuteStep),
                seconds: snapSecond(wrapIndex(next.seconds, 60), secondStep),
                milliseconds: snapMillisecond(wrapIndex(next.milliseconds, 1000), millisecondStep)
            });
        },
        [commitTime, millisecondStep, minuteStep, secondStep]
    );

    const setHours = useCallback(
        function setHours(hours: number) {
            const base = ensureTime();
            setTime({ ...base, hours: wrapIndex(hours, 24) });
        },
        [ensureTime, setTime]
    );

    const setMinutes = useCallback(
        function setMinutes(minutes: number) {
            const base = ensureTime();
            setTime({ ...base, minutes: snapMinute(wrapIndex(minutes, 60), minuteStep) });
        },
        [ensureTime, minuteStep, setTime]
    );

    const setSeconds = useCallback(
        function setSeconds(seconds: number) {
            const base = ensureTime();
            setTime({ ...base, seconds: snapSecond(wrapIndex(seconds, 60), secondStep) });
        },
        [ensureTime, secondStep, setTime]
    );

    const setMilliseconds = useCallback(
        function setMilliseconds(milliseconds: number) {
            const base = ensureTime();
            setTime({
                ...base,
                milliseconds: snapMillisecond(wrapIndex(milliseconds, 1000), millisecondStep)
            });
        },
        [ensureTime, millisecondStep, setTime]
    );

    const setPeriod = useCallback(
        function setPeriod(period: TimePeriod) {
            const base = ensureTime();
            const displayHour = getDisplayHour(base.hours, true);
            setTime({
                ...base,
                hours: to24Hour(displayHour, period, true)
            });
        },
        [ensureTime, setTime]
    );

    const focusSegment = useCallback(
        function focusSegment(segment: TimeSegment) {
            if (!segments.includes(segment)) {
                return;
            }

            clearDigitBuffer();
            setFocusedSegment(segment);

            requestAnimationFrame(function focusNode() {
                segmentRefMap[segment].current?.focus({ preventScroll: true });
            });
        },
        [clearDigitBuffer, segmentRefMap, segments]
    );

    const focusFirstSegment = useCallback(
        function focusFirstSegment() {
            focusSegment(segments[0] ?? "hour");
        },
        [focusSegment, segments]
    );

    const focusHour = focusFirstSegment;

    const focusNextSegment = useCallback(
        function focusNextSegment(from: TimeSegment) {
            const currentIndex = segments.indexOf(from);
            if (currentIndex === -1 || currentIndex >= segments.length - 1) {
                return;
            }
            focusSegment(segments[currentIndex + 1]);
        },
        [focusSegment, segments]
    );

    const moveSegment = useCallback(
        function moveSegment(direction: 1 | -1) {
            const currentIndex = segments.indexOf(focusedSegment);
            const nextIndex = wrapIndex(currentIndex + direction, segments.length);
            focusSegment(segments[nextIndex]);
        },
        [focusSegment, focusedSegment, segments]
    );

    const incrementSegment = useCallback(
        function incrementSegment(segment: TimeSegment = focusedSegment) {
            const base = ensureTime();

            if (segment === "hour") {
                if (hour12) {
                    const display = getDisplayHour(base.hours, true);
                    const currentIndex = hourOptions.indexOf(display);
                    const nextDisplay =
                        hourOptions[wrapIndex(currentIndex + 1, hourOptions.length)];
                    setTime({
                        ...base,
                        hours: to24Hour(nextDisplay, getPeriod(base.hours), true)
                    });
                    return;
                }

                setHours(base.hours + 1);
                return;
            }

            if (segment === "minute") {
                const currentIndex = minuteOptions.indexOf(snapMinute(base.minutes, minuteStep));
                const nextIndex = wrapIndex(currentIndex + 1, minuteOptions.length);
                setMinutes(minuteOptions[nextIndex]);
                return;
            }

            if (segment === "second") {
                const currentIndex = secondOptions.indexOf(snapSecond(base.seconds, secondStep));
                const nextIndex = wrapIndex(currentIndex + 1, secondOptions.length);
                setSeconds(secondOptions[nextIndex]);
                return;
            }

            if (segment === "millisecond") {
                const currentIndex = millisecondOptions.indexOf(
                    snapMillisecond(base.milliseconds, millisecondStep)
                );
                const nextIndex = wrapIndex(currentIndex + 1, millisecondOptions.length);
                setMilliseconds(millisecondOptions[nextIndex]);
                return;
            }

            setPeriod(getPeriod(base.hours) === "am" ? "pm" : "am");
        },
        [
            ensureTime,
            focusedSegment,
            hour12,
            hourOptions,
            millisecondOptions,
            millisecondStep,
            minuteOptions,
            minuteStep,
            secondOptions,
            secondStep,
            setHours,
            setMilliseconds,
            setMinutes,
            setPeriod,
            setSeconds,
            setTime
        ]
    );

    const decrementSegment = useCallback(
        function decrementSegment(segment: TimeSegment = focusedSegment) {
            const base = ensureTime();

            if (segment === "hour") {
                if (hour12) {
                    const display = getDisplayHour(base.hours, true);
                    const currentIndex = hourOptions.indexOf(display);
                    const nextDisplay =
                        hourOptions[wrapIndex(currentIndex - 1, hourOptions.length)];
                    setTime({
                        ...base,
                        hours: to24Hour(nextDisplay, getPeriod(base.hours), true)
                    });
                    return;
                }

                setHours(base.hours - 1);
                return;
            }

            if (segment === "minute") {
                const currentIndex = minuteOptions.indexOf(snapMinute(base.minutes, minuteStep));
                const nextIndex = wrapIndex(currentIndex - 1, minuteOptions.length);
                setMinutes(minuteOptions[nextIndex]);
                return;
            }

            if (segment === "second") {
                const currentIndex = secondOptions.indexOf(snapSecond(base.seconds, secondStep));
                const nextIndex = wrapIndex(currentIndex - 1, secondOptions.length);
                setSeconds(secondOptions[nextIndex]);
                return;
            }

            if (segment === "millisecond") {
                const currentIndex = millisecondOptions.indexOf(
                    snapMillisecond(base.milliseconds, millisecondStep)
                );
                const nextIndex = wrapIndex(currentIndex - 1, millisecondOptions.length);
                setMilliseconds(millisecondOptions[nextIndex]);
                return;
            }

            setPeriod(getPeriod(base.hours) === "am" ? "pm" : "am");
        },
        [
            ensureTime,
            focusedSegment,
            hour12,
            hourOptions,
            millisecondOptions,
            millisecondStep,
            minuteOptions,
            minuteStep,
            secondOptions,
            secondStep,
            setHours,
            setMilliseconds,
            setMinutes,
            setPeriod,
            setSeconds,
            setTime
        ]
    );

    const applyDigitInput = useCallback(
        function applyDigitInput(digit: string) {
            const base = ensureTime();
            const maxDigits = focusedSegment === "millisecond" ? 3 : 2;
            const nextBuffer = `${digitBufferRef.current}${digit}`.slice(-maxDigits);
            digitBufferRef.current = nextBuffer;

            if (digitTimeoutRef.current) {
                clearTimeout(digitTimeoutRef.current);
            }

            digitTimeoutRef.current = setTimeout(function expireBuffer() {
                digitBufferRef.current = "";
            }, 1000);

            const numeric = Number(nextBuffer);

            if (focusedSegment === "hour") {
                if (hour12) {
                    if (nextBuffer.length === 1) {
                        if (numeric === 0) {
                            return;
                        }
                        setTime({
                            ...base,
                            hours: to24Hour(numeric, getPeriod(base.hours), true)
                        });
                        return;
                    }

                    const clamped = Math.min(Math.max(numeric, 1), 12);
                    setTime({
                        ...base,
                        hours: to24Hour(clamped, getPeriod(base.hours), true)
                    });
                    clearDigitBuffer();
                    focusNextSegment("hour");
                    return;
                }

                if (nextBuffer.length === 1) {
                    setHours(numeric);
                    if (numeric > 2) {
                        clearDigitBuffer();
                        focusNextSegment("hour");
                    }
                    return;
                }

                setHours(Math.min(numeric, 23));
                clearDigitBuffer();
                focusNextSegment("hour");
                return;
            }

            if (focusedSegment === "minute") {
                if (nextBuffer.length === 1) {
                    setMinutes(snapMinute(numeric, minuteStep));
                    if (numeric * 10 >= 60) {
                        clearDigitBuffer();
                    }
                    return;
                }

                setMinutes(snapMinute(Math.min(numeric, 59), minuteStep));
                clearDigitBuffer();
                focusNextSegment("minute");
                return;
            }

            if (focusedSegment === "second") {
                if (nextBuffer.length === 1) {
                    setSeconds(snapSecond(numeric, secondStep));
                    if (numeric * 10 >= 60) {
                        clearDigitBuffer();
                    }
                    return;
                }

                setSeconds(snapSecond(Math.min(numeric, 59), secondStep));
                clearDigitBuffer();
                focusNextSegment("second");
                return;
            }

            if (focusedSegment === "millisecond") {
                if (nextBuffer.length < 3) {
                    setMilliseconds(snapMillisecond(numeric, millisecondStep));
                    return;
                }

                setMilliseconds(snapMillisecond(Math.min(numeric, 999), millisecondStep));
                clearDigitBuffer();
                focusNextSegment("millisecond");
            }
        },
        [
            clearDigitBuffer,
            ensureTime,
            focusNextSegment,
            focusedSegment,
            hour12,
            millisecondStep,
            minuteStep,
            secondStep,
            setHours,
            setMilliseconds,
            setMinutes,
            setSeconds,
            setTime
        ]
    );

    const handleOpen = useCallback(
        function handleOpen() {
            if (isDisabled || isReadOnly) {
                return;
            }
            onOpen();
            focusFirstSegment();
        },
        [focusFirstSegment, isDisabled, isReadOnly, onOpen]
    );

    const getRootProps: PropGetter = useCallback(
        function getRootProps(props = {}) {
            const { ref: propsRef, ...rest } = props as { ref?: React.Ref<HTMLDivElement> };

            return {
                ...rest,
                ref: mergeRefs(propsRef, ref),
                id: `${id}-root`,
                "data-open": dataAttr(isOpen),
                "data-disabled": dataAttr(isDisabled),
                "data-invalid": dataAttr(isInvalid),
                "data-readonly": dataAttr(isReadOnly),
                "data-hour12": dataAttr(hour12)
            };
        },
        [hour12, id, isDisabled, isInvalid, isOpen, isReadOnly, ref]
    );

    const getTriggerProps: PropGetter = useCallback(
        function getTriggerProps(props = {}) {
            const {
                ref: propsRef,
                onKeyDown,
                onFocus,
                onBlur,
                ...rest
            } = props as Record<string, unknown> & {
                ref?: React.Ref<HTMLDivElement>;
                onKeyDown?: React.KeyboardEventHandler;
                onFocus?: React.FocusEventHandler;
                onBlur?: React.FocusEventHandler;
            };

            return {
                ...rest,
                ref: mergeRefs(propsRef, triggerRef),
                id,
                role: "group",
                tabIndex: -1,
                "aria-disabled": ariaAttr(isDisabled),
                "aria-invalid": ariaAttr(isInvalid),
                "aria-required": ariaAttr(isRequired),
                "aria-readonly": ariaAttr(isReadOnly),
                "aria-expanded": isOpen,
                "aria-haspopup": "dialog",
                "aria-controls": `${id}-content`,
                "aria-describedby": ariaDescribedByField,
                "aria-label": props["aria-label"] ?? (!time ? placeholder : undefined),
                "data-open": dataAttr(isOpen),
                "data-disabled": dataAttr(isDisabled),
                "data-invalid": dataAttr(isInvalid),
                "data-placeholder": dataAttr(!time),
                onFocus: callAllHandlers(onFocus, onFocusField),
                onBlur: callAllHandlers(onBlur, onBlurField),
                onKeyDown: callAllHandlers(onKeyDown, function handleKeyDown(
                    event: KeyboardEvent
                ) {
                    if (isDisabled || isReadOnly) {
                        return;
                    }

                    if (event.key === "ArrowUp") {
                        event.preventDefault();
                        incrementSegment();
                        if (!isOpen && openOnClick) {
                            handleOpen();
                        }
                        return;
                    }

                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        decrementSegment();
                        if (!isOpen && openOnClick) {
                            handleOpen();
                        }
                        return;
                    }

                    if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        moveSegment(-1);
                        return;
                    }

                    if (event.key === "ArrowRight") {
                        event.preventDefault();
                        moveSegment(1);
                        return;
                    }

                    if (event.key === "Escape" && isOpen) {
                        event.preventDefault();
                        onClose();
                        return;
                    }

                    if (focusedSegment === "period") {
                        if (event.key === "a" || event.key === "A") {
                            event.preventDefault();
                            setPeriod("am");
                            return;
                        }
                        if (event.key === "p" || event.key === "P") {
                            event.preventDefault();
                            setPeriod("pm");
                        }
                        return;
                    }

                    if (/^\d$/.test(event.key)) {
                        event.preventDefault();
                        if (!isOpen && openOnClick) {
                            handleOpen();
                        }
                        applyDigitInput(event.key);
                    }
                })
            };
        },
        [
            applyDigitInput,
            ariaDescribedByField,
            decrementSegment,
            focusedSegment,
            handleOpen,
            id,
            incrementSegment,
            isDisabled,
            isInvalid,
            isOpen,
            isReadOnly,
            isRequired,
            moveSegment,
            onBlurField,
            onClose,
            onFocusField,
            openOnClick,
            placeholder,
            setPeriod,
            time
        ]
    );

    const getSegmentProps = useCallback(
        function getSegmentProps(segment: TimeSegment) {
            const labels: Record<TimeSegment, string> = {
                hour: "Hour",
                minute: "Minute",
                second: "Second",
                millisecond: "Millisecond",
                period: "AM/PM"
            };

            const valueNow = function resolveValueNow(): number | undefined {
                if (!time) {
                    return undefined;
                }
                if (segment === "period") {
                    return getPeriod(time.hours) === "am" ? 0 : 1;
                }
                if (segment === "hour") {
                    return getDisplayHour(time.hours, hour12);
                }
                if (segment === "minute") {
                    return time.minutes;
                }
                if (segment === "second") {
                    return time.seconds;
                }
                return time.milliseconds;
            };

            const valueMin =
                segment === "hour" ? (hour12 ? 1 : 0) : segment === "period" ? 0 : 0;
            const valueMax =
                segment === "hour"
                    ? hour12
                        ? 12
                        : 23
                    : segment === "millisecond"
                      ? 999
                      : segment === "period"
                        ? 1
                        : 59;

            return {
                ref: segmentRefMap[segment],
                role: "spinbutton",
                tabIndex: isDisabled ? -1 : 0,
                "aria-label": labels[segment],
                "aria-valuenow": valueNow(),
                "aria-valuetext": formatSegmentValue(segment, time, hour12),
                "aria-valuemin": valueMin,
                "aria-valuemax": valueMax,
                "data-segment": segment,
                "data-focused": dataAttr(isOpen && focusedSegment === segment),
                "data-placeholder": dataAttr(!time),
                onFocus: function handleSegmentFocus() {
                    clearDigitBuffer();
                    setFocusedSegment(segment);
                    if (openOnClick && !isOpen && !isDisabled && !isReadOnly) {
                        onOpen();
                    }
                },
                onClick: function handleSegmentClick(event: React.MouseEvent) {
                    event.stopPropagation();
                    focusSegment(segment);
                    if (openOnClick && !isOpen && !isDisabled && !isReadOnly) {
                        onOpen();
                    }
                }
            };
        },
        [
            clearDigitBuffer,
            focusSegment,
            focusedSegment,
            hour12,
            isDisabled,
            isOpen,
            isReadOnly,
            onOpen,
            openOnClick,
            segmentRefMap,
            time
        ]
    );

    const getHiddenInputProps: PropGetter = useCallback(
        function getHiddenInputProps(props = {}) {
            return {
                ...props,
                ref: hiddenInputRef,
                type: "hidden",
                name,
                value: value ?? "",
                disabled: isDisabled,
                required: isRequired,
                readOnly: isReadOnly,
                "aria-hidden": true
            };
        },
        [isDisabled, isReadOnly, isRequired, name, value]
    );

    const getContentProps: PropGetter = useCallback(
        function getContentProps(props = {}) {
            return {
                ...props,
                id: `${id}-content`,
                role: "dialog",
                "aria-label": "Choose time",
                "aria-modal": false
            };
        },
        [id]
    );

    return {
        id,
        value: value ?? "",
        time,
        fields,
        hour12,
        minuteStep,
        secondStep,
        millisecondStep,
        minuteOptions,
        secondOptions,
        millisecondOptions,
        hourOptions,
        segments,
        focusedSegment,
        setFocusedSegment,
        isOpen,
        onOpen: handleOpen,
        onClose,
        onToggle,
        isDisabled,
        isInvalid,
        isRequired,
        isReadOnly,
        placeholder,
        name,
        contentZIndex,
        openOnClick,
        triggerRef,
        hourSegmentRef,
        minuteSegmentRef,
        secondSegmentRef,
        millisecondSegmentRef,
        periodSegmentRef,
        setTime,
        setHours,
        setMinutes,
        setSeconds,
        setMilliseconds,
        setPeriod,
        incrementSegment,
        decrementSegment,
        focusSegment,
        focusFirstSegment,
        focusHour,
        getRootProps,
        getTriggerProps,
        getSegmentProps,
        getHiddenInputProps,
        getContentProps,
        rest: restProps as Record<string, unknown>
    };
}
