import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const progressFn = /* @__PURE__ */ createRecipe('progress', {
  "size": "md",
  "scheme": "primary"
}, [])

const progressVariantMap = {
  "isIndeterminate": [
    "true"
  ],
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

const progressVariantKeys = Object.keys(progressVariantMap)

export const progress = /* @__PURE__ */ Object.assign(memo(progressFn.recipeFn), {
  __recipe__: true,
  __name__: 'progress',
  __getCompoundVariantCss__: progressFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: progressVariantKeys,
  variantMap: progressVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, progressVariantKeys)
  },
  getVariantProps: progressFn.getVariantProps,
})