import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const swittchFn = /* @__PURE__ */ createRecipe('switch', {
  "size": "md",
  "scheme": "primary"
}, [])

const swittchVariantMap = {
  "size": [
    "sm",
    "md",
    "lg"
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

const swittchVariantKeys = Object.keys(swittchVariantMap)

export const swittch = /* @__PURE__ */ Object.assign(memo(swittchFn.recipeFn), {
  __recipe__: true,
  __name__: 'swittch',
  __getCompoundVariantCss__: swittchFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: swittchVariantKeys,
  variantMap: swittchVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, swittchVariantKeys)
  },
  getVariantProps: swittchFn.getVariantProps,
})