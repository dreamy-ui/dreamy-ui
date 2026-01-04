/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface SwittchVariant {
  /**
 * @default "md"
 */
size: "sm" | "md" | "lg"
/**
 * @default "primary"
 */
scheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
}

type SwittchVariantMap = {
  [key in keyof SwittchVariant]: Array<SwittchVariant[key]>
}



export type SwittchVariantProps = {
  [key in keyof SwittchVariant]?: ConditionalValue<SwittchVariant[key]> | undefined
}

export interface SwittchRecipe {
  
  __type: SwittchVariantProps
  (props?: SwittchVariantProps): string
  raw: (props?: SwittchVariantProps) => SwittchVariantProps
  variantMap: SwittchVariantMap
  variantKeys: Array<keyof SwittchVariant>
  splitVariantProps<Props extends SwittchVariantProps>(props: Props): [SwittchVariantProps, Pretty<DistributiveOmit<Props, keyof SwittchVariantProps>>]
  getVariantProps: (props?: SwittchVariantProps) => SwittchVariantProps
}


export declare const swittch: SwittchRecipe