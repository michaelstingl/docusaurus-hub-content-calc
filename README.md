# docusaurus-hub-content-calc

Content calculation preprocessor for [Docusaurus Hub](https://github.com/michaelstingl/docusaurus-hub) — replaces `{{key}}` placeholders in markdown with computed values.

## Install

```bash
bun add @michaelstingl/docusaurus-hub-content-calc@github:michaelstingl/docusaurus-hub-content-calc
```

## Usage

### 1. Create a calculation module

```js
// plugins/pricing.mjs
import { createFormatters } from '@michaelstingl/docusaurus-hub-content-calc';

const { fmt, fmtDec } = createFormatters('de-DE');

export const pathPattern = 'docs/pricing/';

export const values = {
  'pricing.base':   fmtDec(9.99),    // → "9,99"
  'pricing.annual': fmtDec(99.90),   // → "99,90"
  'pricing.users':  fmt(1500),       // → "1.500"
};
```

### 2. Wire up the preprocessor

```ts
// docusaurus.config.ts
import { createPreprocessor } from '@michaelstingl/docusaurus-hub-content-calc';
import * as pricing from './plugins/pricing.mjs';

const config = {
  markdown: {
    preprocessor: createPreprocessor([pricing]),
  },
};
```

### 3. Use placeholders in markdown

```markdown
The base plan costs **{{pricing.base}} €/month** ({{pricing.annual}} €/year).
Currently serving {{pricing.users}} users.
```

## Formatters

Locale-aware number formatters via `createFormatters(locale)`:

```js
const { fmt, fmtDec, rund, approx } = createFormatters('de-DE');
```

| Function | de-DE | en-US |
|----------|-------|-------|
| `fmt(18884)` | `"18.884"` | `"18,884"` |
| `fmtDec(49.9)` | `"49,90"` | `"49.90"` |
| `rund(18884)` | `"~19.000"` | `"~19,000"` |
| `approx(18884)` | `"~18.884"` | `"~18,884"` |

Default locale is `de-DE`. Pass any [BCP 47 locale string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).

## CalcModule interface

Each calculation module exports:

```ts
interface CalcModule {
  pathPattern: string;              // files matching this path are processed
  values: Record<string, string>;   // {{key}} → replacement value
}
```

## How it works

The `createPreprocessor()` factory returns a [Docusaurus markdown preprocessor](https://docusaurus.io/docs/markdown-features#preprocessor) that:

1. Checks each file's path against each module's `pathPattern`
2. Replaces `{{key}}` placeholders with values from matching modules
3. Leaves unmatched placeholders untouched

Only files whose path includes a module's `pathPattern` are processed, so unrelated docs have zero overhead.

## License

MIT
