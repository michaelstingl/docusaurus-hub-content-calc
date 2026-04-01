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

/**
 * Auto-discover calc modules in a directory.
 * Scans for .mjs files that export pathPattern and values.
 * Returns empty array if directory doesn't exist or contains no valid modules.
 * @param dir - Path to scan (relative to cwd or absolute)
 */
export function discoverModules(dir: string): Promise<CalcModule[]>;

/**
 * Auto-discover modules and create a preprocessor.
 * Returns undefined if no modules found — safe to pass directly to Docusaurus config.
 * @param dir - Path to scan (relative to cwd or absolute)
 */
export function createAutoPreprocessor(
  dir: string
): Promise<((args: { fileContent: string; filePath: string }) => string) | undefined>;
