/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface ModalVariant {
  /**
 * @default "md"
 */
size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "full"
/**
 * @default "center"
 */
placement: "top" | "center"
}

type ModalVariantMap = {
  [key in keyof ModalVariant]: Array<ModalVariant[key]>
}

type ModalSlot = "overlay" | "container" | "content" | "body" | "header" | "footer" | "close"

export type ModalVariantProps = {
  [key in keyof ModalVariant]?: ConditionalValue<ModalVariant[key]> | undefined
}

export interface ModalRecipe {
  __slot: ModalSlot
  __type: ModalVariantProps
  (props?: ModalVariantProps): Pretty<Record<ModalSlot, string>>
  raw: (props?: ModalVariantProps) => ModalVariantProps
  variantMap: ModalVariantMap
  variantKeys: Array<keyof ModalVariant>
  splitVariantProps<Props extends ModalVariantProps>(props: Props): [ModalVariantProps, Pretty<DistributiveOmit<Props, keyof ModalVariantProps>>]
  getVariantProps: (props?: ModalVariantProps) => ModalVariantProps
}

/**
 * Dreamy UI Modal component
 */
export declare const modal: ModalRecipe