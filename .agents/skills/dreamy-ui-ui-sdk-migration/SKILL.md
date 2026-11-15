---
name: dreamy-ui-ui-sdk-migration
description: >-
  Migrate Dreamy UI registry components from Ark UI and custom @dreamy-ui/react
  behavior hooks to UI SDK (@ui-sdk/react and @ui-sdk/core), while preserving
  Dreamy compound APIs, Panda recipes, semantic tokens, generated registry
  output, and Motion transitions. Use when migrating a component to UI SDK,
  wrapping UI SDK parts, building a Dreamy component with @ui-sdk/core, or
  validating component behavior in Storybook/Playwright.
---

# Dreamy UI UI SDK migration

## Goal

Dreamy UI is the styled component layer. **UI SDK is the behavior and accessibility layer.**

```
Consumer → Dreamy compound API (Select.Root, Select.Trigger, ...)
         → Panda recipe / semantic tokens / Motion
         → @ui-sdk/react/<component> or @ui-sdk/core primitive
         → accessible DOM, ARIA, keyboard, focus, forms, popups
```

Do not hand-roll behavior that UI SDK already provides. Do not replace Dreamy styling with UI SDK's optional `web.css`.

## Required reading

At the start of every UI SDK migration task:

1. Read the installed docs index: `components/node_modules/@ui-sdk/react/docs/llms.txt`.
2. Read only the component page needed, e.g. `components/node_modules/@ui-sdk/react/docs/components/select.md`.
3. For a Dreamy component without a direct UI SDK React component, read `components/node_modules/@ui-sdk/core/docs/core.md` and the relevant behavior docs.
4. The generic UI SDK agent skill ships at `components/node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`; use it for primitive composition and testing patterns.
5. Read `website/docs/7.migration/1.ui-sdk-migration.mdx` and `website/docs/7.migration/2.component-coverage.mdx` for the roadmap and coverage matrix.

UI SDK `0.1.0-beta.1` is pinned in `components/package.json` and `website/package.json`. APIs may change; do not upgrade casually.

## Repository layout (current)

- `components/<name>/index.tsx` — registry component source. This is the file the website/registry consumes.
- `components/<name>/<name>.ts` — colocated Panda recipe or pattern for that component.
- `components/<name>/<name>.stories.tsx`, `*.test.tsx`, `*.test-d.tsx` — colocated coverage.
- `components/<name>/a11y.md` — component accessibility notes when present.
- `website/components/`, `website/recipes/`, `website/patterns/`, `website/public/**` — generated output. Never edit directly.
- `website/stories/` — website-level Storybook stories, including cross-component and portal stories.
- `website/tests/e2e/` — Playwright tests that run against Storybook on `http://localhost:6006`.

## Public API policy

Use **UI SDK-native state and event props**. Do not introduce Dreamy aliases for behavior state.

| Concern | Use | Do not add |
| --- | --- | --- |
| Open state | `open`, `defaultOpen`, `onOpenChange` | `isOpen`, `defaultIsOpen`, `onOpen`, `onClose` |
| Selection/value | `value`, `defaultValue`, `onValueChange` | `onChangeValue`, Chakra-style `index`/`onChange` for selection |
| Toggle state | `checked`, `defaultChecked`, `onCheckedChange` | `isChecked`, `isIndeterminate` as public aliases when UI SDK supports `"indeterminate"` |
| Pressed state | `pressed`, `defaultPressed`, `onPressedChange` | `isSelected` for toggle-like state |
| Disabled/read-only/required | `disabled`, `readOnly`, `required`, `name`, `form`, `value` | `isDisabled`, `isReadOnly`, `isRequired` on migrated roots |

Dreamy-only **presentation** props may remain (`size`, `variant`, `scheme`, `triggerVariant`, `positioning`, custom icons, `headingTag`, motion/reduce-motion options). Map them to UI SDK parts or CSS; never rename UI SDK state props back to Dreamy names.

Breaking API changes must be reflected in:

- the component implementation,
- `*.test-d.tsx` type assertions,
- `*.stories.tsx` examples,
- `website/docs/5.components/<name>.mdx`,
- the migration docs if the component is a pilot or has special migration notes.

## Composition rules

