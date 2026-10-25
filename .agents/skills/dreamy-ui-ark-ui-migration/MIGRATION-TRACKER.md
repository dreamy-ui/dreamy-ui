# Ark UI migration tracker

Living checklist for moving Dreamy UI registry components from `@dreamy-ui/react` behavior hooks to [Ark UI](https://ark-ui.com/) (`@ark-ui/react`), while keeping Panda recipes, compound APIs, and Dreamy motion.

**How to mark progress**

| Status | Meaning |
|--------|---------|
| **Done** | `components/<name>/index.tsx` (or documented alias) imports Ark for primary behavior |
| **Pending** | Interactive component; Ark has a primitive; still on Dreamy hooks |
| **N/A** | Presentational, layout, or infra; no Ark migration planned |
| **Partial** | Ark wired but companion files or sub-parts still on legacy hooks (note in Notes) |

After a migration, set **Done**, note the Ark import path, and run `pnpm components` (or keep `components:watch` running). See [SKILL.md](./SKILL.md) for the full workflow.

**Last inventory:** 2026-10-22 (grep `@ark-ui/react` under `components/`)

---

## Summary

| Status | Count |
|--------|------:|
| Done | 22 |
| Pending | 11 |
| N/A | 36 |

---

## Migrated (Done)

| Component | Ark primitive | Notes |
|-----------|---------------|-------|
| [accordion](../../components/accordion/) | `@ark-ui/react/accordion` | Pilot; `Collapse` for motion |
| [autocomplete](../../components/autocomplete/) | `@ark-ui/react/combobox` | Composes [popover](../../components/popover/) |
| [avatar](../../components/avatar/) | `@ark-ui/react/avatar` | |
| [checkbox](../../components/checkbox/) | `@ark-ui/react/checkbox` | |
| [date-picker](../../components/date-picker/) | `@ark-ui/react/date-picker` | Composes popover; shared `ark-calendar.tsx` |
| [date-range-picker](../../components/date-range-picker/) | `@ark-ui/react/date-picker` | Composes popover |
| [dialog](../../components/dialog/) | (via modal) | Re-exports [modal](../../components/modal/) |
| [drawer](../../components/drawer/) | `@ark-ui/react/drawer` | |
| [editable](../../components/editable/) | `@ark-ui/react/editable` | |
| [hover-card](../../components/hover-card/) | `@ark-ui/react/hover-card` | |
| [menu](../../components/menu/) | `@ark-ui/react/menu` | Composes popover |
| [modal](../../components/modal/) | `@ark-ui/react/dialog` | |
| [popover](../../components/popover/) | `@ark-ui/react/popover` | Shared floating layer for dropdown-style UIs |
| [progress](../../components/progress/) | `@ark-ui/react/progress` | |
| [progress-circular](../../components/progress-circular/) | `@ark-ui/react/progress` | Same Ark primitive as linear progress |
| [radio](../../components/radio/) | `@ark-ui/react/radio-group` | |
| [range-slider](../../components/range-slider/) | `@ark-ui/react/slider` | |
| [select](../../components/select/) | `@ark-ui/react/select` | Composes popover |
| [slider](../../components/slider/) | `@ark-ui/react/slider` | |
| [switch](../../components/switch/) | `@ark-ui/react/switch` | |
| [tabs](../../components/tabs/) | `@ark-ui/react/tabs` | |
| [tooltip](../../components/tooltip/) | `@ark-ui/react/tooltip` | |

---

## Not migrated yet (Pending)

These still rely on `@dreamy-ui/react` hooks (or local context) for behavior. Ark exposes matching or related primitives.

| Component | Suggested Ark target | Notes |
|-----------|---------------------|-------|
| [action-bar](../../components/action-bar/) | TBD (may stay custom) | `useActionBar` |
| [checkbox-card](../../components/checkbox-card/) | Compose migrated [checkbox](../../components/checkbox/) | Still uses `useCheckbox` from `@dreamy-ui/react` |
| [field](../../components/field/) | `@ark-ui/react/field` | Form labeling / error wiring |
| [file-upload](../../components/file-upload/) | `@ark-ui/react/file-upload` | `useFileUpload` |
| [pagination](../../components/pagination/) | `@ark-ui/react/pagination` | `usePagination` |
| [pin-input](../../components/pin-input/) | `@ark-ui/react/pin-input` | `usePinInput` |
| [radio-card](../../components/radio-card/) | Compose migrated [radio](../../components/radio/) | `useRadioCardContext` / legacy card pattern |
| [stepper](../../components/stepper/) | `@ark-ui/react/steps` | `useStepper` |
| [time-input](../../components/time-input/) | Custom + popover | `useTimeInput`; compose [popover](../../components/popover/) per skill |
| [toast](../../components/toast/) | `@ark-ui/react/toast` | `useToast`; pairs with [toast-provider](../../components/toast-provider/) |
| [toast-provider](../../components/toast-provider/) | `@ark-ui/react/toast` | Provider / store layer |

---

## No Ark migration (N/A)

Styling, layout, simple markup, or shared utilities. Behavior stays in recipes, light helpers, or optional `@dreamy-ui/react` utilities (not full widget state machines).

| Component | Reason |
|-----------|--------|
| [alert](../../components/alert/) | Status / layout presentation |
| [badge](../../components/badge/) | Presentational |
| [box](../../components/box/) | Layout primitive |
| [breadcrumb](../../components/breadcrumb/) | Nav markup + light ARIA helpers |
| [button](../../components/button/) | Presentational + ripple |
| [card](../../components/card/) | Presentational |
| [close-button](../../components/close-button/) | Presentational |
| [divider](../../components/divider/) | Presentational |
| [empty-state](../../components/empty-state/) | Presentational |
| [fieldset](../../components/fieldset/) | Lightweight fieldset context |
| [flex](../../components/flex/) | Layout pattern |
| [grid](../../components/grid/) | Layout pattern |
| [group](../../components/group/) | Layout / styling wrapper |
| [heading](../../components/heading/) | Typography |
| [icon](../../components/icon/) | Icon wrapper / presentational |
| [icon-button](../../components/icon-button/) | Button variant |
| [image](../../components/image/) | Media + loading state |
| [input](../../components/input/) | Text input + `useField` integration |
| [kbd](../../components/kbd/) | Presentational |
| [link](../../components/link/) | Presentational |
| [list](../../components/list/) | List markup |
| [motion](../../components/motion/) | Motion primitives |
| [ripple](../../components/ripple/) | Visual effect |
| [skeleton](../../components/skeleton/) | Presentational |
| [snippet](../../components/snippet/) | Code display |
| [span](../../components/span/) | Typography |
| [spinner](../../components/spinner/) | Presentational |
| [stack](../../components/stack/) | Layout pattern |
| [stat](../../components/stat/) | Presentational |
| [table](../../components/table/) | Table layout slots |
| [text](../../components/text/) | Typography |
| [theme](../../components/theme/) | Theme provider |
| [transitions](../../components/transitions/) | `Collapse`, shared motion |
| [textarea](../../components/textarea/) | Textarea + `useField` integration |
| [visually-hidden](../../components/visually-hidden/) | A11y helper |
| [wrap](../../components/wrap/) | Layout pattern |

---

## Suggested migration order (optional)

Rough priority after popover-family work is largely done:

1. **Toast** + **toast-provider** (global patterns, isolated from form controls)
2. **Field** (unblocks consistent form integration across inputs)
3. **Pin input**, **pagination**, **file-upload**, **stepper**
4. **Time input** (popover composition + segments)
5. **Checkbox card** / **radio card** (thin wrappers over migrated checkbox / radio)
6. **Action bar** (evaluate whether Ark fits or stays custom)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-10-22 | Initial tracker from repo inventory |
| 2026-10-22 | Modal and Drawer public API aligned with Ark (`open`, `onOpenChange`, `restoreFocus`, `closeOnEscape`); docs and doc-site examples updated |
