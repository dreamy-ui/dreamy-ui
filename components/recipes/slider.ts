import { getColorSchemes } from "@dreamy-ui/panda-preset";
import { defineSlotRecipe } from "@pandacss/dev";

export const slider = defineSlotRecipe({
	className: "slider",
	jsx: ["Slider.Root", "Slider.Track", "Slider.TrackFilled", "Slider.Thumb", "Slider.Mark"],
	slots: ["root", "track", "trackFilled", "thumb", "marker"],
	staticCss: ["*"],
	base: {
		root: {
			display: "flex",
			alignItems: "center",
			position: "relative",
			width: "full",
			"&[aria-disabled='true']": {
				cursor: "not-allowed",
				opacity: 0.5
			},
			userSelect: "none",
			touchAction: "none"
		},
		track: {
			touchAction: "none",
			position: "relative",
			width: "full",
			bg: "alpha.100",
			borderRadius: "full",
			height: "full",
			cursor: "pointer",
			display: "flex",
			"[aria-disabled='true'] &": {
				cursor: "not-allowed"
			},
			"[data-reversed] &": {
				flexDirection: "row-reverse"
			},
			"[data-orientation=vertical] &": {
				borderYColor: "transparent",
				borderYWidth: "calc(var(--slider-thumb-size) / 2)",
				flexDirection: "column-reverse",
				borderBottomColor: "var(--slider-color)"
			},
			"[data-orientation=vertical][data-reversed] &": {
				flexDirection: "column",
				borderBottomColor: "transparent",
				borderTopColor: "var(--slider-color)"
			},
			"[data-orientation=horizontal] &": {
				borderXColor: "transparent",
				borderXWidth: "calc(var(--slider-thumb-size) / 2)",
				borderInlineStartColor: "var(--slider-color)"
			},
			"[data-orientation=horizontal][data-reversed] &": {
				flexDirection: "row-reverse",
				borderInlineStartColor: "transparent",
				borderInlineEndColor: "var(--slider-color)"
			},
			"[data-hide-thumb] &": {
				borderWidth: "0",
				overflow: "hidden"
			}
		},
		trackFilled: {
			bg: "var(--slider-color)",
			"[data-hide-thumb] &": {
				borderRadius: "full"
			},
			"[data-orientation=horizontal] &": {
				height: "full"
			},
			"[data-orientation=vertical] &": {
				width: "full"
			}
		},
		thumb: {
			position: "absolute",
			bg: "var(--slider-color)",
			width: "var(--slider-thumb-size)",
			height: "var(--slider-thumb-size)",
			borderRadius: "full",
			translate: "auto",
			scale: "auto",
			cursor: "grab",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			_invalid: {
				boxShadow: "0 0 0 1.5px {colors.error}"
			},
			_after: {
				content: '""',
				width: "70%",
				height: "70%",
				display: "block",
				bg: "{colors.bg}",
				borderRadius: "full",
				transition: "scale 0.2s {easings.ease-in-out}"
			},
			_active: {
				cursor: "grabbing",
				"[aria-disabled='true'] &": {
					cursor: "not-allowed"
				},
				_after: {
					scale: 0.8
				}
			},
			"[aria-disabled='true'] &": {
				cursor: "not-allowed"
			},
			"[data-orientation=horizontal] &": {
				top: "50%",
				translateY: "-50%",
				translateX: "-50%"
			},
			"[data-orientation=vertical] &": {
				left: "50%",
				translateY: "50%",
				translateX: "-50%"
			},
			"[data-hide-thumb] &": {
				display: "none",
				pointerEvents: "none"
			}
		},
		marker: {}
	},
	defaultVariants: {
		scheme: "primary"
	},
	variants: {
		scheme: getColorSchemes("--slider-color", undefined, "root")
	}
});
