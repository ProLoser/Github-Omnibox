import { searchGitHub } from '../src/search.js';

/** Builds a mock fetch that returns a GitHub search API response */
function makeFetcher(items = []) {
  return async () => ({
    ok: true,
    json: async () => ({ items }),
  });
}

describe('searchGitHub', () => {
  test('returns empty array for short or empty queries', async () => {
    const fetcher = makeFetcher([{ full_name: 'facebook/react' }]);
    expect(await searchGitHub('', fetcher)).toEqual([]);
    expect(await searchGitHub('r', fetcher)).toEqual([]);
  });

  test('returns full_name list from API response', async () => {
    const fetcher = makeFetcher([
      { full_name: 'facebook/react' },
      { full_name: 'facebook/flux' },
    ]);
    const result = await searchGitHub('react', fetcher);
    expect(result).toEqual(['facebook/react', 'facebook/flux']);
  });

  test('returns empty array when response is not ok', async () => {
    const fetcher = async () => ({ ok: false, json: async () => ({}) });
    expect(await searchGitHub('react', fetcher)).toEqual([]);
  });

  test('returns empty array on network error', async () => {
    const fetcher = async () => { throw new Error('network error'); };
    expect(await searchGitHub('react', fetcher)).toEqual([]);
  });

  test('returns empty array when fetcher is not a function', async () => {
    expect(await searchGitHub('react', undefined)).toEqual([]);
    expect(await searchGitHub('react', null)).toEqual([]);
  });

  test('calls the correct GitHub Search API URL', async () => {
    let capturedUrl;
    const fetcher = async (url, _opts) => {
      capturedUrl = url;
      return { ok: true, json: async () => ({ items: [] }) };
    };
    await searchGitHub('react hooks', fetcher);
    expect(capturedUrl).toContain('api.github.com/search/repositories');
    expect(capturedUrl).toContain(encodeURIComponent('react hooks'));
  });

  test('handles missing items field in API response', async () => {
    const fetcher = async () => ({ ok: true, json: async () => ({}) });
    expect(await searchGitHub('react', fetcher)).toEqual([]);
  });
});
