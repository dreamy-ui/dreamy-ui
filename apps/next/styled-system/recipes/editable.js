import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const editableDefaultVariants = {}
const editableCompoundVariants = []

const editableSlotNames = [
  [
    "root",
    "editable__root"
  ],
  [
    "preview",
    "editable__preview"
  ],
  [
    "input",
    "editable__input"
  ],
  [
    "editButton",
    "editable__editButton"
  ],
  [
    "submitButton",
    "editable__submitButton"
  ],
  [
    "cancelButton",
    "editable__cancelButton"
  ]
]
const editableSlotFns = /* @__PURE__ */ editableSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, editableDefaultVariants, getSlotCompoundVariant(editableCompoundVariants, slotName))])

const editableFn = memo((props = {}) => {
  return Object.fromEntries(editableSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const editableVariantKeys = []
const getVariantProps = (variants) => ({ ...editableDefaultVariants, ...compact(variants) })

export const editable = /* @__PURE__ */ Object.assign(editableFn, {
  __recipe__: false,
  __name__: 'editable',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: editableVariantKeys,
  variantMap: {},
  splitVariantProps(props) {
    return splitProps(props, editableVariantKeys)
  },
  getVariantProps
})