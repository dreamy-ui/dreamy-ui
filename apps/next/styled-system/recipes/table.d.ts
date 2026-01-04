/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface TableVariant {
  interactive: boolean
striped: boolean
showColumnBorder: boolean
withBackground: boolean
/**
 * @default "simple"
 */
variant: "simple" | "line"
/**
 * @default "md"
 */
size: "sm" | "md" | "lg"
scheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
}

type TableVariantMap = {
  [key in keyof TableVariant]: Array<TableVariant[key]>
}

type TableSlot = "root" | "table" | "body" | "header" | "row" | "cell" | "columnHeader" | "caption"

export type TableVariantProps = {
  [key in keyof TableVariant]?: TableVariant[key] | undefined
}

export interface TableRecipe {
  __slot: TableSlot
  __type: TableVariantProps
  (props?: TableVariantProps): Pretty<Record<TableSlot, string>>
  raw: (props?: TableVariantProps) => TableVariantProps
  variantMap: TableVariantMap
  variantKeys: Array<keyof TableVariant>
  splitVariantProps<Props extends TableVariantProps>(props: Props): [TableVariantProps, Pretty<DistributiveOmit<Props, keyof TableVariantProps>>]
  getVariantProps: (props?: TableVariantProps) => TableVariantProps
}


export declare const table: TableRecipe