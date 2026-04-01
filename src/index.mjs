/**
 * @michaelstingl/docusaurus-hub-content-calc
 *
 * Content calculation preprocessor for Docusaurus Hub.
 * Replaces {{key}} placeholders in markdown with computed values.
 */

export { fmt, fmtDec, rund, approx } from './format.mjs';
export { createPreprocessor } from './preprocessor.mjs';
