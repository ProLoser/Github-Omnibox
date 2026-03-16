/**
 * GitHub online repository search — no authentication required.
 *
 * Uses the public GitHub Search API to find repositories matching a query.
 * The `fetcher` parameter is injectable so the function is fully
 * unit-testable without real network calls.
 */

const SEARCH_URL = 'https://api.github.com/search/repositories';
const MIN_QUERY_LENGTH = 2;

/**
 * @param {string}   query   - partial repo name or owner/repo
 * @param {Function} fetcher - fetch implementation (injectable)
 * @returns {Promise<string[]>} "owner/repo" strings sorted by GitHub's ranking
 */
export async function searchGitHub(
  query,
  fetcher = /* istanbul ignore next */ globalThis.fetch,
) {
  if (!query || query.length < MIN_QUERY_LENGTH) return [];
  if (typeof fetcher !== 'function') return [];

  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&per_page=5&sort=stars`;

  try {
    const response = await fetcher(url, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.items ?? []).map(item => item.full_name);
  } catch {
    return [];
  }
}
