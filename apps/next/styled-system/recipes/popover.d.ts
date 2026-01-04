/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface PopoverVariant {
  /**
 * @default "md"
 */
size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl"
}

type PopoverVariantMap = {
  [key in keyof PopoverVariant]: Array<PopoverVariant[key]>
}

type PopoverSlot = "content" | "body" | "header" | "footer" | "close"

export type PopoverVariantProps = {
  [key in keyof PopoverVariant]?: ConditionalValue<PopoverVariant[key]> | undefined
}

export interface PopoverRecipe {
  __slot: PopoverSlot
  __type: PopoverVariantProps
  (props?: PopoverVariantProps): Pretty<Record<PopoverSlot, string>>
  raw: (props?: PopoverVariantProps) => PopoverVariantProps
  variantMap: PopoverVariantMap
  variantKeys: Array<keyof PopoverVariant>
  splitVariantProps<Props extends PopoverVariantProps>(props: Props): [PopoverVariantProps, Pretty<DistributiveOmit<Props, keyof PopoverVariantProps>>]
  getVariantProps: (props?: PopoverVariantProps) => PopoverVariantProps
}

/**
 * Dreamy UI Popover component
 */
export declare const popover: PopoverRecipe