1. **Direct UI SDK component first.** If `@ui-sdk/react/<entry>` ships the behavior, wrap its parts and style them with Dreamy recipes.
2. **Build on lower-level components.** Select/Autocomplete/Menu/DatePicker/Popover-style components must compose shared UI SDK popup/list/selection behavior instead of duplicating overlay logic.
3. **Use `@ui-sdk/core` for Dreamy-only behavior.** Examples: Action Bar, Stepper, Editable if no direct component fits, card variants that need custom composition.
4. **Static components stay Panda-only.** Card, Table, Empty State, layout primitives, typography, icons, skeletons, badges, alerts, etc. do not need UI SDK unless they contain real interactive behavior.
5. **Preserve Dreamy compound names.** `Select.Root`, `Select.Trigger`, `Select.Content`, etc. remain the public API even when the implementation delegates to UI SDK parts.
6. **Use `render` for element changes.** Do not invent an `as` prop. UI SDK parts accept `render`, `className`, `style`, refs, and state-aware children.

## Styling rules

- UI SDK parts render `data-slot` and state attributes such as `data-open`, `data-pressed`, `data-checked`, `data-disabled`, `data-readonly`, `data-required`, `data-selected`, `data-invalid`, `data-indeterminate`.
- Update Dreamy recipes to target UI SDK `data-slot`/state attributes where the old Ark selectors no longer match.
- Keep visual styling in the colocated recipe/pattern file. Component `.tsx` files should wire behavior, composition, and slots — not Panda style props.
- Keep Motion for Dreamy-specific transitions, but do not fight UI SDK popup mount/exit behavior. Prefer UI SDK's state attributes and mount behavior for overlays.
- UI SDK popups use top-layer behavior. Do not wrap them in Dreamy `Portal` unless a specific stacking requirement remains; document any exception.

## Per-component workflow

1. Identify the UI SDK entry from `website/docs/7.migration/2.component-coverage.mdx` and the installed docs.
2. Replace Ark/custom behavior imports with `@ui-sdk/react/<entry>` or `@ui-sdk/core/<behavior>`.
3. Preserve Dreamy compound exports and recipe slots.
4. Remove legacy state/event props from the public TypeScript surface and update type tests so old names are rejected.
5. Update stories for all meaningful states: default, controlled, disabled, read-only, invalid, open/closed, selected/checked, loading, reduced motion.
6. Update docs MDX examples to UI SDK-native props.
7. Run `bun --filter @dreamy-ui/registry typecheck` and `bun --filter @dreamy-ui/registry test`.
8. Run `bun run components` to regenerate registry JSON. Do not edit `website/components`, `website/recipes`, `website/patterns`, or `website/public` manually.
9. Validate in Storybook/Playwright using `website/tests/e2e/storybook.ts` helpers and the component's story id.

## Validation

Storybook is the fast inspection surface; Playwright is the regression layer.

- Storybook: `cd website && bun run story` → `http://localhost:6006`.
- Playwright: `cd website && bun run test:e2e` (starts Storybook automatically via `playwright.config.ts`).
- Story iframe URL pattern: `/iframe.html?id=<story-id>&viewMode=story`.
- Prefer semantic queries (`getByRole`, `getByLabel`, `getByText`) and UI SDK `data-slot`/state attributes over brittle DOM paths.
- For every interactive component, verify rendered HTML/state for at least: default, controlled value, disabled, open/selected/checked state, keyboard operation, and form participation where applicable.

## Package manager

Use Bun for installs and scripts in this repository: `bun install`, `bun add`, `bun run`, `bun --filter`, `bunx`. `bun.lock` is the lockfile of record. Do not introduce pnpm/npm/yarn commands into docs, scripts, or agent workflows.

## Common mistakes

- Reintroducing `isChecked`, `isOpen`, `onChangeValue`, or similar aliases.
- Styling UI SDK internals with generated ids or fragile DOM selectors.
- Copying popup positioning/portal logic into every overlay component.
- Editing generated `website/components/**` instead of `components/**`.
- Treating UI SDK `web.css` as Dreamy's theme; Dreamy recipes/tokens remain authoritative.
- Leaving Ark imports after a component is marked migrated.
