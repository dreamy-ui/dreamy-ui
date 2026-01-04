import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.js';
import { createRecipe } from './create-recipe.js';

const tableDefaultVariants = {
  "variant": "simple",
  "size": "md"
}
const tableCompoundVariants = [
  {
    "withBackground": true,
    "size": "sm",
    "css": {
      "root": {
        "p": 2
      }
    }
  },
  {
    "withBackground": true,
    "size": "md",
    "css": {
      "root": {
        "p": 3
      }
    }
  },
  {
    "withBackground": true,
    "size": "lg",
    "css": {
      "root": {
        "p": 4
      }
    }
  },
  {
    "variant": "simple",
    "striped": true,
    "css": {
      "cell": {
        "_first": {
          "borderStartStartRadius": "l2",
          "borderEndStartRadius": "l2"
        },
        "_last": {
          "borderEndEndRadius": "l2",
          "borderStartEndRadius": "l2"
        }
      }
    }
  }
]

const tableSlotNames = [
  [
    "root",
    "table__root"
  ],
  [
    "table",
    "table__table"
  ],
  [
    "body",
    "table__body"
  ],
  [
    "header",
    "table__header"
  ],
  [
    "row",
    "table__row"
  ],
  [
    "cell",
    "table__cell"
  ],
  [
    "columnHeader",
    "table__columnHeader"
  ],
  [
    "caption",
    "table__caption"
  ]
]
const tableSlotFns = /* @__PURE__ */ tableSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, tableDefaultVariants, getSlotCompoundVariant(tableCompoundVariants, slotName))])

const tableFn = memo((props = {}) => {
  return Object.fromEntries(tableSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const tableVariantKeys = [
  "interactive",
  "striped",
  "showColumnBorder",
  "withBackground",
  "variant",
  "size",
  "scheme"
]
const getVariantProps = (variants) => ({ ...tableDefaultVariants, ...compact(variants) })

export const table = /* @__PURE__ */ Object.assign(tableFn, {
  __recipe__: false,
  __name__: 'table',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: tableVariantKeys,
  variantMap: {
  "interactive": [
    "true"
  ],
  "striped": [
    "true"
  ],
  "showColumnBorder": [
    "true"
  ],
  "withBackground": [
    "true"
  ],
  "variant": [
    "simple",
    "line"
  ],
  "size": [
    "sm",
    "md",
    "lg"
  ],
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
    return splitProps(props, tableVariantKeys)
  },
  getVariantProps
})