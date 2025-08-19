export function isMobile() {
	const result = navigator.userAgent.match(
		/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i
	);

	return result !== null;
}

import { getEventWindow } from "./owner";

function pointFromTouch(e: TouchEvent, type: PointType = "page") {
	const point = e.touches[0] || e.changedTouches[0];
	return { x: point[`${type}X`], y: point[`${type}Y`] };
}

function pointFromMouse(point: MouseEvent | PointerEvent, type: PointType = "page") {
	return {
		x: point[`${type}X`],
		y: point[`${type}Y`]
	};
}

export function getEventPoint(event: AnyPointerEvent, type: PointType = "page") {
	return isTouchEvent(event) ? pointFromTouch(event, type) : pointFromMouse(event, type);
}

export function addDomEvent(
	target: EventTarget,
	eventName: string,
	handler: EventListener,
	options?: AddEventListenerOptions
) {
	target.addEventListener(eventName, handler, options);
	return () => {
		target.removeEventListener(eventName, handler, options);
	};
}

export function isMouseEvent(event: any): event is MouseEvent {
	const win = getEventWindow(event);

	// PointerEvent inherits from MouseEvent, so we can't use a straight instanceof check.
	if (typeof win.PointerEvent !== "undefined" && event instanceof win.PointerEvent) {
		return !!(event.pointerType === "mouse");
	}

	return event instanceof win.MouseEvent;
}

export function isTouchEvent(event: AnyPointerEvent): event is TouchEvent {
	const hasTouches = !!(event as TouchEvent).touches;
	return hasTouches;
}

export function isMultiTouchEvent(event: AnyPointerEvent) {
	return isTouchEvent(event) && event.touches.length > 1;
}

function filter(cb: EventListener): EventListener {
	return (event: Event) => {
		const isMouse = isMouseEvent(event);
		if (!isMouse || (isMouse && event.button === 0)) {
			cb(event);
		}
	};
}

function wrap(cb: MixedEventListener, filterPrimary = false): EventListener {
	function listener(event: any) {
		cb(event, { point: getEventPoint(event) });
	}
	const fn = filterPrimary ? filter(listener) : listener;
	return fn as EventListener;
}

export function addPointerEvent(
	target: EventTarget,
	type: string,
	cb: MixedEventListener,
	options?: AddEventListenerOptions
) {
	return addDomEvent(target, type, wrap(cb, type === "pointerdown"), options);
}

export type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent;

export interface Point {
	x: number;
	y: number;
}

export interface PointerEventInfo {
	point: Point;
}

export type MixedEventListener = (e: AnyPointerEvent, info: PointerEventInfo) => void;

export type PointType = "page" | "client";
