/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface SnippetVariant {
  /**
 * @default "solid"
 */
variant: "solid" | "bordered"
/**
 * @default "none"
 */
scheme: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "none"
/**
 * @default "md"
 */
size: "sm" | "md" | "lg"
}

type SnippetVariantMap = {
  [key in keyof SnippetVariant]: Array<SnippetVariant[key]>
}



export type SnippetVariantProps = {
  [key in keyof SnippetVariant]?: ConditionalValue<SnippetVariant[key]> | undefined
}

export interface SnippetRecipe {
  
  __type: SnippetVariantProps
  (props?: SnippetVariantProps): string
  raw: (props?: SnippetVariantProps) => SnippetVariantProps
  variantMap: SnippetVariantMap
  variantKeys: Array<keyof SnippetVariant>
  splitVariantProps<Props extends SnippetVariantProps>(props: Props): [SnippetVariantProps, Pretty<DistributiveOmit<Props, keyof SnippetVariantProps>>]
  getVariantProps: (props?: SnippetVariantProps) => SnippetVariantProps
}


export declare const snippet: SnippetRecipe