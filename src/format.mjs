/**
 * German-locale number formatters for content calculation modules.
 *
 * These produce display-ready strings for markdown placeholders.
 */

/** Integer with thousand separators: 18884 → "18.884" */
export function fmt(n) {
  return n.toLocaleString('de-DE');
}

/** Decimal with comma notation: 49.90 → "49,90" */
export function fmtDec(n, decimals = 2) {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Rounded to nearest 1000 with tilde: 18884 → "~19.000" */
export function rund(n) {
  return '~' + fmt(Math.round(n / 1000) * 1000);
}

/** Approximate with tilde prefix: 18884 → "~18.884" */
export function approx(n) {
  return '~' + fmt(n);
}
