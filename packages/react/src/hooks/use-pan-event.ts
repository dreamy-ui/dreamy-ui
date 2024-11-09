import { useLatestRef } from "@/hooks/use-latest-ref";
import { getEventPoint, isMultiTouchEvent } from "@/utils/event";
import { addPointerEvent } from "framer-motion";
import sync, { cancelSync, getFrameData } from "framesync";
import { useEffect, useRef } from "react";

export interface UsePanEventProps {
    onPan?: PanEventHandler;
    onPanStart?: PanEventHandler;
    onPanEnd?: PanEventHandler;
    onPanSessionStart?: PanEventHandler;
    onPanSessionEnd?: PanEventHandler;
    threshold?: number;
}

export function usePanEvent(ref: React.RefObject<HTMLElement>, options: UsePanEventProps) {
    const { onPan, onPanStart, onPanEnd, onPanSessionStart, onPanSessionEnd, threshold } = options;

    const hasPanEvents = Boolean(
        onPan || onPanStart || onPanEnd || onPanSessionStart || onPanSessionEnd
    );

    const panSession = useRef<PanEvent | null>(null);

    const handlersRef = useLatestRef<Partial<PanEventHandlers>>({
        onSessionStart: onPanSessionStart,
        onSessionEnd: onPanSessionEnd,
        onStart: onPanStart,
        onMove: onPan,
        onEnd(event, info) {
            panSession.current = null;
            onPanEnd?.(event, info);
        }
    });

    useEffect(() => {
        panSession.current?.updateHandlers(handlersRef.current);
    });

    useEffect(() => {
        const node = ref.current;

        if (!node || !hasPanEvents) return;

        function onPointerDown(event: AnyPointerEvent) {
            panSession.current = new PanEvent(event, handlersRef.current, threshold);
        }

        return addPointerEvent(node, "pointerdown", onPointerDown);
    }, [ref, hasPanEvents, handlersRef, threshold]);

    useEffect(() => {
        return () => {
            panSession.current?.end();
            panSession.current = null;
        };
    }, []);
}

/**
 * A Pan Session is recognized when the pointer is down
 * and moved in the allowed direction.
 */
export class PanEvent {
    /**
     * We use this to keep track of the `x` and `y` pan session history
     * as the pan event happens. It helps to calculate the `offset` and `delta`
     */
    private history: PanEventHistory = [];

    // The pointer event that started the pan session
    private startEvent: AnyPointerEvent | null = null;

    // The current pointer event for the pan session
    private lastEvent: AnyPointerEvent | null = null;

    // The current pointer event info for the pan session
    private lastEventInfo: PointerEventInfo | null = null;

    private handlers: Partial<PanEventHandlers> = {};

    private removeListeners: Function = () => { };

    /**
     * Minimal pan distance required before recognizing the pan.
     * @default "3px"
     */
    private threshold = 3;

    private win: typeof globalThis;

    constructor(event: AnyPointerEvent, handlers: Partial<PanEventHandlers>, threshold?: number) {
        this.win = (event.view ?? window) as typeof globalThis.window;

        // If we have more than one touch, don't start detecting this gesture
        if (isMultiTouchEvent(event)) return;

        this.handlers = handlers;

        if (threshold) {
            this.threshold = threshold;
        }

        // stop default browser behavior
        try {
            event.stopPropagation();
            // event.preventDefault();
        } catch (_) { }

        // get and save the `pointerdown` event info in history
        // we'll use it to compute the `offset`
        const info = { point: getEventPoint(event) };
        const { timestamp } = getFrameData();
        this.history = [{ ...info.point, timestamp }];

        // notify pan session start
        const { onSessionStart } = handlers;
        onSessionStart?.(event, getPanInfo(info, this.history));

        // attach event listeners and return a single function to remove them all
        this.removeListeners = pipe(
            addPointerEvent(this.win, "pointermove", this.onPointerMove),
            addPointerEvent(this.win, "pointerup", this.onPointerUp),
            addPointerEvent(this.win, "pointercancel", this.onPointerUp)
        );
    }

    private updatePoint = () => {
        if (!(this.lastEvent && this.lastEventInfo)) return;

        const info = getPanInfo(this.lastEventInfo, this.history);

        const isPanStarted = this.startEvent !== null;

        const isDistancePastThreshold = distance(info.offset, { x: 0, y: 0 }) >= this.threshold;

        if (!isPanStarted && !isDistancePastThreshold) return;

        const { timestamp } = getFrameData();
        this.history.push({ ...info.point, timestamp });

        const { onStart, onMove } = this.handlers;

        if (!isPanStarted) {
            onStart?.(this.lastEvent, info);
            this.startEvent = this.lastEvent;
        }

        onMove?.(this.lastEvent, info);
    };

    private onPointerMove = (event: AnyPointerEvent, info: PointerEventInfo) => {
        event.stopPropagation();
        this.lastEvent = event;
        this.lastEventInfo = info;

        // Throttle mouse move event to once per frame
        sync.update(this.updatePoint, true);
    };

