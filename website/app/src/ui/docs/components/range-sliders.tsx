import { RangeSlider } from "@/range-slider";
import { Text } from "@/text";
import { useState } from "react";

export function MaxMinRangeSlider() {
	const [value, setValue] = useState<[number, number]>([0, 25]);

	return (
		<>
			<Text>
				Range: {value[0]} - {value[1]}
			</Text>

			<RangeSlider.Root
				max={50}
				min={0}
				onChangeValue={setValue}
				step={5}
				value={value}
			>
				<RangeSlider.Track maxW="xs">
					<RangeSlider.FilledTrack />
					<RangeSlider.Thumb index={0} />
					<RangeSlider.Thumb index={1} />
				</RangeSlider.Track>
			</RangeSlider.Root>
		</>
	);
}

export function ControlledRangeSlider() {
	const [value, setValue] = useState<[number, number]>([25, 75]);

	return (
		<>
			<Text>
				Range: {value[0]} - {value[1]}
			</Text>

			<RangeSlider.Root
				onChangeValue={setValue}
				value={value}
			>
				<RangeSlider.Track maxW="xs">
					<RangeSlider.FilledTrack />
					<RangeSlider.Thumb index={0} />
					<RangeSlider.Thumb index={1} />
				</RangeSlider.Track>
			</RangeSlider.Root>
		</>
	);
}
