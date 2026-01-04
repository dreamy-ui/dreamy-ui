import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const alertFn = /* @__PURE__ */ createRecipe('alert', {
  "variant": "subtle"
}, [])

const alertVariantMap = {
  "variant": [
    "subtle",
    "outline"
  ]
}

const alertVariantKeys = Object.keys(alertVariantMap)

export const alert = /* @__PURE__ */ Object.assign(memo(alertFn.recipeFn), {
  __recipe__: true,
  __name__: 'alert',
  __getCompoundVariantCss__: alertFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: alertVariantKeys,
  variantMap: alertVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, alertVariantKeys)
  },
  getVariantProps: alertFn.getVariantProps,
})