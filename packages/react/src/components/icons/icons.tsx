import type { SVGProps } from "react";

/**
 * Boxicons chevron left (`BiChevronLeft`).
 */
export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="currentColor"
            height="1em"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
        </svg>
    );
}

/**
 * Boxicons chevron right (`BiChevronRight`).
 */
export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="currentColor"
            height="1em"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
        </svg>
    );
}

/**
 * Lucide calendar (`LuCalendar`).
 */
export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect
                height="18"
                rx="2"
                width="18"
                x="3"
                y="4"
            />
            <path d="M3 10h18" />
        </svg>
    );
}
