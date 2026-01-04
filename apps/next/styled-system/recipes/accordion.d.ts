/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface AccordionVariant {
  /**
 * @default "md"
 */
size: "sm" | "md" | "lg"
/**
 * @default "outline"
 */
variant: "outline" | "solid" | "subtle"
}

type AccordionVariantMap = {
  [key in keyof AccordionVariant]: Array<AccordionVariant[key]>
}

type AccordionSlot = "root" | "item" | "trigger" | "content" | "icon"

export type AccordionVariantProps = {
  [key in keyof AccordionVariant]?: ConditionalValue<AccordionVariant[key]> | undefined
}

export interface AccordionRecipe {
  __slot: AccordionSlot
  __type: AccordionVariantProps
  (props?: AccordionVariantProps): Pretty<Record<AccordionSlot, string>>
  raw: (props?: AccordionVariantProps) => AccordionVariantProps
  variantMap: AccordionVariantMap
  variantKeys: Array<keyof AccordionVariant>
  splitVariantProps<Props extends AccordionVariantProps>(props: Props): [AccordionVariantProps, Pretty<DistributiveOmit<Props, keyof AccordionVariantProps>>]
  getVariantProps: (props?: AccordionVariantProps) => AccordionVariantProps
}

/**
 * Dreamy UI Accordion component
 */
export declare const accordion: AccordionRecipe