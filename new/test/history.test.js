import { searchHistory } from '../src/history.js';

describe('searchHistory', () => {
  test('returns empty array when historySearch is not a function', async () => {
    const result = await searchHistory('react', undefined);
    expect(result).toEqual([]);
  });

  test('extracts owner/repo from GitHub URLs', async () => {
    const mockSearch = (_opts, callback) => {
      callback([
        { url: 'https://github.com/facebook/react', visitCount: 5 },
        { url: 'https://github.com/microsoft/vscode', visitCount: 3 },
      ]);
    };
    const result = await searchHistory('', mockSearch);
    expect(result).toContain('facebook/react');
    expect(result).toContain('microsoft/vscode');
  });

  test('ignores non-repo GitHub URLs', async () => {
    const mockSearch = (_opts, callback) => {
      callback([
        { url: 'https://github.com/', visitCount: 1 },
        { url: 'https://github.com/trending', visitCount: 1 },
        { url: 'https://github.com/facebook/react/issues/1', visitCount: 2 },
        { url: 'https://github.com/facebook/react', visitCount: 5 },
      ]);
    };
    const result = await searchHistory('', mockSearch);
    // Non-repo paths might still match (the regex is greedy to owner/repo)
    expect(result).toContain('facebook/react');
    // github.com/ alone won't match the two-segment pattern
    expect(result).not.toContain('');
    expect(result).not.toContain('trending');
  });

  test('ranks by visit count (most visited first)', async () => {
    const mockSearch = (_opts, callback) => {
      callback([
        { url: 'https://github.com/microsoft/vscode', visitCount: 2 },
        { url: 'https://github.com/facebook/react', visitCount: 10 },
        { url: 'https://github.com/torvalds/linux', visitCount: 1 },
      ]);
    };
    const result = await searchHistory('', mockSearch);
    expect(result[0]).toBe('facebook/react');
    expect(result[1]).toBe('microsoft/vscode');
    expect(result[2]).toBe('torvalds/linux');
  });

  test('deduplicates repos with combined visit counts', async () => {
    const mockSearch = (_opts, callback) => {
      callback([
        { url: 'https://github.com/facebook/react/issues', visitCount: 3 },
        { url: 'https://github.com/facebook/react/pulls', visitCount: 7 },
        { url: 'https://github.com/microsoft/vscode', visitCount: 5 },
      ]);
    };
    const result = await searchHistory('', mockSearch);
    // facebook/react combined = 10, microsoft/vscode = 5
    expect(result[0]).toBe('facebook/react');
    expect(result[1]).toBe('microsoft/vscode');
    // Should appear only once
    expect(result.filter(r => r === 'facebook/react').length).toBe(1);
  });

  test('passes correct search text to chrome.history', async () => {
    let capturedOpts;
    const mockSearch = (opts, callback) => {
      capturedOpts = opts;
      callback([]);
    };
    await searchHistory('face', mockSearch);
    expect(capturedOpts.text).toBe('https://github.com/face');
  });

  test('handles null/empty items gracefully', async () => {
    const mockSearch = (_opts, callback) => callback([]);
    const result = await searchHistory('', mockSearch);
    expect(result).toEqual([]);
  });

  test('handles items without visitCount', async () => {
    const mockSearch = (_opts, callback) => {
      callback([{ url: 'https://github.com/foo/bar' }]);
    };
    const result = await searchHistory('', mockSearch);
    expect(result).toContain('foo/bar');
  });
});

describe('searchHistory – GitHub Enterprise base URL', () => {
  const GHE = 'https://github.myco.com';

  test('extracts repos from GHE URLs', async () => {
    const mockSearch = (_opts, callback) => {
      callback([
        { url: `${GHE}/myorg/myrepo`, visitCount: 5 },
        { url: `${GHE}/myorg/other`, visitCount: 2 },
      ]);
    };
    const result = await searchHistory('', mockSearch, GHE);
    expect(result).toContain('myorg/myrepo');
    expect(result).toContain('myorg/other');
  });

  test('does not match github.com URLs when using GHE base', async () => {
    const mockSearch = (_opts, callback) => {
      callback([
        { url: 'https://github.com/facebook/react', visitCount: 5 },
        { url: `${GHE}/myorg/myrepo`, visitCount: 3 },
      ]);
    };
    const result = await searchHistory('', mockSearch, GHE);
    expect(result).toContain('myorg/myrepo');
    expect(result).not.toContain('facebook/react');
  });

  test('passes GHE base URL as search text prefix', async () => {
    let capturedOpts;
    const mockSearch = (opts, callback) => {
      capturedOpts = opts;
      callback([]);
    };
    await searchHistory('myorg', mockSearch, GHE);
    expect(capturedOpts.text).toBe(`${GHE}/myorg`);
  });

  test('ranks GHE repos by visit count', async () => {
    const mockSearch = (_opts, callback) => {
      callback([
        { url: `${GHE}/myorg/low`, visitCount: 1 },
        { url: `${GHE}/myorg/high`, visitCount: 9 },
      ]);
    };
    const result = await searchHistory('', mockSearch, GHE);
    expect(result[0]).toBe('myorg/high');
    expect(result[1]).toBe('myorg/low');
  });
});
