---
name: dreamy-ui-ark-ui-migration
description: >-
  Migrate Dreamy UI registry components from custom @dreamy-ui/react hooks to
  Ark UI (@ark-ui/react) for behavior and accessibility, while keeping Dreamy
  recipes, compound APIs, and Motion-based transitions. Use when migrating a
  component to Ark UI, wrapping Ark primitives, or continuing the Ark rollout
  after the accordion pilot.
---

# Dreamy UI Ark UI migration

## Ark UI documentation (required)

At the **start of every** Ark migration task (and when debugging Ark wiring), fetch and read the current docs. Do not rely on model memory for APIs, anatomy, or props.

1. [https://ark-ui.com/llms.txt](https://ark-ui.com/llms.txt) — index, slugs, and links to per-page markdown (`https://ark-ui.com/llms.txt/{slug}`).
2. [https://ark-ui.com/llms-react.txt](https://ark-ui.com/llms-react.txt) — full React documentation (imports, compound parts, context hooks, controlled state).

Use `WebFetch` or an equivalent tool. When working on a specific component, also fetch `https://ark-ui.com/llms.txt/components/<name>` if you need a single focused page.

## Goal

Replace hand-rolled state, keyboard, and ARIA in `@dreamy-ui/react` with **Ark UI** (Zag). Keep Dreamy responsible for **visuals** (Panda slot recipes, tokens, compound part names) and **motion** (Dreamy `Collapse`, `Scale`, `MotionBox`, etc.).

**Progress:** update [MIGRATION-TRACKER.md](./MIGRATION-TRACKER.md) when a component moves to Ark (status, primitive import, popover composition, changelog date).

## Architecture

```
Consumer → Accordion.Root / Item / Trigger / Content (Dreamy compound names + Ark state props)
         → createStyleContext(recipe) on Ark parts
         → @ark-ui/react/<component> (behavior)
         → motion/react via components/transitions or components/motion (animation)
```

- **Do** import Ark in `components/<name>/index.tsx` only.
- **Do** add `@ark-ui/react` to [`components/package.json`](../../components/package.json). Registry build records npm deps from that file.
- **Do not** move Ark into `@dreamy-ui/react` unless exporting a thin re-export is explicitly requested.
- **Do not** put Panda style props on registry `.tsx` files. Use recipes and `data-*` selectors.

## Public API policy (Ark-aligned)

Migrated components must expose **Ark's state and callback names** on the public TypeScript surface. Do **not** add parallel Dreamy aliases (`isOpen`, `onOpen`, `onClose`, `defaultIsOpen`, `index` / `onChange` for tabs, etc.) or omit Ark props only to reintroduce legacy names.

| Concern | Use (Ark) | Do not add (legacy) |
|--------|-----------|---------------------|
| Open state | `open`, `defaultOpen`, `onOpenChange` | `isOpen`, `defaultIsOpen`, `onOpen`, `onClose` |
| Selection | `value`, `defaultValue`, `onValueChange` | Chakra-style `index`, `defaultIndex`, `onChange` |
| Dismiss / outside | `closeOnEscape`, `closeOnInteractOutside` | `closeOnEsc`, `closeOnBlur` |
| Focus return | `restoreFocus` | `returnFocusOnClose` |
| Disabled | `disabled` | `isDisabled` on Ark-backed roots |

**Allowed Dreamy-only props:** presentation and layering (`variant`, `size`, `positioning` as Dreamy `PositioningProps`, `usePortal`, `portalProps`, `reduceMotion`, `headingTag`, recipe variants). Map those to Ark or internal wiring; do not rename Ark state.

**Compound part names** stay Dreamy (`Accordion.Trigger`, `Select.Content`). **State props** on `Root` (and re-exported Ark roots) match [Ark React docs](https://ark-ui.com/llms-react.txt).

**Popover composition:** inner `Popover.Root` uses the same `open` / `onOpenChange` as the wrapping Ark root (Select, Menu, Combobox, DatePicker). One open state, Ark vocabulary end to end.

## Per-component workflow

1. Confirm Ark has the primitive using the required LLM docs above (or [Ark docs](https://ark-ui.com/docs/components)).
2. Map Dreamy compound parts to Ark anatomy (e.g. `Trigger` → `ItemTrigger`).
3. Extend `Ark*RootProps` on the Dreamy `Root` (minus only props you replace internally, e.g. Dreamy `positioning` shims). Pass `open`, `value`, `onValueChange`, etc. through unchanged.
4. Style with existing or updated `defineSlotRecipe` in `components/<name>/<name>.ts`.
5. Wire **motion** (see below).
6. Update tests, stories, `website/docs/5.components/<name>.mdx`, and `a11y.md` when present.
7. Run `pnpm components` (developer runs `components:watch` during active work).

Reference pilots: [`components/accordion/`](../../components/accordion/), [`components/popover/`](../../components/popover/) (shared floating layer for dropdown-style components).

## Popover composition (modular overlays)

Dreamy UI is **modular**: anything that opens a floating panel should **compose** [`components/popover/`](../../components/popover/), not re-implement portal, positioning, motion, or panel chrome.

| Component | Ark primitive (behavior) | Popover (floating layer) |
|-----------|--------------------------|---------------------------|
| Popover | `@ark-ui/react/popover` | self |
| Menu | `@ark-ui/react/menu` | `Popover.Root` / `Trigger` / `Content` |
| Select | `@ark-ui/react/select` | same |
| Autocomplete | `@ark-ui/react/combobox` | same |
| DatePicker / DateRangePicker | `@ark-ui/react/date-picker` | same |
| TimeInput | (field logic) | same |

**Pattern:**

1. **One open state** — single `open` / `defaultOpen` / `onOpenChange` on the Ark root; pass the **same** `open` and `onOpenChange` to `Popover.Root` (or read `open` from Ark context inside a small bridge). Never translate to `isOpen` on Popover.
2. **Ark** — listbox/combobox/menu semantics, items, typeahead, form integration. `portalled={false}` on Ark when it supports it; **no** Ark `positioning` when Popover positions the panel.
3. **`Popover.Root`** — wraps `{children}` inside the Ark root; Ark props `open`, `onOpenChange`, `lazyMount`, `closeOnEscape`, etc.; Dreamy extras: `positioning`, `portalProps`, `reduceMotion`.
4. **`Popover.Anchor`** — wraps the Ark trigger (or control) for positioning when Ark owns open/close and ARIA (`listbox`, `menu`). Use `Popover.Trigger` only when Popover is the sole opener (e.g. DatePicker trigger button). Nested: `Popover.Anchor` → `Ark*.Trigger asChild` → styled trigger.
5. **`Popover.Content`** — wraps Ark content only (no Ark `Positioner`, no duplicate `MotionBox`):
   ```tsx
   <Popover.Content motionProps={motionProps} rootProps={rootProps} {...contentProps}>
     <ArkSelect.Content>
       <ArkSelect.List>{items}</ArkSelect.List>
     </ArkSelect.Content>
   </Popover.Content>
   ```
6. **Recipes** — panel surface (bg, border, shadow, motion) comes from the **popover** recipe on `Popover.Content`. Component `content` slot adds list-only overrides (padding variants, `maxH`, `overflow`).

Do **not** copy portal/positioner/motion code into Select, Menu, Autocomplete, etc. Extend Popover when all overlays need a new capability.

Hover Card and Tooltip may use `Popover` with `trigger="hover"` when their UX matches; keep separate only when Ark anatomy or delays differ materially.

## Motion and reduced motion

**Default:** use Dreamy Motion wrappers, not raw CSS height keyframes, for expand/collapse and similar transitions.

| Pattern | Use |
|--------|-----|
| Height open/close | [`Collapse`](../../components/transitions/index.tsx) with `isOpen` driven from Ark context (e.g. `expanded`) |
| Scale / fade overlays | `Scale`, `MotionBox`, patterns from [`components/motion/`](../../components/motion/) |
| Variant presets | `useMotionVariants()` + `transformReducedMotion(variants, useReducedMotion())` from `@dreamy-ui/react` |

Rules:

1. **`Collapse` / `Scale`** call `useReducedMotion()` internally and apply `transformReducedMotion` on variants. Do **not** branch in component code to skip `Collapse` when reduced motion is on.
2. When **motion** is on, avoid fighting Ark: do not stack Ark CSS `--height` keyframe animations on the same node as `Collapse`. Pick Motion for height.
3. Set `hidden={false}` on `Ark*Content` when a motion child must stay mounted for exit transitions (accordion pattern below).
4. **Chevrons / indicators:** CSS `transition` on the recipe `icon` slot is fine; add `@media (prefers-reduced-motion: reduce)` to disable transform transitions when needed.
5. Re-expose **`collapseProps`** (or equivalent) on content parts when consumers need `unmountOnExit`, custom `transition`, etc.

Example content pattern (accordion):

```tsx
const { expanded } = useAccordionItemContext();

return (
  <ArkAccordion.ItemContent {...rest} hidden={false}>
    <Collapse isOpen={expanded} {...collapseProps}>
      <Body>{children}</Body>
    </Collapse>
  </ArkAccordion.ItemContent>
);
```

When motion is active, override Ark `hidden` on the motion node (`hidden={false}` on `MotionBox` when using `Content asChild`) so exit scale/fade can run while `unmountOnExit={false}` on the root. Do not unmount the floating layer early with `present` gates that skip `Positioner`/`Content`; that breaks labeling and arrow positioning.

**Popover-style overlays (Ark anatomy):**

- `portalled={false}` on the Ark root; wrap `Positioner` in Dreamy `Portal` (`zIndex`, nested stacking, `containerRef`).
- Optional: Ark `@ark-ui/react/portal` only portals to `document.body` and does not replace Dreamy layer ordering.
- Arrow: `Popover.Arrow` + `Popover.ArrowTip` (or the component’s equivalent) **inside** `Content`, not a custom popper-only div.
- Motion: `initial="exit"`, `animate={open ? "initial" : "exit"}`, `unmountOnExit={false}`, and `hidden={false}` on the motion node when `!reduceMotion` so Ark does not apply `hidden` before the exit transition finishes.

## API and breaking changes

- Adopting Ark on a component is a **breaking** change for any legacy Dreamy state names removed in favor of Ark (`open`, `value`, `onValueChange`, etc.). Document migrations in component MDX and changelog.
- Require stable string **`value`** on items when Ark does.
- Keep Dreamy-only presentation props (`headingTag`, custom `icon`, variants, sizes).

## Testing

- Keep APG-oriented tests: button/region, `aria-expanded`, keyboard, disabled items.
- For collapsed panels with **reduced motion**, assert `hidden` (or equivalent) on the content node.
- With **motion** enabled, assert behavior via user-visible state, not only CSS animation.

## Later candidates (Ark has primitives)

Autocomplete, avatar, checkbox, date picker, dialog (modal/drawer), editable, field, file upload, hover card, menu, pagination, pin input, popover, progress, radio, select, slider, stepper, switch, tabs, toast, tooltip.

Keep custom Dreamy implementations for presentational-only pieces (button, badge, layout primitives, etc.).

## Related skills

- [dreamy-ui-monorepo](../dreamy-ui-monorepo/SKILL.md) — registry layout, recipes, docs pipeline
- [dreamy-ui-frontend](../dreamy-ui-frontend/SKILL.md) — consumer JSX and tokens
- [accessibility](../accessibility/SKILL.md) — WCAG checks for migrated behavior
