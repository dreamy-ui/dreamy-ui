import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const radioCardFn = /* @__PURE__ */ createRecipe('radio-card', {
  "size": "md",
  "radioVariant": "solid",
  "variant": "outline",
  "scheme": "primary"
}, [])

const radioCardVariantMap = {
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "variant": [
    "outline",
    "subtle"
  ],
  "radioVariant": [
    "solid"
  ],
  "scheme": [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "none"
  ]
}

const radioCardVariantKeys = Object.keys(radioCardVariantMap)

export const radioCard = /* @__PURE__ */ Object.assign(memo(radioCardFn.recipeFn), {
  __recipe__: true,
  __name__: 'radioCard',
  __getCompoundVariantCss__: radioCardFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: radioCardVariantKeys,
  variantMap: radioCardVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, radioCardVariantKeys)
  },
  getVariantProps: radioCardFn.getVariantProps,
})