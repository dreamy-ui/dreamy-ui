import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const checkboxFn = /* @__PURE__ */ createRecipe('checkbox', {
  "size": "md",
  "scheme": "primary",
  "variant": "solid"
}, [])

const checkboxVariantMap = {
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "variant": [
    "outline",
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

const checkboxVariantKeys = Object.keys(checkboxVariantMap)

export const checkbox = /* @__PURE__ */ Object.assign(memo(checkboxFn.recipeFn), {
  __recipe__: true,
  __name__: 'checkbox',
  __getCompoundVariantCss__: checkboxFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: checkboxVariantKeys,
  variantMap: checkboxVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, checkboxVariantKeys)
  },
  getVariantProps: checkboxFn.getVariantProps,
})