/**
 * A calculation module that provides computed values for markdown placeholders.
 *
 * - pathPattern: only markdown files whose path includes this string are processed
 * - values: key-value map where keys match {{key}} placeholders in markdown
 */
export interface CalcModule {
  pathPattern: string;
  values: Record<string, string>;
}

/** Integer with thousand separators (de-DE): 18884 → "18.884" */
export function fmt(n: number): string;

/** Decimal with comma notation (de-DE): 49.90 → "49,90" */
export function fmtDec(n: number, decimals?: number): string;

/** Rounded to nearest 1000 with tilde: 18884 → "~19.000" */
export function rund(n: number): string;

/** Approximate with tilde prefix: 18884 → "~18.884" */
export function approx(n: number): string;

/**
 * Creates a Docusaurus markdown preprocessor that replaces {{key}} placeholders
 * with computed values from the provided calculation modules.
 */
export function createPreprocessor(
  modules: CalcModule[]
): (args: { fileContent: string; filePath: string }) => string;
