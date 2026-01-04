import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const fieldFn = /* @__PURE__ */ createRecipe('field', {
  "orientation": "vertical"
}, [])

const fieldVariantMap = {
  "orientation": [
    "vertical",
    "horizontal"
  ]
}

const fieldVariantKeys = Object.keys(fieldVariantMap)

export const field = /* @__PURE__ */ Object.assign(memo(fieldFn.recipeFn), {
  __recipe__: true,
  __name__: 'field',
  __getCompoundVariantCss__: fieldFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: fieldVariantKeys,
  variantMap: fieldVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, fieldVariantKeys)
  },
  getVariantProps: fieldFn.getVariantProps,
})