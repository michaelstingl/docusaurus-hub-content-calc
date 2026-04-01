/**
 * Auto-discovery for calculation modules.
 *
 * Scans a directory for .mjs files that export pathPattern + values,
 * and optionally creates a preprocessor from them.
 *
 * Graceful degradation:
 * - Directory doesn't exist → empty array
 * - Directory is empty → empty array
 * - Module fails to load → warning + skip
 * - No valid modules → createAutoPreprocessor returns undefined
 */

import { readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { pathToFileURL } from 'url';
import { createPreprocessor } from './preprocessor.mjs';

/**
 * Discover calc modules in a directory.
 * @param {string} dir - Path to scan (relative to cwd or absolute)
 * @returns {Promise<Array<{ pathPattern: string, values: Record<string, string> }>>}
 */
export async function discoverModules(dir) {
  const absDir = resolve(dir);

  if (!existsSync(absDir)) return [];

  const files = readdirSync(absDir).filter(f => f.endsWith('.mjs'));
  const modules = [];

  for (const file of files) {
    try {
      const mod = await import(pathToFileURL(join(absDir, file)).href);
      if (mod.pathPattern && mod.values) {
        modules.push({ pathPattern: mod.pathPattern, values: mod.values });
      }
    } catch (err) {
      console.warn(`⚠️  content-calc: skipping ${file}: ${err.message}`);
    }
  }

  if (modules.length > 0) {
    console.log(`ℹ️  content-calc: loaded ${modules.length} module(s) from ${dir}`);
  }

  return modules;
}

/**
 * Auto-discover modules and create a preprocessor.
 * Returns undefined if no modules found (safe to pass to Docusaurus config).
 * @param {string} dir - Path to scan
 * @returns {Promise<((args: { fileContent: string, filePath: string }) => string) | undefined>}
 */
export async function createAutoPreprocessor(dir) {
  const modules = await discoverModules(dir);
  if (modules.length === 0) return undefined;
  return createPreprocessor(modules);
}
