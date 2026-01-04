import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const selectDefaultVariants = {
  "size": "md",
  "variant": "outline",
  "selectedItemBackgroundScheme": "primary"
}
const selectCompoundVariants = []

const selectSlotNames = [
  [
    "root",
    "select__root"
  ],
  [
    "trigger",
    "select__trigger"
  ],
  [
    "indicatorGroup",
    "select__indicatorGroup"
  ],
  [
    "indicator",
    "select__indicator"
  ],
  [
    "clearButton",
    "select__clearButton"
  ],
  [
    "content",
    "select__content"
  ],
  [
    "item",
    "select__item"
  ],
  [
    "itemIndicator",
    "select__itemIndicator"
  ],
  [
    "control",
    "select__control"
  ]
]
const selectSlotFns = /* @__PURE__ */ selectSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, selectDefaultVariants, getSlotCompoundVariant(selectCompoundVariants, slotName))])

const selectFn = memo((props = {}) => {
  return Object.fromEntries(selectSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const selectVariantKeys = [
  "variant",
  "size",
  "selectedItemBackgroundScheme"
]
const getVariantProps = (variants) => ({ ...selectDefaultVariants, ...compact(variants) })

export const select = /* @__PURE__ */ Object.assign(selectFn, {
  __recipe__: false,
  __name__: 'select',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: selectVariantKeys,
  variantMap: {
  "variant": [
    "outline",
    "solid"
  ],
  "size": [
    "xs",
    "sm",
    "md",
    "lg"
  ],
  "selectedItemBackgroundScheme": [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "none"
  ]
},
  splitVariantProps(props) {
    return splitProps(props, selectVariantKeys)
  },
  getVariantProps
})