    private onPointerUp = (event: AnyPointerEvent, info: PointerEventInfo) => {
        // notify pan session ended
        const panInfo = getPanInfo(info, this.history);
        const { onEnd, onSessionEnd } = this.handlers;

        onSessionEnd?.(event, panInfo);
        this.end();

        // if panning never started, no need to call `onEnd`
        // panning requires a pointermove of at least 3px
        if (!onEnd || !this.startEvent) return;

        onEnd?.(event, panInfo);
    };

    updateHandlers(handlers: Partial<PanEventHandlers>) {
        this.handlers = handlers;
    }

    end() {
        this.removeListeners?.();
        cancelSync.update(this.updatePoint);
    }
}

/* -----------------------------------------------------------------------------
 * Utilities
 * -----------------------------------------------------------------------------*/

function subtract(a: Point, b: Point) {
    return { x: a.x - b.x, y: a.y - b.y };
}

function getPanInfo(info: PointerEventInfo, history: PanEventHistory) {
    return {
        point: info.point,
        delta: subtract(info.point, history[history.length - 1]),
        offset: subtract(info.point, history[0]),
        velocity: getVelocity(history, 0.1)
    };
}

const toMilliseconds = (v: number) => v * 1000;

function getVelocity(history: TimestampedPoint[], timeDelta: number): Point {
    if (history.length < 2) {
        return { x: 0, y: 0 };
    }

    let i = history.length - 1;
    let timestampedPoint: TimestampedPoint | null = null;
    const lastPoint = history[history.length - 1];
    while (i >= 0) {
        timestampedPoint = history[i];
        if (lastPoint.timestamp - timestampedPoint.timestamp > toMilliseconds(timeDelta)) {
            break;
        }
        i--;
    }

    if (!timestampedPoint) {
        return { x: 0, y: 0 };
    }

    const time = (lastPoint.timestamp - timestampedPoint.timestamp) / 1000;
    if (time === 0) {
        return { x: 0, y: 0 };
    }

    const currentVelocity = {
        x: (lastPoint.x - timestampedPoint.x) / time,
        y: (lastPoint.y - timestampedPoint.y) / time
    };

    if (currentVelocity.x === Number.POSITIVE_INFINITY) {
        currentVelocity.x = 0;
    }
    if (currentVelocity.y === Number.POSITIVE_INFINITY) {
        currentVelocity.y = 0;
    }

    return currentVelocity;
}

function pipe<R>(...fns: Array<(a: R) => R>) {
    return (v: R) => fns.reduce((a, b) => b(a), v);
}

function distance1D(a: number, b: number) {
    return Math.abs(a - b);
}

function isPoint(point: any): point is { x: number; y: number } {
    return "x" in point && "y" in point;
}

export function distance<P extends Point | number>(a: P, b: P) {
    if (typeof a === "number" && typeof b === "number") {
        return distance1D(a, b);
    }

    if (isPoint(a) && isPoint(b)) {
        const xDelta = distance1D(a.x, b.x);
        const yDelta = distance1D(a.y, b.y);
        return Math.sqrt(xDelta ** 2 + yDelta ** 2);
    }

    return 0;
}

export interface Point {
    x: number;
    y: number;
}

/**
 * The event information passed to pan event handlers like `onPan`, `onPanStart`.
 *
 * It contains information about the current state of the tap gesture such as its
 * `point`, `delta`, and `offset`
 */
interface PanEventInfo {
    /**
     * Contains `x` and `y` values for the current pan position relative
     * to the device or page.
     */
    point: Point;
    /**
     * Contains `x` and `y` values for the distance moved since
     * the last pan event.
     */
    delta: Point;
    /**
     * Contains `x` and `y` values for the distance moved from
     * the first pan event.
     */
    offset: Point;
    /**
     * Contains `x` and `y` values for the current velocity of the pointer.
     */
    velocity: Point;
}

export type AnyPointerEvent = TouchEvent | MouseEvent | PointerEvent;

export interface PointerEventInfo {
    point: Point;
}

export interface TimestampedPoint extends Point {
    timestamp: number;
}

export type PanEventHandler = (event: AnyPointerEvent, info: PanEventInfo) => void;

export interface PanEventHandlers {
    /**
     * Callback fired when the pan session is created.
     * This is typically called once `pointerdown` event is fired.
     */
    onSessionStart: PanEventHandler;
    /**
     * Callback fired when the pan session is detached.
     * This is typically called once `pointerup` event is fired.
     */
    onSessionEnd: PanEventHandler;
    /**
     * Callback fired when the pan session has started.
     * The pan session when the pan offset is greater than
     * the threshold (allowable move distance to detect pan)
     */
    onStart: PanEventHandler;
    /**
     * Callback fired while panning
     */
    onMove: PanEventHandler;
    /**
     * Callback fired when the current pan session has ended.
     * This is typically called once `pointerup` event is fired.
     */
    onEnd: PanEventHandler;
}

export type PanEventHistory = TimestampedPoint[];

export interface PanEventOptions {
    threshold?: number;
    window?: Window;
}
