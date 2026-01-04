import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const actionBarDefaultVariants = {
  "size": "md"
}
const actionBarCompoundVariants = []

const actionBarSlotNames = [
  [
    "root",
    "action-bar__root"
  ],
  [
    "content",
    "action-bar__content"
  ],
  [
    "selectionTrigger",
    "action-bar__selectionTrigger"
  ],
  [
    "separator",
    "action-bar__separator"
  ],
  [
    "closeTrigger",
    "action-bar__closeTrigger"
  ]
]
const actionBarSlotFns = /* @__PURE__ */ actionBarSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, actionBarDefaultVariants, getSlotCompoundVariant(actionBarCompoundVariants, slotName))])

const actionBarFn = memo((props = {}) => {
  return Object.fromEntries(actionBarSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const actionBarVariantKeys = [
  "size"
]
const getVariantProps = (variants) => ({ ...actionBarDefaultVariants, ...compact(variants) })

export const actionBar = /* @__PURE__ */ Object.assign(actionBarFn, {
  __recipe__: false,
  __name__: 'actionBar',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: actionBarVariantKeys,
  variantMap: {
  "size": [
    "sm",
    "md",
    "lg"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, actionBarVariantKeys)
  },
  getVariantProps
})