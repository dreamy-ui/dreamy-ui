/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface ProgressCircularVariant {
  /**
 * @default "md"
 */
size: "xs" | "sm" | "md" | "lg" | "xl"
/**
 * @default "primary"
 */
scheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
}

type ProgressCircularVariantMap = {
  [key in keyof ProgressCircularVariant]: Array<ProgressCircularVariant[key]>
}



export type ProgressCircularVariantProps = {
  [key in keyof ProgressCircularVariant]?: ConditionalValue<ProgressCircularVariant[key]> | undefined
}

export interface ProgressCircularRecipe {
  
  __type: ProgressCircularVariantProps
  (props?: ProgressCircularVariantProps): string
  raw: (props?: ProgressCircularVariantProps) => ProgressCircularVariantProps
  variantMap: ProgressCircularVariantMap
  variantKeys: Array<keyof ProgressCircularVariant>
  splitVariantProps<Props extends ProgressCircularVariantProps>(props: Props): [ProgressCircularVariantProps, Pretty<DistributiveOmit<Props, keyof ProgressCircularVariantProps>>]
  getVariantProps: (props?: ProgressCircularVariantProps) => ProgressCircularVariantProps
}


export declare const progressCircular: ProgressCircularRecipe