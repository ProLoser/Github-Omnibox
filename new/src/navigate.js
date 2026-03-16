/**
 * URL resolver for onInputEntered.
 *
 * Given the final omnibox text (either raw typed text or the `content`
 * field of a selected suggestion), returns the best GitHub URL to open.
 *
 * Falls back to a GitHub search when the input cannot be parsed as a
 * known command — so pressing Enter is always useful.
 */

const FALLBACK_BASE = 'https://github.com/search?q=';

/**
 * Resolve typed/selected omnibox text to a GitHub URL.
 *
 * @param {string}   text     - text from onInputEntered
 * @param {object[]} commands - COMMANDS array from commands.js
 * @returns {string} destination URL
 */
export function resolve(text, commands) {
  const parts = text.trim().split(/\s+/).filter(Boolean);

  // Empty → GitHub home
  if (parts.length === 0) return 'https://github.com';

  const [cmdName, subcmdName, ...args] = parts;
  const command = commands.find(c => c.name === cmdName);

  // Looks like an owner/repo shorthand (e.g. "facebook/react")
  if (!command && /^[^/]+\/[^/]+$/.test(cmdName)) {
    return `https://github.com/${cmdName}`;
  }

  if (!command) {
    return `${FALLBACK_BASE}${encodeURIComponent(text.trim())}&type=repositories`;
  }

  const subcommand = subcmdName
    ? command.subcommands.find(s => s.name === subcmdName)
    : null;

  if (!subcommand) {
    return `${FALLBACK_BASE}${encodeURIComponent(text.trim())}&type=repositories`;
  }

  try {
    return subcommand.url(args) ?? `${FALLBACK_BASE}${encodeURIComponent(text.trim())}&type=repositories`;
  } catch {
    return `${FALLBACK_BASE}${encodeURIComponent(text.trim())}&type=repositories`;
  }
}
