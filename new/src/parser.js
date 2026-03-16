/**
 * Tokenise omnibox input text.
 *
 * The Chrome omnibox fires onInputChanged with every keystroke; we need to
 * distinguish between *completed* tokens (those followed by whitespace) and
 * the *partial* token being currently typed.
 *
 * Examples
 *   ""                → { tokens: [],               partial: "" }
 *   "r"               → { tokens: [],               partial: "r" }
 *   "repo"            → { tokens: [],               partial: "repo" }
 *   "repo "           → { tokens: ["repo"],          partial: "" }
 *   "repo v"          → { tokens: ["repo"],          partial: "v" }
 *   "repo view "      → { tokens: ["repo","view"],   partial: "" }
 *   "repo view face"  → { tokens: ["repo","view"],   partial: "face" }
 */

/**
 * @param {string} text
 * @returns {{ tokens: string[], partial: string }}
 */
export function parse(text) {
  const endsWithSpace = text.length > 0 && /\s$/.test(text);
  const parts = text.trim().split(/\s+/).filter(Boolean);

  if (endsWithSpace) {
    return { tokens: parts, partial: '' };
  }
  return {
    tokens: parts.slice(0, -1),
    partial: parts[parts.length - 1] ?? '',
  };
}
