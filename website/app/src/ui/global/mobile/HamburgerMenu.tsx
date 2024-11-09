import { type SVGMotionProps, m } from "framer-motion";
import { memo, useMemo } from "react";

interface Props extends SVGMotionProps<SVGSVGElement> {
    isOpen?: boolean;
    color?: string;
    strokeWidth?: string | number;
    lineProps?: any;
}

const unitHeight = 4;
const top = {
    closed: {
        rotate: 0,
        translateY: 0.1,
        transition: { duration: 0.15 }
    },
    opened: {
        rotate: -45,
        translateY: 2,
        transition: { duration: 0.15 }
    }
};
const center = {
    closed: {
        opacity: 1,
        transition: { duration: 0 }
    },
    opened: {
        opacity: 0,
        transition: { duration: 0.15 }
    }
};
const bottom = {
    closed: {
        rotate: 0,
        translateY: 0,
        transition: { duration: 0.15 }
    },
    opened: {
        rotate: 45,
        translateY: -2,
        transition: { duration: 0.15 }
    }
};

export default memo(function HamburgerMenu({
    isOpen = false,
    width = 24,
    height = 16,
    strokeWidth = 1.5,
    color = "currentColor",
    lineProps = null,
    ...props
}: Props) {
    const variant = useMemo(() => (isOpen ? "opened" : "closed"), [isOpen]);

    lineProps = useMemo(
        () => ({
            stroke: color,
            strokeWidth: strokeWidth as number,
            vectorEffect: "non-scaling-stroke",
            initial: "closed",
            animate: variant,
            ...lineProps
        }),
        [color, strokeWidth, variant, lineProps]
    );

    const unitWidth = useMemo(
        () => (unitHeight * (width as number)) / (height as number),
        [width, height]
    );

    return (
        <m.svg
            aria-hidden={"true"}
            viewBox={`0 0 ${unitWidth} ${unitHeight}`}
            overflow="visible"
            preserveAspectRatio="none"
            width={width}
            height={height}
            {...props}
        >
            <m.line
                x1="0"
                x2={unitWidth}
                y1="0"
                y2="0"
                variants={top}
                {...lineProps}
            />
            <m.line
                x1="0"
                x2={unitWidth}
                y1="2"
                y2="2"
                variants={center}
                {...lineProps}
            />
            <m.line
                x1="0"
                x2={unitWidth}
                y1="4"
                y2="4"
                variants={bottom}
                {...lineProps}
            />
        </m.svg>
    );
});
