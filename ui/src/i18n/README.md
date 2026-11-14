# UI localization

Paperclip uses two complementary localization paths:

1. New and frequently edited UI should use keyed `i18next` messages from
   `locales/en.json` and `locales/zh-CN.json`.
2. Existing literal-heavy screens are covered by `LegacyLiteralLocalizer` and
   the source-to-Chinese catalogs in `legacy-zh-CN.json` and
   `legacy-zh-CN.overrides.json`. This preserves existing component structure
   while those screens migrate incrementally to keyed messages.

The legacy localizer only replaces exact phrases discovered in source. It also
supports numbered `{{value1}}` templates for dynamic labels. It deliberately
skips Markdown, code, editable content, and elements marked `data-i18n-skip` so
user-authored text is never translated.

## Updating copy

Run `node scripts/audit-ui-i18n.mjs` from the repository root to locate source
literals (add `--json` for machine-readable output). Add normal product copy to the
keyed locale files when practical. On the `zh-cn` maintenance branch, add literal
translations and terminology corrections to `legacy-zh-CN.overrides.json`; keep
the generated or bulk-imported `legacy-zh-CN.json` unchanged. Overrides win over
base entries. Existing keyed Chinese messages belong in `locales/zh-CN.json`;
update English only when adding a key.

For templates containing grammatical interpolations such as `task`/`tasks`, add
the resolved singular and plural phrases rather than preserving English grammar
as a placeholder. The runtime matcher prefers templates with more fixed text;
these variants can still appear as uncovered generic templates in the static
audit. Preserve every placeholder in each resolved phrase.

The build transform (`ui/vite-static-i18n.ts`) only wraps JSX text, the
translatable JSX attributes, literals rendered directly in JSX expressions, and
user-feedback calls. It never rewrites object properties or parameter defaults
(for example `{ label: "Recent Runs" }` passed to a tab bar), because those
values are often compared in code or sent to the API. Translate such labels
where they are defined or rendered with `t()` or `translateUiLiteral()`.

Before committing, run from the repository root:

```sh
node scripts/audit-ui-i18n.mjs --check
pnpm --filter @paperclipai/ui typecheck
pnpm --filter @paperclipai/ui build
```

`--check` scans production TypeScript/TSX files, fails on uncovered phrases that
the build transform or an explicit `translateUiLiteral()` call renders, and
verifies that dynamic placeholders are preserved exactly.
