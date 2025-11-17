/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface ImageVariant {
  
}

type ImageVariantMap = {
  [key in keyof ImageVariant]: Array<ImageVariant[key]>
}



export type ImageVariantProps = {
  [key in keyof ImageVariant]?: ConditionalValue<ImageVariant[key]> | undefined
}

export interface ImageRecipe {
  
  __type: ImageVariantProps
  (props?: ImageVariantProps): string
  raw: (props?: ImageVariantProps) => ImageVariantProps
  variantMap: ImageVariantMap
  variantKeys: Array<keyof ImageVariant>
  splitVariantProps<Props extends ImageVariantProps>(props: Props): [ImageVariantProps, Pretty<DistributiveOmit<Props, keyof ImageVariantProps>>]
  getVariantProps: (props?: ImageVariantProps) => ImageVariantProps
}


export declare const image: ImageRecipe