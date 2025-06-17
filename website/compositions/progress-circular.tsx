import {
	useCircularProgress,
	UseCircularProgressProps
} from "@dreamy-ui/react";
import { forwardRef } from "react";
import { styled } from "styled-system/jsx";
import { progressCircular } from "styled-system/recipes";

export interface ProgressCircularProps extends UseCircularProgressProps {}

const StyledProgressCircular = styled("div", progressCircular);

export const ProgressCircular = forwardRef<
	HTMLDivElement,
	ProgressCircularProps
>((props, ref) => {
	const {
		label,
		showValueLabel,
		getProgressBarProps,
		getLabelProps,
		getSvgProps,
		getIndicatorProps,
		getTrackProps,
		valueText
	} = useCircularProgress({ ref, ...props });

	const progressBarProps = getProgressBarProps();

	return (
		<StyledProgressCircular {...progressBarProps}>
			<div>
				<svg {...getSvgProps()}>
					<circle {...getTrackProps()} />
					<circle {...getIndicatorProps()} />
				</svg>
				{showValueLabel && (
					<span data-part="valueText">{valueText}</span>
				)}
			</div>
			{label && <span {...getLabelProps()}>{label}</span>}
		</StyledProgressCircular>
	);
});

ProgressCircular.displayName = "ProgressCircular";
