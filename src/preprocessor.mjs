/**
 * Docusaurus markdown preprocessor factory.
 *
 * Creates a preprocessor function that replaces {{key}} placeholders
 * with computed values from one or more calculation modules.
 *
 * Each module must export:
 *   - pathPattern (string): only files whose path includes this string are processed
 *   - values (Record<string, string>): key-value map for placeholder replacement
 */

const PLACEHOLDER = /\{\{([\w.]+)\}\}/g;

/**
 * @param {Array<{ pathPattern: string, values: Record<string, string> }>} modules
 * @returns {(args: { fileContent: string, filePath: string }) => string}
 */
export function createPreprocessor(modules) {
  return ({ fileContent, filePath }) => {
    for (const mod of modules) {
      if (!filePath.includes(mod.pathPattern)) continue;
      fileContent = fileContent.replace(PLACEHOLDER, (match, key) =>
        key in mod.values ? mod.values[key] : match
      );
    }
    return fileContent;
  };
}
