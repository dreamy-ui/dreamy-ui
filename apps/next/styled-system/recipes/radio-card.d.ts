/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface RadioCardVariant {
  /**
 * @default "md"
 */
size: "sm" | "md" | "lg"
/**
 * @default "outline"
 */
variant: "outline" | "subtle"
/**
 * @default "solid"
 */
radioVariant: "solid"
/**
 * @default "primary"
 */
scheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
}

type RadioCardVariantMap = {
  [key in keyof RadioCardVariant]: Array<RadioCardVariant[key]>
}



export type RadioCardVariantProps = {
  [key in keyof RadioCardVariant]?: ConditionalValue<RadioCardVariant[key]> | undefined
}

export interface RadioCardRecipe {
  
  __type: RadioCardVariantProps
  (props?: RadioCardVariantProps): string
  raw: (props?: RadioCardVariantProps) => RadioCardVariantProps
  variantMap: RadioCardVariantMap
  variantKeys: Array<keyof RadioCardVariant>
  splitVariantProps<Props extends RadioCardVariantProps>(props: Props): [RadioCardVariantProps, Pretty<DistributiveOmit<Props, keyof RadioCardVariantProps>>]
  getVariantProps: (props?: RadioCardVariantProps) => RadioCardVariantProps
}


export declare const radioCard: RadioCardRecipe