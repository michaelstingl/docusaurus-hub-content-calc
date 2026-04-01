/**
 * @michaelstingl/docusaurus-hub-content-calc
 *
 * Content calculation preprocessor for Docusaurus Hub.
 * Replaces {{key}} placeholders in markdown with computed values.
 */

export { createFormatters } from './format.mjs';
export { createPreprocessor } from './preprocessor.mjs';
export { discoverModules, createAutoPreprocessor } from './discover.mjs';
