import {
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack
} from "@/components";
import { VStack } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
	title: "Slider"
} satisfies Meta;

export function Base() {
	return (
		<VStack>
			<Slider>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
		</VStack>
	);
}

export function MinMaxStep() {
	return (
		<VStack>
			<Slider min={0} max={50} step={10}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
		</VStack>
	);
}

export function Size() {
	return (
		<VStack gap={5}>
			<Slider size={"sm"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
			<Slider size={"md"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
			<Slider size={"lg"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
		</VStack>
	);
}

export function Scheme() {
	return (
		<VStack gap={5}>
			<Slider scheme={"primary"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
			<Slider scheme={"secondary"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
			<Slider scheme={"success"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
			<Slider scheme={"warning"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
			<Slider scheme={"error"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
			<Slider scheme={"info"}>
				<SliderTrack>
					<SliderFilledTrack />
					<SliderThumb />
				</SliderTrack>
			</Slider>
		</VStack>
	);
}

export function Vertical() {
	return (
		<Slider orientation="vertical" h={"xs"}>
			<SliderTrack>
				<SliderFilledTrack />
				<SliderThumb />
			</SliderTrack>
		</Slider>
	);
}
