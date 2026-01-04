import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const rangeSliderDefaultVariants = {
  "scheme": "primary"
}
const rangeSliderCompoundVariants = []

const rangeSliderSlotNames = [
  [
    "root",
    "rangeSlider__root"
  ],
  [
    "track",
    "rangeSlider__track"
  ],
  [
    "trackFilled",
    "rangeSlider__trackFilled"
  ],
  [
    "thumb",
    "rangeSlider__thumb"
  ],
  [
    "marker",
    "rangeSlider__marker"
  ]
]
const rangeSliderSlotFns = /* @__PURE__ */ rangeSliderSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, rangeSliderDefaultVariants, getSlotCompoundVariant(rangeSliderCompoundVariants, slotName))])

const rangeSliderFn = memo((props = {}) => {
  return Object.fromEntries(rangeSliderSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const rangeSliderVariantKeys = [
  "scheme"
]
const getVariantProps = (variants) => ({ ...rangeSliderDefaultVariants, ...compact(variants) })

export const rangeSlider = /* @__PURE__ */ Object.assign(rangeSliderFn, {
  __recipe__: false,
  __name__: 'rangeSlider',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: rangeSliderVariantKeys,
  variantMap: {
  "scheme": [
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
    return splitProps(props, rangeSliderVariantKeys)
  },
  getVariantProps
})