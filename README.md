# docusaurus-hub-content-calc

Content calculation preprocessor for [Docusaurus Hub](https://github.com/michaelstingl/docusaurus-hub) — replaces `{{key}}` placeholders in markdown with computed values.

## Install

```bash
bun add @michaelstingl/docusaurus-hub-content-calc@github:michaelstingl/docusaurus-hub-content-calc
```

## Quick Start (Auto-Discovery)

### 1. Create a calculation module

Drop a `.mjs` file into `plugins/calc/`:

```js
// plugins/calc/pricing.mjs
import { createFormatters } from '@michaelstingl/docusaurus-hub-content-calc';

const { fmt, fmtDec } = createFormatters('en-US');

export const pathPattern = 'content/docs/';

export const values = {
  'pricing.base':   fmtDec(9.99),    // → "9.99"
  'pricing.annual': fmtDec(99.90),   // → "99.90"
  'pricing.users':  fmt(1500),       // → "1,500"
};
```

### 2. Wire up auto-discovery (once)

```ts
// docusaurus.config.ts
export default async function createConfigAsync() {
  const { createAutoPreprocessor } = await import(
    '@michaelstingl/docusaurus-hub-content-calc'
  );
  const preprocessor = await createAutoPreprocessor('./plugins/calc');

  return {
    markdown: {
      preprocessor,  // undefined if no modules found
    },
    // ...
  };
};
```

### 3. Use placeholders in markdown

```markdown
The base plan costs **{{pricing.base}} €/month** ({{pricing.annual}} €/year).
Currently serving {{pricing.users}} users.
```

**That's it.** Add more modules by dropping files into `plugins/calc/` — no config changes needed.

## Graceful Degradation

| Scenario | Behavior |
|----------|----------|
| `plugins/calc/` doesn't exist | No preprocessing, no error |
| `plugins/calc/` is empty | No preprocessing, no error |
| A module fails to load | Warning logged, module skipped |
| Package not installed | `import()` fails silently in async config |

## Manual Setup

For explicit control, use `createPreprocessor()` directly:

```ts
import { createPreprocessor } from '@michaelstingl/docusaurus-hub-content-calc';
import * as pricing from './plugins/calc/pricing.mjs';

const config = {
  markdown: {
    preprocessor: createPreprocessor([pricing]),
  },
};
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

## CalcModule Interface

Each calculation module exports:

```ts
export const pathPattern: string;              // files matching this path are processed
export const values: Record<string, string>;   // {{key}} → replacement value
```

## API

| Export | Description |
|--------|-------------|
| `createAutoPreprocessor(dir)` | Auto-discover modules + create preprocessor. Returns `undefined` if empty. |
| `discoverModules(dir)` | Scan directory, return array of `CalcModule`. |
| `createPreprocessor(modules)` | Create preprocessor from explicit module array. |
| `createFormatters(locale?)` | Create locale-bound number formatters. |

## License

MIT
