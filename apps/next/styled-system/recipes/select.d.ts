/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface SelectVariant {
  /**
 * @default "outline"
 */
variant: "outline" | "solid"
/**
 * @default "md"
 */
size: "xs" | "sm" | "md" | "lg"
/**
 * @default "primary"
 */
selectedItemBackgroundScheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
}

type SelectVariantMap = {
  [key in keyof SelectVariant]: Array<SelectVariant[key]>
}

type SelectSlot = "root" | "trigger" | "indicatorGroup" | "indicator" | "clearButton" | "content" | "item" | "itemIndicator" | "control"

export type SelectVariantProps = {
  [key in keyof SelectVariant]?: ConditionalValue<SelectVariant[key]> | undefined
}

export interface SelectRecipe {
  __slot: SelectSlot
  __type: SelectVariantProps
  (props?: SelectVariantProps): Pretty<Record<SelectSlot, string>>
  raw: (props?: SelectVariantProps) => SelectVariantProps
  variantMap: SelectVariantMap
  variantKeys: Array<keyof SelectVariant>
  splitVariantProps<Props extends SelectVariantProps>(props: Props): [SelectVariantProps, Pretty<DistributiveOmit<Props, keyof SelectVariantProps>>]
  getVariantProps: (props?: SelectVariantProps) => SelectVariantProps
}


export declare const select: SelectRecipe