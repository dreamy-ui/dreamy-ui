/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface ThemeVariant {
  
}

type ThemeVariantMap = {
  [key in keyof ThemeVariant]: Array<ThemeVariant[key]>
}



export type ThemeVariantProps = {
  [key in keyof ThemeVariant]?: ConditionalValue<ThemeVariant[key]> | undefined
}

export interface ThemeRecipe {
  
  __type: ThemeVariantProps
  (props?: ThemeVariantProps): string
  raw: (props?: ThemeVariantProps) => ThemeVariantProps
  variantMap: ThemeVariantMap
  variantKeys: Array<keyof ThemeVariant>
  splitVariantProps<Props extends ThemeVariantProps>(props: Props): [ThemeVariantProps, Pretty<DistributiveOmit<Props, keyof ThemeVariantProps>>]
  getVariantProps: (props?: ThemeVariantProps) => ThemeVariantProps
}

/**
 * Dreamy UI Theme component
 */
export declare const theme: ThemeRecipe