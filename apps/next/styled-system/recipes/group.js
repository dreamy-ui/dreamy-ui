import { memo, splitProps } from '../helpers.js';
import { createRecipe, mergeRecipes } from './create-recipe.js';

const groupFn = /* @__PURE__ */ createRecipe('group', {
  "orientation": "horizontal",
  "attached": false
}, [
  {
    "orientation": "horizontal",
    "attached": true,
    "css": {
      "& > *[data-first]": {
        "borderEndRadius": "0!"
      },
      "& > *[data-between]": {
        "borderRadius": "0!",
        "marginStart": "-1px"
      },
      "& > *[data-last]": {
        "borderStartRadius": "0!",
        "marginStart": "-1px"
      }
    }
  },
  {
    "orientation": "vertical",
    "attached": true,
    "css": {
      "& > *[data-first]": {
        "borderBottomRadius": "0!"
      },
      "& > *[data-between]": {
        "borderRadius": "0!",
        "marginBottom": "-0.5px"
      },
      "& > *[data-last]": {
        "borderTopRadius": "0!",
        "marginBottom": "-0.5px"
      }
    }
  }
])

const groupVariantMap = {
  "orientation": [
    "horizontal",
    "vertical"
  ],
  "attached": [
    "true",
    "false"
  ],
  "grow": [
    "true"
  ],
  "stacking": [
    "first-on-top",
    "last-on-top"
  ]
}

const groupVariantKeys = Object.keys(groupVariantMap)

export const group = /* @__PURE__ */ Object.assign(memo(groupFn.recipeFn), {
  __recipe__: true,
  __name__: 'group',
  __getCompoundVariantCss__: groupFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: groupVariantKeys,
  variantMap: groupVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, groupVariantKeys)
  },
  getVariantProps: groupFn.getVariantProps,
})