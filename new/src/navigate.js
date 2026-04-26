/**
 * URL resolver for onInputEntered.
 *
 * Given the final omnibox text (either raw typed text or the `content`
 * field of a selected suggestion), returns the best GitHub URL to open.
 *
 * Falls back to a GitHub search when the input cannot be parsed as a
 * known command — so pressing Enter is always useful.
 */

import { DEFAULT_BASE } from './commands.js';

/**
 * Resolve typed/selected omnibox text to a GitHub URL.
 *
 * @param {string}   text     - text from onInputEntered
 * @param {object[]} commands - COMMANDS array from commands.js (or makeCommands(gheBase))
 * @param {string}   [baseUrl]  - GitHub base URL, defaults to https://github.com
 * @returns {string} destination URL
 */
export function resolve(text, commands, baseUrl = DEFAULT_BASE) {
  const parts = text.trim().split(/\s+/).filter(Boolean);

  // Empty → GitHub home
  if (parts.length === 0) return baseUrl;

  const [cmdName, subcmdName, ...args] = parts;
  const command = commands.find(c => c.name === cmdName);

  // Looks like an owner/repo shorthand (e.g. "facebook/react")
  if (!command && /^[^/]+\/[^/]+$/.test(cmdName)) {
    return `${baseUrl}/${cmdName}`;
  }

  const fallback = `${baseUrl}/search?q=${encodeURIComponent(text.trim())}&type=repositories`;

  if (!command) return fallback;

  const subcommand = subcmdName
    ? command.subcommands.find(s => s.name === subcmdName)
    : null;

  if (!subcommand) return fallback;

  try {
    return subcommand.url(args) ?? fallback;
  } catch {
    return fallback;
  }
}
