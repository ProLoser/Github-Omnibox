import { getSuggestions } from '../src/suggest.js';
import { COMMANDS } from '../src/commands.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function suggest(text, { historyRepos = [], searchRepos = [] } = {}) {
  return getSuggestions({ text, commands: COMMANDS, historyRepos, searchRepos });
}

function contents(suggestions) {
  return suggestions.map(s => s.content);
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('Stage 0 – free-type mode (repos surface immediately)', () => {
  const repos = ['facebook/react', 'microsoft/vscode', 'torvalds/linux'];

  test('empty input with history repos shows repos first, then commands', () => {
    const result = suggest('', { historyRepos: repos });
    const c = contents(result);
    // Repos appear before commands
    expect(c).toContain('facebook/react');
    expect(c).toContain('microsoft/vscode');
    // At least some commands still present
    expect(c).toContain('repo ');
    expect(c).toContain('issue ');
    // Repos come before commands (most-visited repo is index 0)
    expect(c.indexOf('facebook/react')).toBeLessThan(c.indexOf('repo '));
    // Total does not exceed omnibox limit
    expect(result.length).toBeLessThanOrEqual(10);
  });

  test('empty input with no history shows all commands', () => {
    const result = suggest('');
    const c = contents(result);
    for (const cmd of COMMANDS) {
      expect(c).toContain(`${cmd.name} `);
    }
  });

  test('partial matching a command shows commands + matching repos', () => {
    const result = suggest('r', { historyRepos: repos });
    const c = contents(result);
    expect(c).toContain('repo ');
    expect(c).toContain('run ');
    // Matching repos also shown
    expect(c).toContain('facebook/react');
    // Non-matching command not shown
    expect(c).not.toContain('issue ');
  });

  test('exact command prefix still shows that command', () => {
    const result = suggest('repo');
    expect(contents(result)).toContain('repo ');
  });

  test('non-command partial shows matching repos from history', () => {
    const result = suggest('face', { historyRepos: repos });
    const c = contents(result);
    expect(c).toContain('facebook/react');
    expect(c).not.toContain('microsoft/vscode');
    // No command suggestions when partial matches nothing
    expect(c).not.toContain('repo ');
  });

  test('non-command partial with no history offers GitHub search fallback', () => {
    const result = suggest('zzz');
    expect(result.length).toBe(1);
    expect(result[0].content).toBe('search repos zzz');
    expect(result[0].description).toContain('zzz');
  });

  test('owner/repo partial shows matching repos', () => {
    const result = suggest('facebook/', { historyRepos: repos, searchRepos: ['facebook/react'] });
    const c = contents(result);
    expect(c).toContain('facebook/react');
  });

  test('total suggestions do not exceed 10', () => {
    const reposForLimitTest = Array.from({ length: 8 }, (_, i) => `owner/repo${i}`);
    const result = suggest('', { historyRepos: reposForLimitTest });
    expect(result.length).toBeLessThanOrEqual(10);
  });

  test('repo suggestions have content without command prefix and description with match tag', () => {
    const result = suggest('face', { historyRepos: ['facebook/react'] });
    expect(result[0].content).toBe('facebook/react');
    expect(result[0].description).toContain('<match>facebook/react</match>');
  });
});

describe('Stage 1 – subcommand completion', () => {
  test('"repo " lists all repo subcommands', () => {
    const result = suggest('repo ');
    const repoSubs = COMMANDS.find(c => c.name === 'repo').subcommands;
    expect(result.length).toBe(repoSubs.length);
    expect(contents(result)).toContain('repo view ');
    expect(contents(result)).toContain('repo create ');
  });

  test('"repo v" filters to "view"', () => {
    const result = suggest('repo v');
    expect(contents(result)).toContain('repo view ');
    expect(contents(result)).not.toContain('repo create ');
  });

  test('"issue " lists all issue subcommands', () => {
    const result = suggest('issue ');
    expect(contents(result)).toContain('issue list ');
    expect(contents(result)).toContain('issue view ');
    expect(contents(result)).toContain('issue create ');
  });

  test('unknown command → empty', () => {
    expect(suggest('nope ')).toEqual([]);
  });
});

describe('Stage 2 – repo arg completion', () => {
  const repos = ['facebook/react', 'facebook/flux', 'microsoft/vscode'];

  test('"repo view " suggests repos from history and search', () => {
    const result = suggest('repo view ', { historyRepos: repos });
    expect(result.length).toBeGreaterThan(0);
    const c = contents(result);
    expect(c).toContain('repo view facebook/react');
    expect(c).toContain('repo view microsoft/vscode');
  });

  test('partial filter limits suggestions', () => {
    const result = suggest('repo view face', { historyRepos: repos });
    const c = contents(result);
    expect(c).toContain('repo view facebook/react');
    expect(c).toContain('repo view facebook/flux');
    expect(c).not.toContain('repo view microsoft/vscode');
  });

  test('history repos are deduped with search repos', () => {
    const result = suggest('repo view ', {
      historyRepos: ['facebook/react'],
      searchRepos: ['facebook/react', 'microsoft/vscode'],
    });
    const c = contents(result);
    // facebook/react should appear only once
    expect(c.filter(x => x === 'repo view facebook/react').length).toBe(1);
  });

  test('commands with multiple args add trailing space for continuation', () => {
    // issue view has argTypes: ['repo','number'] → repo arg should have trailing space
    const result = suggest('issue view ', { historyRepos: ['facebook/react'] });
    expect(contents(result)).toContain('issue view facebook/react ');
  });

  test('commands with single repo arg do not add trailing space', () => {
    // repo view has argTypes: ['repo'] → final arg, no trailing space
    const result = suggest('repo view ', { historyRepos: ['facebook/react'] });
    expect(contents(result)).toContain('repo view facebook/react');
    expect(contents(result)).not.toContain('repo view facebook/react ');
  });
});

describe('Stage 2 – search (variadic query)', () => {
  test('"search repos " shows a hint suggestion', () => {
    const result = suggest('search repos ');
    expect(result.length).toBe(1);
    expect(result[0].content).toContain('search repos');
  });

  test('"search repos react" builds a preview URL', () => {
    const result = suggest('search repos react');
    expect(result[0].description).toContain('github.com/search');
    expect(result[0].description).toContain('react');
  });
});

describe('Stage 2 – no args commands', () => {
  test('"repo create " suggests navigation hint', () => {
    const result = suggest('repo create ');
    expect(result.length).toBe(1);
    expect(result[0].description).toContain('github.com/new');
  });
});

describe('Stage 2 – non-repo arg types', () => {
  test('number arg shows type hint', () => {
    const result = suggest('issue view facebook/react ');
    expect(result.length).toBe(1);
    expect(result[0].description).toContain('number');
  });
});

describe('result shape', () => {
  test('every suggestion has content and description strings', () => {
    for (const text of ['', 'repo ', 'repo view ', 'issue list ', 'face']) {
      const results = suggest(text, { historyRepos: ['a/b'] });
      for (const s of results) {
        expect(typeof s.content).toBe('string');
        expect(typeof s.description).toBe('string');
      }
    }
  });
});
