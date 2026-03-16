/**
 * Browser-history repo search.
 *
 * Queries chrome.history for visited GitHub repository pages and extracts
 * "owner/repo" strings, ranked by visit count (most-visited first).
 *
 * The `historySearch` parameter is injectable so the function is fully
 * unit-testable without a real browser.
 */

const REPO_URL_RE = /^https:\/\/github\.com\/([^/]+\/[^/]+)/;

/**
 * @param {string}   query         - partial text to filter URLs (e.g. "facebook")
 * @param {Function} historySearch - chrome.history.search (injectable)
 * @returns {Promise<string[]>} unique "owner/repo" strings, most-visited first
 */
export async function searchHistory(
  query,
  historySearch = /* istanbul ignore next */ globalThis.chrome?.history?.search,
) {
  if (typeof historySearch !== 'function') return [];

  const searchText = query
    ? `https://github.com/${query}`
    : 'https://github.com/';

  return new Promise(resolve => {
    historySearch({ text: searchText, maxResults: 30 }, items => {
      /** @type {Map<string, number>} repo → total visitCount */
      const counts = new Map();
      for (const item of items ?? []) {
        const m = item.url?.match(REPO_URL_RE);
        if (m) {
          const repo = m[1];
          counts.set(repo, (counts.get(repo) ?? 0) + (item.visitCount ?? 1));
        }
      }
      // Sort descending by visit count
      const sorted = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([repo]) => repo);
      resolve(sorted);
    });
  });
}
