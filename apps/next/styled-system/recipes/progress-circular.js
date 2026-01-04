import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const progressCircularFn = /* @__PURE__ */ createRecipe('progress-circular', {
  "size": "md",
  "scheme": "primary"
}, [])

const progressCircularVariantMap = {
  "size": [
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
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

const progressCircularVariantKeys = Object.keys(progressCircularVariantMap)

export const progressCircular = /* @__PURE__ */ Object.assign(memo(progressCircularFn.recipeFn), {
  __recipe__: true,
  __name__: 'progressCircular',
  __getCompoundVariantCss__: progressCircularFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: progressCircularVariantKeys,
  variantMap: progressCircularVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, progressCircularVariantKeys)
  },
  getVariantProps: progressCircularFn.getVariantProps,
})