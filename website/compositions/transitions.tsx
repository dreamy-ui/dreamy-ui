import { useMotionVariants, WithTransitionConfig } from "@dreamy-ui/react";
import {
	AnimatePresence,
	type Variants as _Variants,
	type AnimatePresenceProps
} from "motion/react";
import { forwardRef, useMemo } from "react";
import { css, cx } from "styled-system/css";
import { MotionBox, MotionBoxProps } from "./motion";

export interface CollapseOptions {
	/**
	 * If `true`, the opacity of the content will be animated
	 * @default true
	 */
	animateOpacity?: boolean;
	/**
	 * The height you want the content in its collapsed state.
	 * @default 0
	 */
	startingHeight?: number | string;
	/**
	 * The height you want the content in its expanded state.
	 * @default "auto"
	 */
	endingHeight?: number | string;
	/**
	 * Props to pass to the AnimatePresence component
	 */
	animatePresenceProps?: AnimatePresenceProps;
}

export type ICollapse = CollapseProps;

export interface CollapseProps
	extends WithTransitionConfig<MotionBoxProps>,
		CollapseOptions {}

/**
 * Collapse component.
 *
 * @See Docs https://dreamy-ui.com/docs/components/transitions
 */
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
	(props, ref) => {
		const {
			in: isOpen,
			unmountOnExit,
			animateOpacity = true,
			startingHeight = 0,
			endingHeight = "auto",
			style,
			className,
			transition,
			transitionEnd,
			animatePresenceProps,
			...rest
		} = props;

		const custom = useMemo(
			() => ({
				startingHeight,
				endingHeight,
				animateOpacity,
				transition,
				transitionEnd: {
					enter: transitionEnd?.enter,
					exit: unmountOnExit
						? transitionEnd?.exit
						: transitionEnd?.exit
				}
			}),
			[
				startingHeight,
				endingHeight,
				animateOpacity,
				transition,
				transitionEnd,
				unmountOnExit
			]
		);

		const {
			collapse: { default: variants }
		} = useMotionVariants();

		const show = useMemo(
			() => (unmountOnExit ? isOpen : true),
			[unmountOnExit, isOpen]
		);
		const animate = useMemo(
			() => (isOpen || unmountOnExit ? "initial" : "exit"),
			[isOpen, unmountOnExit]
		);

		return (
			<AnimatePresence
				initial={false}
				custom={custom}
				{...animatePresenceProps}
			>
				{show && (
					<MotionBox
						ref={ref}
						custom={custom}
						variants={variants as _Variants}
						initial={unmountOnExit ? "exit" : false}
						animate={animate}
						exit="exit"
						{...rest}
						className={cx(
							css({
								overflow: "hidden",
								display: "block"
							}),
							className
						)}
					/>
				)}
			</AnimatePresence>
		);
	}
);

Collapse.displayName = "Collapse";
