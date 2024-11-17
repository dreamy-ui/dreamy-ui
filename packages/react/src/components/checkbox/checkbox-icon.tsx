import { defaultMotionVariants } from "@/provider/motion";
import { TRANSITION_EASINGS } from "@/utils";
import { type SVGMotionProps, m } from "framer-motion";
import type { UseCheckboxReturn } from "./use-checkbox";

export interface IconCustomProps {
    /**
     * Animation time in milliseconds.
     * @default 200
     */
    animationTime?: number;
    /**
     * Props to pass to the animated path
     */
    pathProps?: SVGMotionProps<SVGPathElement>;
}

type CheckboxIconProps = Partial<ReturnType<UseCheckboxReturn["getIconProps"]> & IconCustomProps>;

function CheckIcon(props: CheckboxIconProps) {
    const {
        isChecked,
        active,
        reduceMotion,
        animationTime = 200,
        pathProps,
        ...otherProps
    } = props;

    return (
        <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...otherProps}
        >
            <m.path
                d="M20 6 9 17l-5-5"
                initial={false}
                animate={"animate"}
                custom={{ isChecked, active, animationTime }}
                variants={defaultMotionVariants.checkboxCheckIcon.default}
                {...pathProps}
            />
        </svg>
    );
}

function IndeterminateIcon(props: CheckboxIconProps) {
    const { isChecked, reduceMotion, animationTime = 0.2, ...otherProps } = props;

    return (
        <svg
            aria-hidden="true"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            {...otherProps}
        >
            <m.line
                x1="21"
                x2="3"
                y1="12"
                y2="12"
                initial={{
                    pathOffset: 1,
                    pathLength: 1
                }}
                animate={{ pathOffset: 0, pathLength: 1 }}
                exit={{
                    pathOffset: 1,
                    pathLength: 1
                }}
                transition={{
                    duration: !reduceMotion ? animationTime / 1000 : 0,
                    ease: TRANSITION_EASINGS.easeInOut
                }}
            />
        </svg>
    );
}

/**
 * CheckboxIcon is used to visually indicate the checked or indeterminate
 * state of a checkbox.
 */
export function CheckboxIcon(props: CheckboxIconProps) {
    const { isIndeterminate, ...otherProps } = props;
    const BaseIcon = isIndeterminate ? IndeterminateIcon : CheckIcon;

    return <BaseIcon {...otherProps} />;
}
