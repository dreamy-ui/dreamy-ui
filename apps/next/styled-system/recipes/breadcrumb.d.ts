/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface BreadcrumbVariant {
  /**
 * @default "md"
 */
size: "sm" | "md" | "lg"
/**
 * @default "underline"
 */
variant: "plain" | "underline"
}

type BreadcrumbVariantMap = {
  [key in keyof BreadcrumbVariant]: Array<BreadcrumbVariant[key]>
}

type BreadcrumbSlot = "root" | "list" | "item" | "link" | "currentLink" | "separator" | "ellipsis"

export type BreadcrumbVariantProps = {
  [key in keyof BreadcrumbVariant]?: ConditionalValue<BreadcrumbVariant[key]> | undefined
}

export interface BreadcrumbRecipe {
  __slot: BreadcrumbSlot
  __type: BreadcrumbVariantProps
  (props?: BreadcrumbVariantProps): Pretty<Record<BreadcrumbSlot, string>>
  raw: (props?: BreadcrumbVariantProps) => BreadcrumbVariantProps
  variantMap: BreadcrumbVariantMap
  variantKeys: Array<keyof BreadcrumbVariant>
  splitVariantProps<Props extends BreadcrumbVariantProps>(props: Props): [BreadcrumbVariantProps, Pretty<DistributiveOmit<Props, keyof BreadcrumbVariantProps>>]
  getVariantProps: (props?: BreadcrumbVariantProps) => BreadcrumbVariantProps
}

/**
 * Dreamy UI Breadcrumb component
 */
export declare const breadcrumb: BreadcrumbRecipe