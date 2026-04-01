/**
 * Locale-aware number formatters for content calculation modules.
 *
 * Use createFormatters() with your target locale to get
 * display-ready string formatters for markdown placeholders.
 *
 * @param {string} [locale='de-DE'] - BCP 47 locale string
 */
export function createFormatters(locale = 'de-DE') {
  /** Integer with thousand separators: 18884 → "18.884" (de-DE) */
  function fmt(n) {
    return n.toLocaleString(locale);
  }

  /** Fixed decimal: 49.9 → "49,90" (de-DE) */
  function fmtDec(n, decimals = 2) {
    return n.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /** Rounded to nearest 1000 with tilde: 18884 → "~19.000" (de-DE) */
  function rund(n) {
    return '~' + fmt(Math.round(n / 1000) * 1000);
  }

  /** Approximate with tilde prefix: 18884 → "~18.884" (de-DE) */
  function approx(n) {
    return '~' + fmt(n);
  }

  return { fmt, fmtDec, rund, approx };
}
