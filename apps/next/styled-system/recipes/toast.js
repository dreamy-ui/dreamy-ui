import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const toastFn = /* @__PURE__ */ createRecipe('toast', {}, [])

const toastVariantMap = {}

const toastVariantKeys = Object.keys(toastVariantMap)

export const toast = /* @__PURE__ */ Object.assign(memo(toastFn.recipeFn), {
  __recipe__: true,
  __name__: 'toast',
  __getCompoundVariantCss__: toastFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: toastVariantKeys,
  variantMap: toastVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, toastVariantKeys)
  },
  getVariantProps: toastFn.getVariantProps,
})