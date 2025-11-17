import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const imageFn = /* @__PURE__ */ createRecipe('image', {}, [])

const imageVariantMap = {}

const imageVariantKeys = Object.keys(imageVariantMap)

export const image = /* @__PURE__ */ Object.assign(memo(imageFn.recipeFn), {
  __recipe__: true,
  __name__: 'image',
  __getCompoundVariantCss__: imageFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: imageVariantKeys,
  variantMap: imageVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, imageVariantKeys)
  },
  getVariantProps: imageFn.getVariantProps,
})