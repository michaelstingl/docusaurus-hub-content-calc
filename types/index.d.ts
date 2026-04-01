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

export interface Formatters {
  /** Integer with thousand separators: 18884 → "18.884" (de-DE) */
  fmt(n: number): string;
  /** Fixed decimal: 49.9 → "49,90" (de-DE) */
  fmtDec(n: number, decimals?: number): string;
  /** Rounded to nearest 1000 with tilde: 18884 → "~19.000" (de-DE) */
  rund(n: number): string;
  /** Approximate with tilde prefix: 18884 → "~18.884" (de-DE) */
  approx(n: number): string;
}

/**
 * Creates locale-aware number formatters for display-ready strings.
 * @param locale - BCP 47 locale string (default: 'de-DE')
 */
export function createFormatters(locale?: string): Formatters;

/**
 * Creates a Docusaurus markdown preprocessor that replaces {{key}} placeholders
 * with computed values from the provided calculation modules.
 */
export function createPreprocessor(
  modules: CalcModule[]
): (args: { fileContent: string; filePath: string }) => string;
