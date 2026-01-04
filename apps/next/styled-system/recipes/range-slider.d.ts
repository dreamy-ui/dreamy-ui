/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface RangeSliderVariant {
  /**
 * @default "primary"
 */
scheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
}

type RangeSliderVariantMap = {
  [key in keyof RangeSliderVariant]: Array<RangeSliderVariant[key]>
}

type RangeSliderSlot = "root" | "track" | "trackFilled" | "thumb" | "marker"

export type RangeSliderVariantProps = {
  [key in keyof RangeSliderVariant]?: ConditionalValue<RangeSliderVariant[key]> | undefined
}

export interface RangeSliderRecipe {
  __slot: RangeSliderSlot
  __type: RangeSliderVariantProps
  (props?: RangeSliderVariantProps): Pretty<Record<RangeSliderSlot, string>>
  raw: (props?: RangeSliderVariantProps) => RangeSliderVariantProps
  variantMap: RangeSliderVariantMap
  variantKeys: Array<keyof RangeSliderVariant>
  splitVariantProps<Props extends RangeSliderVariantProps>(props: Props): [RangeSliderVariantProps, Pretty<DistributiveOmit<Props, keyof RangeSliderVariantProps>>]
  getVariantProps: (props?: RangeSliderVariantProps) => RangeSliderVariantProps
}


export declare const rangeSlider: RangeSliderRecipe