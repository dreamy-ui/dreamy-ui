import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const inputFn = /* @__PURE__ */ createRecipe('input', {
  "size": "md",
  "variant": "outline"
}, [
  {
    "size": "sm",
    "inputType": "pin",
    "css": {
      "fontSize": "xs"
    }
  },
  {
    "size": "md",
    "inputType": "pin",
    "css": {
      "fontSize": "sm"
    }
  },
  {
    "size": "lg",
    "inputType": "pin",
    "css": {
      "fontSize": "md"
    }
  }
])

const inputVariantMap = {
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "variant": [
    "outline",
    "filled",
    "flushed",
    "filledOutline"
  ],
  "inputType": [
    "pin",
    "default"
  ]
}

const inputVariantKeys = Object.keys(inputVariantMap)

export const input = /* @__PURE__ */ Object.assign(memo(inputFn.recipeFn), {
  __recipe__: true,
  __name__: 'input',
  __getCompoundVariantCss__: inputFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: inputVariantKeys,
  variantMap: inputVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, inputVariantKeys)
  },
  getVariantProps: inputFn.getVariantProps,
})