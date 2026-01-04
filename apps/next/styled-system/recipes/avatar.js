import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const avatarFn = /* @__PURE__ */ createRecipe('avatar', {
  "size": "md"
}, [])

const avatarVariantMap = {
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "showBorder": [
    "true"
  ]
}

const avatarVariantKeys = Object.keys(avatarVariantMap)

export const avatar = /* @__PURE__ */ Object.assign(memo(avatarFn.recipeFn), {
  __recipe__: true,
  __name__: 'avatar',
  __getCompoundVariantCss__: avatarFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: avatarVariantKeys,
  variantMap: avatarVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, avatarVariantKeys)
  },
  getVariantProps: avatarFn.getVariantProps,
})