import type { SVGProps } from "react";

export const ArrowUpIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
    </svg>
);

export const ArrowDownIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
    </svg>
);
