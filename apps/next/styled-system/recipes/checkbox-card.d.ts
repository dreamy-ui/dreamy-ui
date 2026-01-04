/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface CheckboxCardVariant {
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
checkboxVariant: "outline" | "solid"
/**
 * @default "primary"
 */
scheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
}

type CheckboxCardVariantMap = {
  [key in keyof CheckboxCardVariant]: Array<CheckboxCardVariant[key]>
}



export type CheckboxCardVariantProps = {
  [key in keyof CheckboxCardVariant]?: ConditionalValue<CheckboxCardVariant[key]> | undefined
}

export interface CheckboxCardRecipe {
  
  __type: CheckboxCardVariantProps
  (props?: CheckboxCardVariantProps): string
  raw: (props?: CheckboxCardVariantProps) => CheckboxCardVariantProps
  variantMap: CheckboxCardVariantMap
  variantKeys: Array<keyof CheckboxCardVariant>
  splitVariantProps<Props extends CheckboxCardVariantProps>(props: Props): [CheckboxCardVariantProps, Pretty<DistributiveOmit<Props, keyof CheckboxCardVariantProps>>]
  getVariantProps: (props?: CheckboxCardVariantProps) => CheckboxCardVariantProps
}


export declare const checkboxCard: CheckboxCardRecipe