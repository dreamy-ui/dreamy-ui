import { SliderFilledTrackBase } from "@/components/slider/slider-filled-track";
import { SliderMarkBase } from "@/components/slider/slider-marker";
import { SliderRoot } from "@/components/slider/slider-root";
import { SliderThumbBase } from "@/components/slider/slider-thumb";
import { SliderTrackBase } from "@/components/slider/slider-track";
import { createStyleContext } from "@/components/style-context";
import { slider } from "@dreamy-ui/system/recipes";

const { withProvider, withContext } = createStyleContext(slider);

/**
 * Slider component
 *
 * @See Docs https://dream-ui.com/docs/components/slider
 */
export const Slider = withProvider(SliderRoot, "root");
export const SliderTrack = withContext(SliderTrackBase, "track");
export const SliderFilledTrack = withContext(SliderFilledTrackBase, "trackFilled");
export const SliderThumb = withContext(SliderThumbBase, "thumb");
export const SliderMark = withContext(SliderMarkBase, "marker");
