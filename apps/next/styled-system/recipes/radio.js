import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const radioFn = /* @__PURE__ */ createRecipe('radio', {
  "size": "md",
  "scheme": "primary",
  "variant": "solid"
}, [])

const radioVariantMap = {
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "variant": [
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

const radioVariantKeys = Object.keys(radioVariantMap)

export const radio = /* @__PURE__ */ Object.assign(memo(radioFn.recipeFn), {
  __recipe__: true,
  __name__: 'radio',
  __getCompoundVariantCss__: radioFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: radioVariantKeys,
  variantMap: radioVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, radioVariantKeys)
  },
  getVariantProps: radioFn.getVariantProps,
})